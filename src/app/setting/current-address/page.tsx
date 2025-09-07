"use client";
import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Separator } from "@/components/ui/separator";
import { currentAddressColumn } from "@/features/current-address/components/table/columns";
import { CurrentAddressTable } from "@/features/current-address/components/table/data-table";
import { useGetCurrentAddressesQuery } from "@/features/current-address/currentAddressApi";

export default function CurrentAddressPage() {
  const { data, isLoading } = useGetCurrentAddressesQuery();

  return (
    <div className=" space-y-4">
      <Heading
        title="Current Addresses"
        description="This where you can modify or create current address"
      />
      <Separator />
      {isLoading ? (
        <DataTableSkeleton columnCount={5} />
      ) : (
        <CurrentAddressTable
          columns={currentAddressColumn}
          data={data!}
          totalItems={data!.length}
        />
      )}
    </div>
  );
}
