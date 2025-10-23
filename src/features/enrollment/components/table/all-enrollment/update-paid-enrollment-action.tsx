import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateEnrollmentMutation } from "@/features/enrollment/enrollmentApi";
import { Enrollment, UpdateEnrollment } from "@/types/enrollment";
import { toast } from "sonner";
const mapPaidStatus = (isPaid: boolean) => (isPaid ? "Paid" : "Unpaid");

export default function UpdatePaidEnrollmentAction({
  enrollment,
}: {
  enrollment: Enrollment;
}) {
  const [updateEnrollment] = useUpdateEnrollmentMutation();

  const handleUpdate = (uuid: string, body: UpdateEnrollment) => {
    if (!uuid) return;

    toast.promise(updateEnrollment({ uuid, body: body }).unwrap(), {
      loading: "Updating...",
      success: () => {
        const name = enrollment?.englishName || "Unknown";
        return `Enrollment "${name}" has been updated`;
      },
      error: () => {
        return `Cannot update scholar`;
      },
    });
  };
  const { isPaid, uuid } = enrollment;
  const bgClass = isPaid
    ? "bg-[#E6F4EA] text-[#1E7D34]"
    : "bg-[#FDECEC] text-[#B32121]";

  return (
    <Select
      defaultValue={isPaid ? "paid" : "unpaid"}
      onValueChange={(value) =>
        handleUpdate(uuid, {
          isPaid: value === "paid" ? true : false,
        })
      }
    >
      <SelectTrigger size="sm" className={`w-fit ${bgClass} text-sm`}>
        <SelectValue placeholder={mapPaidStatus(isPaid)} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="unpaid">Unpaid</SelectItem>
      </SelectContent>
    </Select>
  );
}
