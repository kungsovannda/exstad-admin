"use client";
import AppSidebar from "@/components/app-sidebar/AppSidebar";
import { SiteHeader } from "@/components/app-sidebar/SiteHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const noLayout = ["/unauthorized", "/login"];
  const pathname = usePathname();
  return (
    <>
      {noLayout.includes(pathname) ? (
        children
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SiteHeader /> {children}
          </main>
        </SidebarProvider>
      )}
    </>
  );
}
