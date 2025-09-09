import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Enrollment } from "@/types/enrollment/index";
import { CircleUser, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ViewEnrollmentProfile from "../../ViewEnrollmentProfile";
import { enrollments } from "@/data/enrollments";

export default function EnrollmentCellAction({ data }: { data: Enrollment }) {
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);

  const handlePaidClick = () => {
    const index = enrollments.findIndex((d) => d.uuid === data.uuid);
    if (index !== -1) {
      const updatedEnrollment = { ...data, isPaid: true };
      enrollments[index] = updatedEnrollment;
    }
  };

  return (
    <div className="flex ">
      <Button
        onClick={() => setIsViewProfileOpen(true)}
        variant={"ghost"}
        className="h-8 w-8 p-0"
      >
        <CircleUser className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handlePaidClick}>Paid</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isViewProfileOpen && (
        <ViewEnrollmentProfile
          open={isViewProfileOpen}
          onOpenChange={setIsViewProfileOpen}
          enrollment={data}
        />
      )}
    </div>
  );
}
