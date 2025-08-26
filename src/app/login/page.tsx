"use client";
import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const param = useSearchParams();
  useEffect(() => {
    signIn("keycloak", { callbackUrl: param.get("callbackUrl") || "/" });
  }, [param]);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      Redirect to keycloak...
    </div>
  );
}
