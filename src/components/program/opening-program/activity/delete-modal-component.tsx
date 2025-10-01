"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteModal({ open, onOpenChange, onConfirm, itemName }: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => { /* ignore outside clicks */ }} modal>
      <DialogContent className="w-fit max-w-sm" onPointerDown={(e) => e.stopPropagation()} >
        <DialogHeader>
          <DialogTitle>Delete {itemName}?</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-sm text-gray-600">Are you sure you want to delete this? This action cannot be undone.</div>
        <DialogFooter className="flex justify-end gap-2 mt-4 ">
          <Button className="cursor-pointer" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-red-600 text-white cursor-pointer" onClick={() => { onConfirm(); onOpenChange(false); }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
