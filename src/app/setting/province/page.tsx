"use client";
import DataTable from "./data-table";
import { columns } from "./column";
import Loader from "@/app/loading";
import { useState } from "react";
import { Heading } from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { useProvinces } from "@/hooks/province";
import { Province } from "@/types/province";
import { ViewProvince } from "@/components/province/ViewProvince";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";

export default function ProvincePage() {
  const { data, isLoading, error } = useProvinces();
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Heading
            title="Province"
            description="Manage provinces (Server side table functionalities.)"
          />
        </div>
        <Separator />
        {isLoading ? (
          <DataTableSkeleton columnCount={3} />
        ) : (
          <DataTable
            columns={columns({
              onView: (p) => {
                setSelectedProvince(p);
                setIsDialogOpen(true);
              },
            })}
            data={data!}
          />
        )}
      </div>

      <ViewProvince
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        province={selectedProvince}
      />
    </>
  );
}
