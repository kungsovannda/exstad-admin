import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { University } from "@/types/university";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ViewAndUpdateUniversity } from "../ViewAndUpdateUniversity";
import ModalDelete from "@/components/modal/ModalDelete";
import { useDeleteUniversityMutation } from "../../universityApi";
import { toast } from "sonner";

export default function UniversityCellAction({ data }: { data: University }) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteUniversity] = useDeleteUniversityMutation();

  const onDelete = () => {
    if (!data) return;

    toast.promise(deleteUniversity(data.uuid), {
      loading: "Deleting...",
      success: () => {
        return `${data.englishName} has been deleted`;
      },
      error: () => {
        return `Cannot delete ${data.englishName}`;
      },
    });
    setIsDeleteOpen(false);
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
        <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
          View & Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setIsDeleteOpen(true)}
          variant="destructive"
        >
          Delete university
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isViewOpen && (
        <ViewAndUpdateUniversity
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          university={data}
        />
      )}

      {isDeleteOpen && (
        <ModalDelete
          onOpenChange={setIsDeleteOpen}
          title="Delete University"
          onDelete={onDelete}
          open={isDeleteOpen}
          description={`Are you sure, you want to delete university ${data.englishName}? This action is cannot be undone!`}
        />
      )}
    </DropdownMenu>
  );
}
