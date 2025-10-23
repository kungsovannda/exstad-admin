"use client";

import {
  useGetAllInstructorByClassUuidQuery,
  useDeleteInstructorClassMutation,
  useGetAllInstructorClassesByClassUuidQuery,
} from "../instructor-class/instructorClassApi";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trash2, GraduationCap } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ClassType } from "@/types/opening-program";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetScholarByClassUuidQuery } from "../scholar-class.tsx/scholarClassApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ModalDelete from "@/components/modal/ModalDelete";

export function ClassCardItem({
  cls,
  programSlug,
  onAddInstructorClick,
}: {
  cls: ClassType;
  programSlug: string;
  onAddInstructorClick: (uuid: string) => void;
}) {
  const router = useRouter();

  const {
    data: instructors = [],
    isLoading: isInstructorLoading,
    refetch,
  } = useGetAllInstructorClassesByClassUuidQuery(cls.uuid);

  const { data: scholarsInClass = [], isLoading: isScholarLoading } =
    useGetScholarByClassUuidQuery(cls.uuid, {
      skip: !cls.uuid,
      refetchOnMountOrArgChange: true,
    });

  const [deleteInstructor] = useDeleteInstructorClassMutation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<{
    uuid: string;
    name: string;
  } | null>(null); // ✅ Store which instructor to delete

  const totalInstructors = instructors?.length ?? 0;
  const totalScholars = scholarsInClass?.length ?? 0;

  // ✅ This will be called when user confirms deletion
  const handleDeleteInstructor = async () => {
    if (!selectedInstructor) return;

    try {
      await deleteInstructor(selectedInstructor.uuid).unwrap();
      toast.success("Instructor removed successfully!");
      setDeleteOpen(false); // ✅ Close modal
      setSelectedInstructor(null); // ✅ Clear selection
      refetch();
    } catch (error) {
      toast.error("Failed to remove instructor.");
      console.error(error);
    }
  };

  // ✅ This opens the modal and stores which instructor to delete
  const openDeleteModal = (uuid: string, name: string) => {
    setSelectedInstructor({ uuid, name });
    setDeleteOpen(true);
  };
  

  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition rounded-xl">
      <CardHeader className="pb-2 border-b flex justify-between items-center">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          {cls.classCode}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddInstructorClick(cls.uuid)}
        >
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
            <p className="font-medium text-sm flex items-center gap-">
              {isScholarLoading ? (
                <Skeleton className="w-10 h-6" />
              ) : (
                cls.startTime
              )}{" "}
              -{" "}
              {isScholarLoading ? (
                <Skeleton className="w-10 h-6" />
              ) : (
                cls.endTime
              )}
            </p>
          </div>
        </div>

        {/* Slots */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Slots</p>
            <p className="font-medium text-sm">
              {isScholarLoading ? (
                <Skeleton className="w-10 h-6" />
              ) : (
                cls.totalSlot
              )}
            </p>
          </div>
        </div>

        {/* Total Scholars */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Scholars</p>
            <p className="font-medium text-sm">
              {isScholarLoading ? (
                <Skeleton className="w-10 h-6" />
              ) : (
                totalScholars
              )}
            </p>
          </div>
        </div>

        {/* Instructors */}
        <Accordion type="single" collapsible className="border-b">
          <AccordionItem value="item-1">
            <AccordionTrigger className="py-0 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Instructors
                  </p>
                  <p className="font-medium text-sm text-start">
                    {isInstructorLoading ? (
                      <Skeleton className="w-10 h-6" />
                    ) : (
                      totalInstructors
                    )}
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="w-full col-span-full">
              <div className="flex flex-col gap-2 w-full">
                {isInstructorLoading ? (
                  <p className="text-xs text-muted-foreground">
                    Loading instructors...
                  </p>
                ) : instructors.length > 0 ? (
                  instructors.map((ins) => (
                    <div
                      key={ins.uuid}
                      className="bg-primary/10 px-3 py-2 rounded-md text-xs flex items-center justify-between"
                    >
                      <span>{ins.instructorUsername}</span>
                      <Trash2
                        className="h-3.5 w-3.5 cursor-pointer text-red-500"
                        onClick={() =>
                          openDeleteModal(ins.uuid, ins.instructorUsername)
                        } // ✅ Open modal with instructor info
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No instructors yet
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          onClick={() =>
            router.push(`/opening-program/${programSlug}/${cls.classCode}`)
          }
        >
          View Scholars
        </Button>
      </CardContent>

      {/* ✅ Modal placed outside the map, at component level */}
      <ModalDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Instructor"
        description={`Are you sure you want to remove ${selectedInstructor?.name ?? "this instructor"}? This action cannot be undone.`}
        onDelete={handleDeleteInstructor}
      />
    </Card>
  );
}