"use client";
import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreateCurrentAddressModal } from "@/features/current-address/components/CreateCurrentAddressModal";
import { currentAddressColumn } from "@/features/current-address/components/table/columns";
import { CurrentAddressTable } from "@/features/current-address/components/table/data-table";
import { useGetCurrentAddressesQuery } from "@/features/current-address/currentAddressApi";
import { useGetAllProvincesQuery } from "@/features/province/provinceApi";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

export default function CurrentAddressPage() {
  const { data, isLoading } = useGetCurrentAddressesQuery();
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const { data: provinces } = useGetAllProvincesQuery();
  const provinceOptions = useMemo(
    () =>
      provinces?.map((p) => ({
        label: p.englishName ?? "",
        value: p.englishName ?? "",
      })) ?? [],
    [provinces]
  );

  const column = useMemo(
    () => currentAddressColumn(provinceOptions),
    [provinceOptions]
  );
  return (
    <div className=" space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Current Addresses"
          description="This where you can modify or create current address"
        />
        <Button
          onClick={() => setIsModalCreateOpen(true)}
          className={"text-xs md:text-sm"}
        >
          <IconPlus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {isLoading ? (
        <DataTableSkeleton columnCount={5} />
      ) : (
        <CurrentAddressTable
          columns={column}
          data={data!}
          totalItems={data!.length}
        />
      )}
      {isModalCreateOpen && (
        <CreateCurrentAddressModal
          onOpenChange={setIsModalCreateOpen}
          open={isModalCreateOpen}
        />
      )}
    </div>
  );
}
