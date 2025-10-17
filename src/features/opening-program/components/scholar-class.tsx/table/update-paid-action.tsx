import { ScholarClassType, ScholarClassUpdate } from "@/types/opening-program";
import React from "react";
import { useUpdateScholarClassMutation } from "../scholarClassApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const mapPaidStatus = (isPaid: boolean) => (isPaid ? "Paid" : "Unpaid");

export default function UpdatePaidScholarClassAction({
  scholar,
}: {
  scholar: ScholarClassType;
}) {
  const [updateScholarClass] = useUpdateScholarClassMutation();

  const handleUpdate = (uuid: string, body: ScholarClassUpdate) => {
    if (!uuid) return;

    toast.promise(updateScholarClass({ uuid, body: body }).unwrap(), {
      loading: "Updating...",
      success: () => {
        const name = scholar.scholar?.englishName || "Unknown";
        return `Scholar "${name}" has been updated`;
      },
      error: () => {
        return `Cannot update scholar`;
      },
    });
  };
  const { isPaid, uuid } = scholar;
  const bgClass = isPaid
    ? "bg-[#E6F4EA] text-[#1E7D34]"
    : "bg-[#FDECEC] text-[#B32121]";

  return (
    <Select
      defaultValue={isPaid ? "paid" : "unpaid"}
      onValueChange={(value) =>
        handleUpdate(uuid, {
          isPaid: value === "paid" ? true : false,
          isReminded: scholar.isReminded,
        })
      }
    >
      <SelectTrigger
      size="sm"
        className={`w-fit ${bgClass} text-sm`}
      >
        <SelectValue placeholder={mapPaidStatus(isPaid)} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="unpaid">Unpaid</SelectItem>
      </SelectContent>
    </Select>
  );
}
