"use client";

import {redirect, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useAuth} from "@/store/Auth";


export default function GeneralLayout({children}: {
  children: React.ReactNode;
}) {
  const {isAuth, isLoading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !isLoading) {
      router.push("/login");
    } else {
      redirect("/auth");
    }
  }, [isAuth, router, isLoading]);

  if (isLoading || isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto min-h-screen bg-gray-100">
          {children}
      </main>
    </>
  );
}
