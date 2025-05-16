import React from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${params.locale}/login`);
  }
  return <DefaultLayout>{children}</DefaultLayout>;
}
