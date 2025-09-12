"use client";
import { SectionCards } from "@/components/program/section-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heading } from "@/components/Heading";
import MasterProgramTable from "@/features/master-program/components/table/master-program-table";
import { FiPlus } from "react-icons/fi";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { masterProgramColumns } from "@/features/master-program/components/table/column";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { MasterProgramType } from "@/types/program";

export default function Page() {
  const { data, isFetching, error, refetch } = useGetAllMasterProgramsQuery(undefined, {
  refetchOnMountOrArgChange: true,
});

  console.log("Raw API data:", data);

  // Treat data as array directly
  const programs: MasterProgramType[] = data ?? [];

  console.log("Programs length:", programs.length);
  console.log("Programs:", programs);

  const columns = masterProgramColumns(programs);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <Heading title="Master Program" description="Program Management" />
        <Link href="/master-program/create">
          <Button variant="outline" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] font-bold">Create New Program</span>
          </Button>
        </Link>
      </div>

      <SectionCards />

      {isFetching ? (
        <DataTableSkeleton columnCount={5} />
      ) : error ? (
        <p className="text-red-500">Error loading programs</p>
      ) : programs.length === 0 ? (
        <p>No programs found</p>
      ) : (
        <MasterProgramTable
          data={programs}
          totalItems={programs.length}
          columns={columns}
        />
      )}
    </div>
  );
}
