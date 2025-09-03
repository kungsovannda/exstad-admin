"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddTopicDialogProps = {
  initialTitle?: string;
  initialSubtitle?: string;
  onSubmit: (title: string, subtitle: string) => void;
  trigger: React.ReactNode;
};

export function AddTopicDialog({ initialTitle = "", initialSubtitle = "", onSubmit, trigger }: AddTopicDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);

  useEffect(() => {
    setTitle(initialTitle);
    setSubtitle(initialSubtitle);
  }, [initialTitle, initialSubtitle, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, subtitle);
    setTitle("");
    setSubtitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle>{initialTitle ? "Edit Topic" : "Add Topic"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter topic title..."
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter topic subtitle..."
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{initialTitle ? "Save Changes" : "Add Topic"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
