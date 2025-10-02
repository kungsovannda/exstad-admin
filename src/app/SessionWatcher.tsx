"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return null;
}
