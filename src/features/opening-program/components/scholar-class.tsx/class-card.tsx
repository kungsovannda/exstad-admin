"use client";

import { useGetAllInstructorByClassUuidQuery, useDeleteInstructorClassMutation } from "../instructor-class/instructorClassApi";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trash2 } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ClassType } from "@/types/opening-program";
import { toast } from "sonner";

export function ClassCardItem({
  cls,
  programSlug,
  onAddInstructorClick,
  totalScholars,
}: {
  cls: ClassType;
  programSlug: string;
  onAddInstructorClick: (uuid: string) => void;
  totalScholars: number;
}) {
  const { data: instructors = [], isLoading, refetch } = useGetAllInstructorByClassUuidQuery(cls.uuid);
  const [deleteInstructor] = useDeleteInstructorClassMutation();
  const router = useRouter();

  const handleDeleteInstructor = async (uuid: string) => {
    try {
      await deleteInstructor(uuid).unwrap();
      toast.success("Instructor removed successfully!");
      refetch(); // update the list
    } catch (error) {
      toast.error("Failed to remove instructor.");
      console.error(error);
    }
  };

  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition rounded-xl">
      <CardHeader className="pb-2 border-b flex justify-between items-center">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {cls.classCode}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => onAddInstructorClick(cls.uuid)}>
          <FiPlus className="mr-1" /> Add Instructor
        </Button>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Schedule */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Schedule</p>
            <p className="font-medium text-sm">{cls.startTime} - {cls.endTime}</p>
          </div>
        </div>

        {/* Slots */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Slots</p>
            <p className="font-medium text-sm">{cls.totalSlot}</p>
          </div>
        </div>

        {/* Total Scholars */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Scholars</p>
            <p className="font-medium text-sm">{totalScholars || 0}</p>
          </div>
        </div>

        {/* Instructors */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mt-2">
          <div className="p-3 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-xs text-muted-foreground mb-1">Instructors</p>
            <div className="flex flex-wrap gap-2 max-w-full">
              {isLoading ? (
                <p className="text-xs text-muted-foreground">Loading instructors...</p>
              ) : instructors.length > 0 ? (
                instructors.map((ins) => (
                  <span
                    key={ins.uuid}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {ins.username}
                    <Trash2
                      className="h-3 w-3 cursor-pointer text-red-500"
                      onClick={() => handleDeleteInstructor(ins.uuid)}
                    />
                  </span>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No instructors yet</p>
              )}
            </div>
          </div>
        </div>

        <Button 
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          onClick={() => router.push(`/opening-program/${programSlug}/${cls.uuid}`)}
        >
          View Scholars
        </Button>
      </CardContent>
    </Card>
  );
}
