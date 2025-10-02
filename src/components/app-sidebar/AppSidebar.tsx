"use client";

import {
  Award,
  BookOpen,
  Bot,
  FileText,
  GraduationCap,
  Settings,
  User2,
  UserCheck,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/app-sidebar/NavMain";
import { NavUser } from "@/components/app-sidebar/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: Bot,
      isActive: true,
    },
    {
      title: "Enrollment",
      url: "/enrollment",
      icon: UserCheck,
      isActive: true,
    },
    {
      title: "Program",
      url: "",
      icon: BookOpen,
      items: [
        {
          title: "Master Program",
          url: "/master-program",
        },
        {
          title: "Opening Program",
          url: "/opening-program",
        },
      ],
    },
    {
      title: "Scholar",
      url: "",
      icon: GraduationCap,
      items: [
        {
          title: "Statistic",
          url: "/statistic",
        },
        {
          title: "Achievement",
          url: "/achievement",
        },
        {
          title: "Verification",
          url: "/verification",
        },
      ],
    },
    {
      title: "Transcript",
      url: "/transcript",
      icon: FileText,
    },
    {
      title: "Certificate",
      url: "/certificate",
      icon: Award,
    },
    {
      title: "User",
      url: "/user",
      icon: User2,
    },
    {
      title: "Setting",
      url: "/setting",
      icon: Settings,
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="z-50" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                {/* <OmegaIcon className="!size-5" /> */}
                <span>
                  <Image
                    width={20}
                    height={20}
                    src="/favicon.ico"
                    alt="logo"
                    className="h-8 w-8"
                  />
                </span>
                <span className="text-base font-semibold">
                  Experimental STAD
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
