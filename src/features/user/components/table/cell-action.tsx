"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types/user";
import { CircleUser, Trash2 } from "lucide-react";
import { useState } from "react";
import ViewUserProfile from "../ViewUserProfile";
import ModalDelete from "@/components/modal/ModalDelete";
import { useDisableUserMutation } from "../../userApi";
import { toast } from "sonner";

export default function UserCellAction({ data }: { data: User }) {
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const { hasRole } = useAuth();
  const [disableUser] = useDisableUserMutation();

  const handleOnDelete = () => {
    if (!data) return;
    toast.promise(disableUser(data.username).unwrap(), {
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
    <div className="flex">
      <Button
        onClick={() => setIsViewProfileOpen(true)}
        variant={"ghost"}
        className="h-8 w-8 p-0"
      >
        <CircleUser className="h-4 w-4" />
      </Button>
      {hasRole("ADMIN") && (
        <Button
          onClick={() => setIsDeleteModalShow(true)}
          variant={"ghost"}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4 text-red-700" />
        </Button>
      )}

      {isViewProfileOpen && (
        <ViewUserProfile
          onOpenChange={setIsViewProfileOpen}
          open={isViewProfileOpen}
          user={data}
        />
      )}
      {isDeleteModalShow && (
        <ModalDelete
          open={isDeleteModalShow}
          onDelete={handleOnDelete}
          onOpenChange={setIsDeleteModalShow}
          title={`Delete ${data.role.toUpperCase()}`}
          description={`Are your sure? You want to delete ${data.englishName}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
