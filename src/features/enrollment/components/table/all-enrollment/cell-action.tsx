import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateEnrollmentMutation } from "@/features/enrollment/enrollmentApi";
import { Enrollment, UpdateEnrollment } from "@/types/enrollment/index";
import { CircleUser, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ViewEnrollmentProfile from "../../ViewEnrollmentProfile";
import { useSearchParams } from "next/navigation";

export default function EnrollmentCellAction({ data }: { data: Enrollment }) {
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [updateEnrollment] = useUpdateEnrollmentMutation();
  const [isShortCourse, setIsShortCourse] = useState(true);
  const handleEnrollmentUpdate = ({
    uuid,
    body,
  }: {
    uuid: string;
    body: UpdateEnrollment;
  }) => {
    if (!data) return;

    toast.promise(updateEnrollment({ uuid, body }).unwrap(), {
      loading: "Updating...",
      success: () => {
        return `${data.englishName} has been updated`;
      },
      error: () => {
        return `Cannot update ${data.englishName}`;
      },
    });
  };

  const params = useSearchParams();

  useEffect(() => {
    setIsShortCourse(params.get("type") === "short-course");
  }, [params]);

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
          <DropdownMenuItem
            disabled={data.isPaid}
            onClick={() =>
              handleEnrollmentUpdate({
                uuid: data.uuid,
                body: { isPaid: true },
              })
            }
          >
            Mark as Paid
          </DropdownMenuItem>
          <DropdownMenuItem
            hidden={isShortCourse}
            disabled={data.isInterviewed}
            onClick={() =>
              handleEnrollmentUpdate({
                uuid: data.uuid,
                body: { isInterviewed: true, isPaid: true },
              })
            }
          >
            Mark as Interview
          </DropdownMenuItem>
          <DropdownMenuItem
            hidden={isShortCourse}
            disabled={data.isPassed}
            onClick={() =>
              handleEnrollmentUpdate({
                uuid: data.uuid,
                body: { isPassed: true, isInterviewed: true, isPaid: true },
              })
            }
          >
            Mark as Pass
          </DropdownMenuItem>
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
