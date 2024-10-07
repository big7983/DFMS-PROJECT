"use client";

import { Inter } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
