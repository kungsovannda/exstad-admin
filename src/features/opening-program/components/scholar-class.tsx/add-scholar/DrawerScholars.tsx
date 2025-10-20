"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import { addScholarClassCulumns } from "./table/culumns";
import AddScholarClassTable from "./table/data-table";

type ScholarRow = {
  uuid: string;
  englishName: string;
  avatar?: string;
  email: string;
};

type DrawerScholarsProps = {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  scholarsClass: { scholarUuid: string }[];
  editScholar?: {
    uuid: string;
    englishName: string;
    isPaid: boolean;
    isReminded: boolean;
  };
  onAddScholar?: (
    scholarUuid: string,
    options: { isPaid: boolean; isReminded: boolean }
  ) => Promise<void>;
  onAddMultipleScholars?: (
    scholarUuids: string[],
    options: { isPaid: boolean; isReminded: boolean }
  ) => Promise<void>;
};

export default function DrawerScholars({
  open,
  onOpenChange,
  scholarsClass = [],
  editScholar,
  onAddScholar,
  onAddMultipleScholars,
}: DrawerScholarsProps) {
  const { data: scholars = [], isLoading } = useGetAllScholarsQuery();
  const [isPaid, setIsPaid] = useState(false);
  const [isReminded, setIsReminded] = useState(false);
  const [selectedRows, setSelectedRows] = useState<ScholarRow[]>([]);

  // Prefill switches if editing a scholar
  useEffect(() => {
    if (editScholar) {
      setIsPaid(editScholar.isPaid);
      setIsReminded(editScholar.isReminded);
      setSelectedRows([{ 
        uuid: editScholar.uuid, 
        englishName: editScholar.englishName ,
        email: editScholar.englishName, // Placeholder, replace with actual email if available
      }]);
    }
  }, [editScholar]);

  const columns = addScholarClassCulumns(
    (uuid) => {
      if (onAddScholar) { 
        onAddScholar(uuid, { isPaid, isReminded });
      }
    },
    scholarsClass
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-screen flex flex-col data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-xl">
        <DrawerHeader className="p-6 mt-8">
          <DrawerTitle className="text-2xl font-semibold">
            {editScholar ? "Edit Scholar" : "Add Scholars"}
          </DrawerTitle>

          <div className="flex items-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="isPaid">Mark as Paid</Label>
              <Switch id="isPaid" checked={isPaid} onCheckedChange={setIsPaid} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="isReminded">Reminded</Label>
              <Switch
                id="isReminded"
                checked={isReminded}
                onCheckedChange={setIsReminded}
              />
            </div>

            {editScholar && (
              <Button
                onClick={() => {
                  if (onAddScholar && selectedRows[0]) {
                    onAddScholar(selectedRows[0].uuid, { isPaid, isReminded });
                  }
                }}
              >
                Save
              </Button>
            )}
          </div>
        </DrawerHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <DataTableSkeleton columnCount={columns.length} />
          ) : (
            <AddScholarClassTable
              data={editScholar ? scholars.filter(s => s.uuid === editScholar.uuid) : scholars}
              totalItems={editScholar ? 1 : scholars.length}
              columns={columns}
              onRowSelectionChange={setSelectedRows}
            />
          )}
        </div>

        {!editScholar && onAddMultipleScholars && (
          <>
            <Separator />
            <div className="p-5">
              <Button
                disabled={selectedRows.length === 0}
                onClick={() =>
                  onAddMultipleScholars(
                    selectedRows.map((r) => r.uuid),
                    { isPaid, isReminded }
                  )
                }
              >
                Add Selected
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}