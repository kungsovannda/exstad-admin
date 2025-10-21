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
const mapRemindedStatus = (isReminded: boolean) => (isReminded ? "Yes" : "No");

export default function UpdateRemindScholarAction({
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
        return `Scholar "${name}" has been updated successfully!`;
      },
      error: () => {
        return `Cannot update scholar`;
      },  
    });
  };
  const { isReminded, uuid } = scholar;
  const bgClass = !isReminded
    ? "bg-[#E6F4EA] text-[#1E7D34]"
    : "bg-[#FDECEC] text-[#B32121]";

  return (
    <Select
      defaultValue={isReminded ? "yes" : "no"}
      onValueChange={(value) =>
        handleUpdate(uuid, {
          isReminded: value === "yes" ? true : false,
          isPaid: scholar.isPaid,
        })
      }
    >
      <SelectTrigger
      size="sm"
        className={`w-fit ${bgClass} text-sm`}
      >
        <SelectValue placeholder={mapRemindedStatus(isReminded)} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="yes">Yes</SelectItem>
        <SelectItem value="no">No</SelectItem>
      </SelectContent>
    </Select>
  );
}
