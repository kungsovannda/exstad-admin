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
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { ChartAreaIcon, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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
      // {
      //   title: "Pre University",
      //   url: "/enrollment/pre-university",
      //   icon: School,
      // },
      // {
      //   title: "Foundation",
      //   url: "/enrollment/foundation",
      //   icon: Layers,
      // },
      // {
      //   title: "Full Stack Web Development",
      //   url: "/enrollment/full-stack-web-development",
      //   icon: Globe,
      // },
      // {
      //   title: "IT Expert",
      //   url: "/enrollment/it-expert",
      //   icon: Brain,
      // },
      // {
      //   title: "IT Professional",
      //   url: "/enrollment/it-professional",
      //   icon: Briefcase,
      // },
    ],
  },
  {
    title: "Programs",
    items: [],
  },
];

function EnrollmentSidebar() {
  const pathname = usePathname();
  const [defaultGroup, setDefaultGroup] = useState(groups);
  const { data: programs } = useGetAllMasterProgramsQuery();

  useEffect(() => {
    if (!programs) return;

    setDefaultGroup((prevGroups) => {
      const programsGroupIndex = prevGroups.findIndex(
        (group) => group.title === "Programs"
      );
      if (programsGroupIndex === -1) return prevGroups;

      const programGroup = programs.map((program) => ({
        title: program.title,
        url: `/enrollment/${program.slug}`,
        icon: Layers,
      }));

      const updatedGroups = [...prevGroups];
      updatedGroups[programsGroupIndex] = {
        ...updatedGroups[programsGroupIndex],
        items: programGroup,
      };

      return updatedGroups;
    });
  }, [programs]);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r static h-content overflow-y-hidden"
    >
      <SidebarContent>
        {defaultGroup.map((group) => (
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
                      <span className="line-clamp-1">{item.title}</span>
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
    <main className="flex flex-row h-content overflow-y-hidden">
      <SidebarProvider open={open} defaultOpen={open}>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="flex h-content "
        >
          <EnrollmentSidebar />
        </div>
        <ScrollArea
          scrollHideDelay={0}
          className="h-content w-full overflow-x-hidden "
        >
          <main className="h-content">
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </main>
        </ScrollArea>
      </SidebarProvider>
    </main>
  );
}
