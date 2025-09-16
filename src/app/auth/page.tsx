"use client";

import {useAuth} from "@/store/Auth";
import {useEffect} from "react";

const Home = () => {
  const {user} = useAuth();

  useEffect(() => {
    if (user && typeof user.isVerified === "boolean") {
      if (!user.isVerified) {
        const alreadyShown = sessionStorage.getItem("verify-alert");
        if (!alreadyShown) {
          alert("Please activate your account by clicking the link");
          sessionStorage.setItem("verify-alert", "true");
        }
      }
    }
  }, [user?.isVerified]);

  return 123
}

export default Home
