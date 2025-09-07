import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { University, UniversityUpdate } from "@/types/university";
import { dateFormatter } from "@/utils/dateFormatter";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateUniversityMutation } from "../universityApi";

export function ViewAndUpdateUniversity({
  open,
  onOpenChange,
  university,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university: University | null;
}) {
  const [updateUniversity, { isLoading }] = useUpdateUniversityMutation();
  const [data, setData] = useState<UniversityUpdate | null>(null);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uuid = university?.uuid;
    if (!data || !uuid) return;

    toast.promise(updateUniversity({ uuid, body: data }), {
      loading: "Updating...",
      success: () => {
        return `${university.englishName} has been updated`;
      },
      error: () => {
        return `Cannot update ${data.englishName}`;
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setData(null);
        onOpenChange(isOpen);
      }}
    >
      <form id="update-university-form" onSubmit={handleFormSubmit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit university</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="english-name">English name</Label>
              <Input
                id="english-name"
                name="english-name"
                onChange={(e) =>
                  setData({ ...data, englishName: e.target.value })
                }
                defaultValue={university?.englishName}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="khmer-name">Khmer name</Label>
              <Input
                id="khmer-name"
                name="khmer-name"
                onChange={(e) =>
                  setData({ ...data, khmerName: e.target.value })
                }
                defaultValue={university?.khmerName}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="short-name">Short name</Label>
              <Input
                id="short-name"
                name="short-name"
                onChange={(e) =>
                  setData({ ...data, shortName: e.target.value })
                }
                defaultValue={university?.shortName}
              />
            </div>
          </div>
          <div>
            <div className="text-[12px] text-muted-foreground">
              Created by: {university?.audit.createdBy} at{" "}
              {dateFormatter(university?.audit.createdAt)}
            </div>
            <div className="text-[12px] text-muted-foreground">
              Updated by: {university?.audit.updatedBy || "N/A"} at{" "}
              {dateFormatter(university?.audit.updatedAt)}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              form="update-university-form"
              disabled={!data || isLoading}
              type="submit"
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
