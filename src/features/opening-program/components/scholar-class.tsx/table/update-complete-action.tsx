"use client";

import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  useMarkCompletedCourseMutation,
  useRemoveCompletedCourseMutation,
} from "@/features/scholar/scholarApi";
import { ScholarCompletedCourseType } from "@/types/scholar";

interface UpdateCompleteScholarClassActionProps {
  scholar: {
    uuid: string;
    englishName?: string;
    username?: string;
    completedCourses?: ScholarCompletedCourseType[];
  };
  openingProgramUuid: string;
}

export default function UpdateCompleteScholarClassAction({
  scholar,
  openingProgramUuid,
}: UpdateCompleteScholarClassActionProps) {
  const [markCompleted, { isLoading: isMarking }] =
    useMarkCompletedCourseMutation();
  const [removeCompleted, { isLoading: isRemoving }] =
    useRemoveCompletedCourseMutation();

  // Normalize to array
  const completedCourses = useMemo(
    () => scholar.completedCourses ?? [],
    [scholar]
  );

  const [isCompleted, setIsCompleted] = useState(
    completedCourses.find((d) => d.uuid === openingProgramUuid) ? true : false
  );

  // ✅ Keep state synced when parent data changes
  useEffect(() => {
    setIsCompleted(
      completedCourses.find((d) => d.uuid === openingProgramUuid) ? true : false
    );
  }, [scholar.completedCourses, openingProgramUuid, completedCourses]);

  const handleToggle = async (checked: boolean) => {
    try {
      if (checked) {
        await markCompleted({
          scholarUuid: scholar.uuid,
          openingProgramUuid,
        }).unwrap();
        toast.success(
          `${scholar.englishName || scholar.username} marked as completed`
        );
      } else {
        await removeCompleted({
          scholarUuid: scholar.uuid,
          openingProgramUuid,
        }).unwrap();
        toast.success(
          `${scholar.englishName || scholar.username} removed from completed`
        );
      }
      setIsCompleted(checked);
    } catch (err) {
      toast.error(
        `Action failed for ${scholar.englishName || scholar.username}`
      );
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={(val) => handleToggle(!!val)}
        disabled={isMarking || isRemoving}
      />
      <span className="text-sm">
        {isCompleted ? "Completed" : "Not Completed"}
      </span>
    </div>
  );
}
