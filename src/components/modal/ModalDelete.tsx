import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function ModalDelete({
  open,
  onOpenChange,
  title,
  description,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onDelete: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex justify-center items-center flex-col w-sm gap-5"onPointerDown={(e) => e.stopPropagation()}    onInteractOutside={(e) => {
          e.preventDefault();
        }}>
        <DialogHeader className="gap-5">
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center items-center">
          <DialogClose asChild>
            <Button variant="outline">No, Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onDelete}>
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
