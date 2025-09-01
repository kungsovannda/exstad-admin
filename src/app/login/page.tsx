"use client";
import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Loader from "../loading";

export default function Login() {
  const param = useSearchParams();
  useEffect(() => {
    signIn("keycloak", { callbackUrl: param.get("callbackUrl") || "/" });
  }, [param]);
  return <Loader />;
}
