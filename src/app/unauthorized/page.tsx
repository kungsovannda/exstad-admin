"use client";
import { signIn } from "next-auth/react";
import React from "react";

export default function Page() {
  return (
    <div>
      Unauthorized
      <button onClick={() => signIn()}>SignIN</button>
    </div>
  );
}
