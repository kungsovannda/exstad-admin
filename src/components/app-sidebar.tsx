"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  User,
  ShieldCheck,
  Command,
  Newspaper,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./button/ModeToggle";

// This is sample data.
const data = {
  user: {
    name: "Tong Bora",
    email: "tongbora.official@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/test",
      icon: SquareTerminal,
    },
    {
      title: "Program",
      url: "/test",
      icon: Command,
      isActive: true,
      items: [
        {
          title: "Our Program",
          url: "/test",
        },
        {
          title: "Opening Program",
          url: "/test",
        },
      ],
    },
    {
      title: "Scholar",
      url: "#",
      icon: User,
      items: [
        {
          title: "Statistics",
          url: "/test",
        },
        {
          title: "Achievement",
          url: "/test",
        },
        {
          title: "Verrification",
          url: "/test",
        },
      ],
    },
    {
      title: "Transcript",
      url: "/test",
      icon: BookOpen,
    },
    {
      title: "Enrollment",
      url: "/test",
      icon: Newspaper,
    },
    {
      title: "Certificate",
      url: "/test",
      icon: ShieldCheck,
    },
    {
      title: "User",
      url: "/test",
      icon: User,
    },
    {
      title: "Settings",
      url: "/test",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-2 ">
        <Link href="/">
          <Image
            src="/logo/exstad.png"
            alt="Logo"
            width={50}
            height={50}
            className="ml-4"
          />
        </Link>
        <ModeToggle />
      </div>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
