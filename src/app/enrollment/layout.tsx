"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Brain,
  Briefcase,
  ChartAreaIcon,
  Globe,
  Layers,
  School,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import Loader from "../loading";

const groups = [
  {
    title: "Enrollment Information",
    items: [
      {
        title: "Overview",
        url: "/enrollment",
        icon: ChartAreaIcon,
      },
      {
        title: "Pre University",
        url: "/enrollment/pre-university",
        icon: School,
      },
      {
        title: "Foundation",
        url: "/enrollment/foundation",
        icon: Layers,
      },
      {
        title: "Full Stack Web Development",
        url: "/enrollment/full-stack-web-development",
        icon: Globe,
      },
      {
        title: "IT Expert",
        url: "/enrollment/it-expert",
        icon: Brain,
      },
      {
        title: "IT Professional",
        url: "/enrollment/it-professional",
        icon: Briefcase,
      },
    ],
  },
];

function EnrollmentSidebar() {
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

export default function EnrollmentLayout({
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
          <EnrollmentSidebar />
        </div>
        <ScrollArea className="h-screen w-full overflow-x-hidden">
          <main className="p-5 mb-10 h-fit">
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </main>
        </ScrollArea>
      </SidebarProvider>
    </main>
  );
}
