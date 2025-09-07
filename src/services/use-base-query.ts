
"use client";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const useBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    return headers;
  },
});
