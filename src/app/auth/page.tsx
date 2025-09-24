"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("justRegistered") === "true") {
      alert("Registration successful! Confirm your account via email.");
      router.replace("/auth");
    }
  }, [searchParams, router]);

  return <div>123</div>;
};

export default Home;
