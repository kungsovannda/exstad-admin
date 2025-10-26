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
  SidebarMenuSkeleton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { ChartAreaIcon, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loader from "../loading";
import { useAppSelector } from "@/lib/hooks";

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
    title: "Scholarship",
    items: [],
  },
  {
    title: "Short course",
    items: [],
  },
];

function EnrollmentSidebar() {
  const pathname = usePathname();
  const [defaultGroup, setDefaultGroup] = useState(groups);
  const { data: programs, isLoading } = useGetAllMasterProgramsQuery();

  useEffect(() => {
    if (!programs) return;

    setDefaultGroup((prevGroups) => {
      const scholarShipGroupIndex = prevGroups.findIndex(
        (group) => group.title === "Scholarship"
      );

      if (scholarShipGroupIndex === -1) return prevGroups;

      const scholarShipGroup = programs
        .filter((p) => p.programType === "SCHOLARSHIP")
        .map((program) => ({
          title: program.title,
          url: `/enrollment/${program.slug}?type=scholarship`,
          icon: Layers,
        }));
      const shortCourseGroupIndex = prevGroups.findIndex(
        (group) => group.title === "Short course"
      );

      if (shortCourseGroupIndex === -1) return prevGroups;

      const shortCourseGroup = programs
        .filter((p) => p.programType === "SHORT_COURSE")
        .map((program) => ({
          title: program.title,
          url: `/enrollment/${program.slug}?type=short-course`,
          icon: Layers,
        }));

      const updatedGroups = [...prevGroups];
      updatedGroups[scholarShipGroupIndex] = {
        ...updatedGroups[scholarShipGroupIndex],
        items: scholarShipGroup,
      };
      updatedGroups[shortCourseGroupIndex] = {
        ...updatedGroups[shortCourseGroupIndex],
        items: shortCourseGroup,
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
            {!isLoading && group.items.length === 0 ? (
              ""
            ) : (
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            )}
            {["Scholarship", "Short course"].includes(group.title) &&
            isLoading ? (
              <SidebarMenu>
                {[1, 2, 3].map((i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
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
            )}
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
  const preference = useAppSelector((state) => state.preference.sidebar);

  return (
    <main className="flex flex-row h-content overflow-y-hidden">
      <SidebarProvider open={open} defaultOpen={open}>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() =>
            setTimeout(() => setOpen(false), preference?.child?.delay ?? 3000)
          }
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
