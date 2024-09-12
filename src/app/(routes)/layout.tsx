"use client";

import HomeLayout from "@/components/Layouts/HomeLayout";
import SessionWrapper from "@/components/SessionWrapper";
import "@/css/satoshi.css";
import "@/css/style.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body>
          <HomeLayout>{children}</HomeLayout>
        </body>
      </SessionWrapper>
    </html>
  );
}
