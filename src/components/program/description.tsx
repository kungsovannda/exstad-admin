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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiPlus } from "react-icons/fi";

type AddSectionDialogProps = {
  initialTitle?: string; // for editing
  onSubmit: (title: string) => void;
  trigger?: React.ReactNode; // trigger element
};

export function AddSectionDialog({
  initialTitle = "",
  onSubmit,
  trigger,
}: AddSectionDialogProps) {
  const [title, setTitle] = useState(initialTitle);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(title);
    setTitle("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="default" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] font-bold">
              {initialTitle ? "Edit Section" : "Add Section"}
            </span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle>{initialTitle ? "Edit Section" : "Add Section"}</DialogTitle>
            <DialogDescription>
              {initialTitle
                ? "Update the section title and click save."
                : "Enter a new section title and click add."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="section-title">Section Title</Label>
              <Input
                id="section-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter section title..."
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{initialTitle ? "Save" : "Add Section"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
