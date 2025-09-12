"use client";
import React from "react";
import {NavMenu} from "@/components/layout/navigation/Menu";
import {Main} from "@/components/layout/main";

const Header = () => {
  return (
    <header className="w-full border-b bg-white shadow-sm h-[80px] flex items-center">
      <Main>
        <NavMenu/>
      </Main>
    </header>
  );
};

export default Header;
