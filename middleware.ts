// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// Create the next-intl middleware for localization
const intlMiddleware = createMiddleware({
  locales: ["en", "az", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
});

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/products", "/statistics", "/settings"];

export default function middleware(request: NextRequest) {
  try {
    // Get the pathname of the request
    const { pathname } = request.nextUrl;
    
    // First, let's handle the intl middleware
    const response = intlMiddleware(request);

    // Get locale from the path
    let locale = request.nextUrl.pathname.split('/')[1];
    
    // If locale is not valid, use default
    if (!["en", "az", "ru"].includes(locale)) {
      locale = "en";
    }
    
    // Path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(en|az|ru)/, "");

    // Check for NextAuth session token
    const sessionToken = request.cookies.get("next-auth.session-token")?.value 
                      || request.cookies.get("__Secure-next-auth.session-token")?.value;

    // Check if trying to access a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathWithoutLocale.startsWith(route)
    );

    // If trying to access root ("/") without session, redirect to login
    if (pathWithoutLocale === "/" && !sessionToken) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Redirect to login if trying to access protected route without session
    if (!sessionToken && isProtectedRoute) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to statistics if accessing login with valid session
    if (pathWithoutLocale === "/login" && sessionToken) {
      const dashboardUrl = new URL(`/${locale}/statistics`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of error, continue to the requested resource
    return NextResponse.next();
  }
}

export const config = {
  // Match all paths except for:
  // - API routes (/api/*)
  // - Next.js specific files (/_next/*)
  // - Static files (images, assets) with file extensions
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};