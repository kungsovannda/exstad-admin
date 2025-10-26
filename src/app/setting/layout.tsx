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
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Map,
  MapPinHouse,
  PanelLeftIcon,
  SettingsIcon,
  University,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import Loader from "../loading";
import { useAppSelector } from "@/lib/hooks";

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
    <Sidebar
      collapsible="icon"
      className="border-r static h-content overflow-y-hidden"
    >
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
  const preference = useAppSelector((state) => state.preference.sidebar);

  return (
    <main className="flex flex-row h-content overflow-y-hidden">
      <SidebarProvider open={open} defaultOpen={open}>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() =>
            setTimeout(() => setOpen(!open), preference?.child?.delay ?? 3000)
          }
          className="flex h-content"
        >
          <SettingSidebar />
        </div>
        <ScrollArea className="h-content w-full overflow-x-hidden">
          <main className="p-6 h-fit">
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </main>
        </ScrollArea>
      </SidebarProvider>
    </main>
  );
}
