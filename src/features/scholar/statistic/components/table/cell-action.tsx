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
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import ModalDelete from "@/components/modal/ModalDelete";
import { useSoftDeleteScholarMutation } from "@/features/scholar/scholarApi";
import { toast } from "sonner";

export default function ScholarCellAction({ data }: { data: Scholar }) {
  const router = useRouter();
  const { hasRole } = useAuth();
  const [isAssignBadgeModalOpen, setIsAssignBadgeModalOpen] = useState(false);
  const [isAssignAchievementModalOpen, setIsAssignAchievementModalOpen] =
    useState(false);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [deleteScholar] = useSoftDeleteScholarMutation();
  const handleOnDelete = () => {
    if (!data) return;
    toast.promise(deleteScholar(data.username).unwrap(), {
      loading: "Deleting...",
      success: () => {
        return `${data.englishName} has been deleted`;
      },
      error: () => {
        return `Cannot delete ${data.englishName}`;
      },
    });
    setIsDeleteModalShow(false);
  };
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
        {hasRole("ADMIN") && (
          <DropdownMenuItem
            onClick={() => setIsDeleteModalShow(true)}
            variant="destructive"
          >
            <Trash2 size={16} />
            Delete
          </DropdownMenuItem>
        )}
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
      {isDeleteModalShow && (
        <ModalDelete
          open={isDeleteModalShow}
          onOpenChange={setIsDeleteModalShow}
          title="Delete Scholar"
          onDelete={handleOnDelete}
          description={`Are you sure you want to delete ${data.englishName}? This action cannot be undone.`}
        />
      )}
    </DropdownMenu>
  );
}
