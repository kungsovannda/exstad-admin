"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import {  useGetNotScholarUsersQuery } from "@/features/user/userApi";
import { addInstructorClassColumns } from "./table/column";
import AddInstructorClassTable from "./table/data-table";
import { User } from "@/types/user";
import { useGetAllInstructorQuery } from "../instructorClassApi";

type DrawerInstructorsProps = {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  instructorsClass: { instructorUuid: string }[];
  editInstructor?: {
    uuid: string;
    englishName: string;
  };
  onAddInstructor?: (instructorUuid: string) => Promise<void>;
  onAddMultipleInstructors?: (instructorUuids: string[]) => Promise<void>;
};

export default function DrawerInstructors({
  open,
  onOpenChange,
  instructorsClass = [],
  editInstructor,
  onAddInstructor,
  onAddMultipleInstructors,
}: DrawerInstructorsProps) {
  const { data: instructors = [], isLoading } = useGetAllInstructorQuery(undefined,{refetchOnMountOrArgChange:true});
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const columns = addInstructorClassColumns(
    (instructor: User) => {
      if (onAddInstructor) onAddInstructor(instructor.uuid);
    },
    false,
    instructorsClass
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-screen flex flex-col data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-xl">
        <DrawerHeader className="mt-8 flex flex-row items-center justify-between">
          <DrawerTitle className="text-2xl font-semibold">
            {editInstructor ? "Edit Instructor" : "Add Instructors"}
            <p className="text-sm text-muted-foreground">
              Selected: {selectedRows.length}
            </p>
          </DrawerTitle>
        </DrawerHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <DataTableSkeleton columnCount={addInstructorClassColumns.length} />
          ) : (
            <AddInstructorClassTable
              data={
                editInstructor
                  ? instructors.filter((i) => i.uuid === editInstructor.uuid)
                  : instructors
              }
              totalItems={editInstructor ? 1 : instructors.length}
              columns={columns}
              onSelectionChange={(rows) => setSelectedRows(rows)}
              onAddSelected={(selected) => {
                if (onAddMultipleInstructors && selected.length > 0) {
                  onAddMultipleInstructors(selected.map((i) => i.uuid));
                  onOpenChange(false);
                }
              }}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
