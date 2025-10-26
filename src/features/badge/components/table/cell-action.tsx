"use client";
import ModalDelete from "@/components/modal/ModalDelete";
import { ViewAndUpdateBadge } from "../ViewAndUpdateBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/types/badge";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useDeleteBadgeMutation } from "../../badgeApi";
import { toast } from "sonner";

export default function VerificationCellAction({ data }: { data: Badge }) {
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [deleteBadge] = useDeleteBadgeMutation();
  const [isViewAndUpdateModalShow, setIsViewAndUpdateModalShow] =
    useState(false);
  const onDelete = () => {
    toast.promise(deleteBadge(data.uuid).unwrap(), {
      loading: "Deleting...",
      success: () => {
        return "Badge deleted successfully!";
      },
      error: (error) => {
        return `Failed to delete badge: ${error.message}`;
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
        <DropdownMenuItem onClick={() => setIsViewAndUpdateModalShow(true)}>
          View & Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setIsDeleteModalShow(true)}
          variant="destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isDeleteModalShow && (
        <ModalDelete
          onDelete={onDelete}
          title="Delete Badge"
          description="Are you sure you want to delete this badge? This action cannot be undone."
          open={isDeleteModalShow}
          onOpenChange={setIsDeleteModalShow}
        />
      )}
      {isViewAndUpdateModalShow && (
        <ViewAndUpdateBadge
          open={isViewAndUpdateModalShow}
          onOpenChange={setIsViewAndUpdateModalShow}
          badge={data}
        />
      )}
    </DropdownMenu>
  );
}
