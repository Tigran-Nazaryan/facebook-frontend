"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/store/Auth";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { verifyUser } = useAuth();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setMessage("No token provided.");
      return;
    }

    const verify = async () => {
      try {
        await verifyUser(token);
        setMessage("Email verified! Redirecting...");

        router.push("/auth");
      } catch (e: any) {
        setMessage("Verification failed: " + e.message);
      }
    };

    verify();
  }, [token, router, verifyUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-center">{message}</p>
    </div>
  );
}
