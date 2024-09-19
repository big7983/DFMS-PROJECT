"use client";

import HomeLayout from "@/components/Layouts/HomeLayout";
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
          <HomeLayout>{children}</HomeLayout>
        </body>
    </html>
  );
}
