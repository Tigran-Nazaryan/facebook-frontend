import React from "react";

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <main className="container mx-auto w-full">{children}</main>;
};
