"use client";
import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Separator } from "@/components/ui/separator";
import { provinceColumns } from "@/features/province/components/table/column";
import { ProvinceTable } from "@/features/province/components/table/data-table";
import { useGetAllProvincesQuery } from "@/features/province/provinceApi";

export default function ProvincePage() {
  const { data, isLoading } = useGetAllProvincesQuery();

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
          <ProvinceTable
            totalItems={data?.length ?? 0}
            data={data ?? []}
            columns={provinceColumns}
          />
        )}
      </div>
    </>
  );
}
