// provider/providers.tsx
"use client";

import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextAuthProvider } from "./NextAuthProvider";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
  session: Session | null;
}

const queryClient = new QueryClient();

export function Providers({
  children,
  locale,
  messages,
  session,
}: ProvidersProps) {


  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <NextAuthProvider session={session}>
          <ToastContainer
            style={{ zIndex: 999999999 }}
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              fontSize: '14px',
              fontWeight: 500,
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
            }}
          />
          {children}
        </NextAuthProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}