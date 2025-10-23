import ModalDelete from "@/components/modal/ModalDelete";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrentAddress } from "@/types/current-address";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSoftDeleteCurrentAddressMutation } from "../../currentAddressApi";
import { ViewCurrentAddress } from "../ViewCurrentAddress";

export default function CurrentAddressCellAction({
  data,
}: {
  data: CurrentAddress;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteCurrentAddress] = useSoftDeleteCurrentAddressMutation();

  const onDelete = () => {
    if (!data) return;

    toast.promise(deleteCurrentAddress(data.uuid), {
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
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setIsDeleteOpen(true)}
          variant="destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isViewOpen && (
        <ViewCurrentAddress
          currentAddress={data}
          onOpenChange={setIsViewOpen}
          open={isViewOpen}
        />
      )}
      {isDeleteOpen && (
        <ModalDelete
          onOpenChange={setIsDeleteOpen}
          title="Delete Address"
          onDelete={onDelete}
          open={isDeleteOpen}
          description={`Are you sure, you want to delete address ${data.englishName}? This action is cannot be undone!`}
        />
      )}
    </DropdownMenu>
  );
}
