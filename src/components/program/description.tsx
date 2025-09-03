"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiPlus } from "react-icons/fi";

// ✅ Add props type
type AddDescriptionDialogProps = {
  onAddDescription: (title: string) => void;
};

export function AddDescriptionDialog({ onAddDescription }: AddDescriptionDialogProps) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddDescription(description); // Call the callback
    setDescription(""); // Reset input
  };

  return (
 <Dialog>
  <DialogTrigger asChild>
    <Button variant="default" className="flex items-center w-fit mt-2 gap-2.5">
      <FiPlus className="text-[18px]" />
      <span className="text-[14px] font-bold">Add new description</span>
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
    <form onSubmit={handleSubmit}>
      <DialogHeader className="mb-6">
        <DialogTitle>Add new description</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="description-text">Description</Label>
          <Input
            id="description-text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Add description</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

  );
}
