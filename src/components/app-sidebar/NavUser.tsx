"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUserByEmailQuery } from "@/features/user/userApi";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toRole, User } from "@/types/user";
import { toGender } from "@/types/scholar";
import ViewUserProfile from "@/features/user/components/ViewUserProfile";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);

  const { data: userDb } = useGetUserByEmailQuery(session?.user.email ?? "", {
    skip: !session,
  });

  const userKc = {
    username: session?.user.username || "",
    email: session?.user.email || "",
    avatar: "",
  };

  useEffect(() => {
    setUser({
      uuid: userDb?.uuid ?? "N/A",
      audit: userDb?.audit ?? {
        createdAt: "N/A",
        createdBy: "N/A",
        updatedAt: "N/A",
        updatedBy: "N/A",
      },
      dob: userDb?.dob ?? "N/A",
      email: userKc.email,
      username: userKc?.username ?? userDb?.username ?? "N/A",
      englishName: userDb?.englishName ?? userKc?.username,
      gender: userDb?.gender ?? toGender("Others"),
      khmerName: userDb?.khmerName ?? "N/A",
      role: userDb?.role ?? toRole("Admin"),
    });
  }, [
    userDb?.uuid,
    userDb?.audit,
    userKc?.username,
    userDb?.dob,
    userDb?.username,
    userDb?.gender,
    userDb?.khmerName,
    userDb?.role,
    userKc.email,
    userDb?.englishName,
  ]);

  if (!session) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="z-60">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.englishName} />
                <AvatarFallback className="rounded-lg">
                  {user?.englishName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.englishName}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.englishName} />
                  <AvatarFallback className="rounded-lg">
                    {user?.englishName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.englishName}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsViewProfileOpen(true)}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      {isViewProfileOpen && (
        <ViewUserProfile
          open={isViewProfileOpen}
          onOpenChange={setIsViewProfileOpen}
          user={user ?? null}
        />
      )}
    </SidebarMenu>
  );
}
