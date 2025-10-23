import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Enrollment, UpdateEnrollment } from "@/types/enrollment/index";
import { CircleUser, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import ViewEnrollmentProfile from "../../ViewEnrollmentProfile";
import { useUpdateEnrollmentMutation } from "@/features/enrollment/enrollmentApi";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function PaidEnrollmentCellAction({
  data,
}: {
  data: Enrollment;
}) {
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [updateEnrollment] = useUpdateEnrollmentMutation();
  const [isShortCourse, setIsShortCourse] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsShortCourse(searchParams.get("type") === "short-course");
  }, [searchParams]);

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
          {!isShortCourse && (
            <DropdownMenuItem
              disabled={data.isInterviewed}
              onClick={() =>
                handleEnrollmentUpdate({
                  uuid: data.uuid,
                  body: { isInterviewed: true },
                })
              }
            >
              Mark as Interview
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              handleEnrollmentUpdate({
                uuid: data.uuid,
                body: { isPaid: false, isInterviewed: false, isPassed: false },
              })
            }
          >
            Mark as Unpaid
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
