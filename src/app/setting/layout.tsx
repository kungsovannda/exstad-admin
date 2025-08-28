"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Map, MapPinHouse, SettingsIcon, University } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const groups = [
  {
    title: "Configuration",
    items: [
      {
        title: "General",
        url: "/setting",
        icon: SettingsIcon,
      },
    ],
  },
  {
    title: "Address Information",
    items: [
      {
        title: "University",
        url: "/setting/university",
        icon: University,
      },
      {
        title: "Province",
        url: "/setting/province",
        icon: MapPinHouse,
      },
      {
        title: "Current Address",
        url: "/setting/current-address",
        icon: Map,
      },
    ],
  },
];

function SettingSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" className="border-r static">
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname == item.url}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <main className="flex flex-row h-screen">
      <SidebarProvider open={open} defaultOpen={open}>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="flex"
        >
          <SettingSidebar />
        </div>
        <ScrollArea className="p-5 h-screen w-full overflow-x-hidden">
          {children}
        </ScrollArea>
      </SidebarProvider>
    </main>
  );
}
