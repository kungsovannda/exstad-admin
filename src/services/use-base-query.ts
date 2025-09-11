
"use client";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const useBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken"); // or session token
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
  
});

