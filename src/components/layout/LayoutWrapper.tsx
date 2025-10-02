"use client";
import AppSidebar from "@/components/app-sidebar/AppSidebar";
import { SiteHeader } from "@/components/app-sidebar/SiteHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

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
          <main className="h-screen overflow-y-hidden w-full">
            <SiteHeader />
            <ScrollArea className="h-content">
              <div className="h-full">{children}</div>
            </ScrollArea>
          </main>
        </SidebarProvider>
      )}
    </>
  );
}
