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
import { Province } from "@/types/province";
import { dateFormatter } from "@/utils/dateFormatter";

export function ViewProvince({
  open,
  onOpenChange,
  province,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  province: Province | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View province</DialogTitle>
          <DialogDescription>
            You cannot make change on province
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="english-name">English name</Label>
            <Input
              id="english-name"
              name="english-name"
              readOnly
              defaultValue={province?.englishName}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="khmer-name">Khmer name</Label>
            <Input
              id="khmer-name"
              name="khmer-name"
              readOnly
              defaultValue={province?.khmerName}
            />
          </div>
        </div>
        <div>
          <div className="text-[12px] text-muted-foreground">
            Created by: {province?.audit.createdBy} at{" "}
            {dateFormatter(province?.audit.createdAt)}
          </div>
          <div className="text-[12px] text-muted-foreground">
            Updated by: {province?.audit.updatedBy || "N/A"} at{" "}
            {dateFormatter(province?.audit.updatedAt)}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Ok</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
