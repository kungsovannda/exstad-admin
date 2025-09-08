"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useUrlParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  return { setParam, removeParam, getParam };
}
