"use client";

import {useAuth} from "@/store/Auth";

const Home = () => {
  const {user} = useAuth();
  if(!user.isVerified) {
    alert("Please activate your account by clicking the link");
  }
  return 123
}

export default Home
