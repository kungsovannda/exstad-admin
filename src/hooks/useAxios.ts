import { useSession } from "next-auth/react";
import axios from "axios";
import { useMemo } from "react";

export const useAxios = () => {
  const { data: session } = useSession();

  const authenticatedAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    });

    instance.interceptors.request.use((config) => {
      const token = session?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [session?.accessToken]);

  return authenticatedAxios;
};
