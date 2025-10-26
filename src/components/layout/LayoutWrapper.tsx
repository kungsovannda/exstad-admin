"use client";
import AppSidebar from "@/components/app-sidebar/AppSidebar";
import { SiteHeader } from "@/components/app-sidebar/SiteHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/hooks";
import { usePathname } from "next/navigation";
import React from "react";
import { Toaster } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const noLayout = ["/unauthorized", "/login"];
  const pathname = usePathname();
  const preference = useAppSelector((state) => state.preference);
  return (
    <>
      {noLayout.includes(pathname) ? (
        children
      ) : (
        <SidebarProvider defaultOpen={preference.sidebar?.parent?.defaultOpen}>
          <AppSidebar />
          <main className="h-screen overflow-y-hidden w-full">
            <SiteHeader />
            <ScrollArea className="h-content">
              <div className="h-full">{children}</div>
            </ScrollArea>
            <Toaster
              duration={preference.toast?.duration}
              expand={preference.toast?.expand}
              closeButton={preference.toast?.closeButton}
              richColors={preference.toast?.richColor}
              position={preference.toast?.position ?? "top-right"}
            />
          </main>
        </SidebarProvider>
      )}
    </>
  );
}
