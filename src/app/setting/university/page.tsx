"use client";
import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreateUniversity } from "@/features/university/components/CreateUniversity";
import { universityColumns } from "@/features/university/components/table/column";
import { UniversityTable } from "@/features/university/components/table/data-table";
import { useGetAllUniversitiesQuery } from "@/features/university/universityApi";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export default function UniversityPage() {
  const { data, isLoading } = useGetAllUniversitiesQuery();
  console.log(data)
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Heading
            title="University"
            description="Manage universities (Server side table functionalities.)"
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
          <UniversityTable
            totalItems={data?.length ?? 0}
            data={data ?? []}
            columns={universityColumns}
          />
        )}
      </div>

      <CreateUniversity
        open={isModalCreateOpen}
        onOpenChange={setIsModalCreateOpen}
      />
    </>
  );
}
