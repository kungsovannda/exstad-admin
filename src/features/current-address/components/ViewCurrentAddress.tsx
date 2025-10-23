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
import { CurrentAddress } from "@/types/current-address";
import { dateFormatter } from "@/utils/dateFormatter";

export function ViewCurrentAddress({
  open,
  onOpenChange,
  currentAddress,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAddress: CurrentAddress | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form id="update-university-form">
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>View current address</DialogTitle>
            <DialogDescription>
              You cannot change the current address! if you want just delete
              them and create new
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="english-name">English name</Label>
              <Input
                id="english-name"
                name="english-name"
                readOnly
                defaultValue={currentAddress?.englishName}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="khmer-name">Khmer name</Label>
              <Input
                readOnly
                id="khmer-name"
                name="khmer-name"
                defaultValue={currentAddress?.khmerName}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="short-name">Short name</Label>
              <Input
                id="short-name"
                name="short-name"
                defaultValue={currentAddress?.province}
              />
            </div>
          </div>
          <div>
            <div className="text-[12px] text-muted-foreground">
              Created by: {currentAddress?.audit.createdBy} at{" "}
              {dateFormatter(currentAddress?.audit.createdAt)}
            </div>
            <div className="text-[12px] text-muted-foreground">
              Updated by: {currentAddress?.audit.updatedBy || "N/A"} at{" "}
              {dateFormatter(currentAddress?.audit.updatedAt)}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Ok</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
