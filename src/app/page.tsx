"use client";
import { signOut } from "next-auth/react";

export default function Home() {
  const handleLogout = () => {
    signOut().catch((error) => console.log(error));
  };

  return (
    <div>
      Welcome
      <button onClick={handleLogout}></button>
    </div>
  );
}
