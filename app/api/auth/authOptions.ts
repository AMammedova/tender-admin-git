import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { authService } from "@/lib/api/auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 saat
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Email və şifrə tələb olunur");
        }
        try {
          const { accessToken, id, username, email } = await authService.login({
            username: credentials.username,
            password: credentials.password,
          });
          if (accessToken.token) {
            return {
              id: id || '',
              username: username || '',
              email: email || '',
              token: accessToken.token,
            };
          } else {
            throw new Error("Giriş zamanı xəta baş verdi");
          }
        } catch (error: any) {
          throw new Error(error.message || "Giriş zamanı xəta baş verdi");
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      if (user) {
        token.user = user;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};
