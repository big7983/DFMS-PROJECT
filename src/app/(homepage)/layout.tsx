"use client";

import HomeLayout from "@/components/Layouts/HomeLayout";
import Loader from "@/components/Loader";
import "@/css/satoshi.css";
import "@/css/style.css";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body>
        <HomeLayout>{loading ? <Loader /> : children}</HomeLayout>
      </body>
    </html>
  );
}
