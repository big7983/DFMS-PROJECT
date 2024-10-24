"use client";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { SiWindows11 } from "react-icons/si";
import { IoIosLogIn } from "react-icons/io";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loader from "@/components/Loader";

interface User {
  username: string;
  password: string;
}

export default function Login() {
  const initialValue: User = { username: "admin", password: "admin" };

  const { control } = useForm<User>({
    defaultValues: initialValue,
  });

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
      <Loader />;
    }
  }, [session, router]);

  const loginms = () => {
    signIn("azure-ad")
    return(
      <Loader />
    )
  };

  const showForm = () => {
    return (
      <form
      // onSubmit={handleSubmit((value: User) => {
      //   alert(JSON.stringify(value));
      // })}
      >
        {/* Username */}

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Username"
              autoComplete="email"
              autoFocus
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              autoComplete="password"
              autoFocus
            />
          )}
        />

        <button className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white/50 font-medium text-gray-700 hover:bg-[#F0F2F5]">
          <IoIosLogIn className="mr-3" />
          Login
        </button>
      </form>
    );
  };

  return (
    <Box className="flex justify-center items-center h-screen p-[30px] bg-bodywhite2">
      <Card className="max-w-[450px] p-[50px] rounded-[20px] bg-white">
        <CardContent>
          <Box className="flex flex-col items-center justify-center gap-[20px]">
            <Image
              src="/logo-ssi-clear-01.png"
              alt="Logo"
              width={75}
              height={75}
            />
            <Typography className="font-bold text-[24px] text-center">
              ระบบจัดการแบบฟอร์มดิจิทัล
            </Typography>
          </Box>
          {showForm()}
          <button
            className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white/50 font-medium text-gray-700 hover:bg-[#F0F2F5]"
            onClick={loginms}
          >
            <SiWindows11 className="mr-3" />
            Login With Microsoft
          </button>
        </CardContent>
      </Card>
    </Box>
  );
}
