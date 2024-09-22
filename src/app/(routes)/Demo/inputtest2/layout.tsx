"use client";

import DefaultLayout from "@/components/Layouts/layouttest";
import "@/css/satoshi.css";
import "@/css/style.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
      <DefaultLayout>
          {children}
      </DefaultLayout>
      </body>
    </html>
  );
}
