"use client";
import { AssignBadgeScholar } from "@/features/badge/components/AssignBadgeScholar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AssignScholarAchievement from "@/features/scholar-achievement/components/AssignScholarAchievement";
import { Scholar } from "@/types/scholar";
import {
  Badge,
  CheckCircle2,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ScholarCellAction({ data }: { data: Scholar }) {
  const router = useRouter();
  const [isAssignBadgeModalOpen, setIsAssignBadgeModalOpen] = useState(false);
  const [isAssignAchievementModalOpen, setIsAssignAchievementModalOpen] =
    useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/statistic/${data.username}`)}
        >
          <GraduationCap size={16} className="text-primary-hover" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsAssignBadgeModalOpen(true)}>
          <CheckCircle2 size={16} className="text-primary-hover" />
          Assign Badge
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsAssignAchievementModalOpen(true)}>
          <Badge size={16} className="text-primary-hover" />
          Assign Achievement
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isAssignBadgeModalOpen && (
        <AssignBadgeScholar
          open={isAssignBadgeModalOpen}
          onOpenChange={setIsAssignBadgeModalOpen}
          scholars={[data]}
        />
      )}
      {isAssignAchievementModalOpen && (
        <AssignScholarAchievement
          open={isAssignAchievementModalOpen}
          onOpenChange={setIsAssignAchievementModalOpen}
          scholars={[data]}
        />
      )}
    </DropdownMenu>
  );
}
