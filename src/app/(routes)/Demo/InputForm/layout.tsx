"use client";

import SessionWrapper from "@/components/SessionWrapper";
import "@/css/satoshi.css";
import "@/css/style.css";
import LayoutPage from "../component_test/LayoutPage";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body>
          <LayoutPage>{children}</LayoutPage>
        </body>
      </SessionWrapper>
    </html>
  );
}
