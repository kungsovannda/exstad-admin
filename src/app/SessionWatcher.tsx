"use client";
import { useGetCurrentUserQuery } from "@/features/user/userApi";
import { removeUser, setUser } from "@/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export function SessionWatcher() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.userReducer.currentUser);

  const { data: user, error } = useGetCurrentUserQuery(undefined, {
    skip: !session?.user?.email,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      dispatch(removeUser());
      signOut({ callbackUrl: "/login" });
      return;
    }

    if (error) {
      if ("status" in error && (error.status === 401 || error.status === 403)) {
        dispatch(removeUser());
        signOut({ callbackUrl: "/login" });
        return;
      }
    }

    if (user && session) {
      dispatch(setUser(user));
    }

    if (status === "unauthenticated" && currentUser) {
      dispatch(removeUser());
    }
  }, [session, user, error, status, currentUser, dispatch]);

  return null;
}
