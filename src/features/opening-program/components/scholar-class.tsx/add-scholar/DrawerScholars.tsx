"use client";

import { useState, useEffect } from "react";
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
import { addScholarClassColumns } from "./table/culumns";
import AddScholarClassTable from "./table/data-table";
import { Scholar } from "@/types/scholar";

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
  const [selectedRows, setSelectedRows] = useState<Scholar[]>([]);
  const columns = addScholarClassColumns(
    (scholar) => {
      if (onAddScholar) {
        onAddScholar(scholar.uuid, { isPaid, isReminded });
      }
    },
    false ,
    scholarsClass // 👈 pass existing scholars

  );

  useEffect(() => {
    if (editScholar) {
      setIsPaid(editScholar.isPaid);
      setIsReminded(editScholar.isReminded);
      // setSelectedRows([
      //   {
      //     uuid: editScholar.uuid,
      //     englishName: editScholar.englishName,
      //     email: editScholar.englishName,
      //   },
      // ]);
    }
  }, [editScholar]);

  // const columns = addScholarClassCulumns((uuid) => {
  //   if (onAddScholar) {
  //     onAddScholar(uuid, { isPaid, isReminded });
  //   }
  // }, scholarsClass);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-screen flex flex-col data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-xl">
        <DrawerHeader className="mt-8 flex flex-row items-center justify-between  ">
          <DrawerTitle className="text-2xl font-semibold">
            {editScholar ? "Edit Scholar" : "Add Scholars"}
            <p className="text-sm text-muted-foreground">
              Selected: {selectedRows.length}
            </p>
          </DrawerTitle>
          <div className="flex items-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="isPaid">Mark as Paid</Label>
              <Switch
                id="isPaid"
                checked={isPaid}
                onCheckedChange={setIsPaid}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="isReminded">Reminded</Label>
              <Switch
                id="isReminded"
                checked={isReminded}
                onCheckedChange={setIsReminded}
              />
            </div>
          </div>
        </DrawerHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <DataTableSkeleton columnCount={addScholarClassColumns.length} />
          ) : (
            <AddScholarClassTable
              data={
                editScholar
                  ? scholars.filter((s) => s.uuid === editScholar.uuid)
                  : scholars
              }
              totalItems={editScholar ? 1 : scholars.length}
              columns={columns}
              onSelectionChange={(rows) => setSelectedRows(rows)} 
              onAddSelected={(selected) => {
                if (onAddMultipleScholars && selected.length > 0) {
                  onAddMultipleScholars(
                    selected.map((s) => s.uuid),
                    { isPaid, isReminded }
                  );
                  onOpenChange(false); // ✅ close drawer after success
                }
              }}

            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
