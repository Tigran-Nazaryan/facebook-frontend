'use client'
import React from "react";
import {LoginForm} from "@/components/auth/login/LoginForm";
import {useAuth} from "@/store/Auth";

export default function Page() {
  const {isLoading} = useAuth();

  if(isLoading) {
    return <div className="flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-[500px]">
        <LoginForm />
      </div>
    </div>
  )
}
