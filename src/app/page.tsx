"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/store/Auth";

export default function Home() {
  const router = useRouter();
  const { isAuth, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuth) {
      router.push("/auth");
    }
  }, [isAuth, isLoading, router]);

  return null;
}
