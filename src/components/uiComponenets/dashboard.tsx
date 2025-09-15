"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Header from "@/components/layout/header";
import {Footer} from "@/components/layout/footer";
import {useAuth} from "@/store/Auth";


export default function DashboardLayout({children}: {
  children: React.ReactNode;
}) {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
      console.log("33333")
    }
  }, [isAuth, router]);

  if (!isAuth) return null;

  return (
    <>
      <Header />
      <main className="container mx-auto min-h-screen bg-gray-100">
        {children}
      </main>
      <Footer />
    </>
  );
}
