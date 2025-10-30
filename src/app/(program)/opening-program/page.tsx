"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { Heading } from "@/components/Heading";
import OpeningProgramTable from "@/features/opening-program/components/table/opening-program-table";
import { useGetAllOpeningProgramsQuery, useUpdateOpeningProgramMutation } from "@/features/opening-program/openingProgramApi";
import { openingProgramType } from "@/types/opening-program";
import { openingProgramColumns } from "@/features/opening-program/components/table/column";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { OpeningProgramStatisticCard } from "@/features/opening-program/components/StatisticCard";
import { useGetAllMasterProgramsQuery } from "@/features/master-program/masterProgramApi";
import { sortByAudit } from "@/utils/sortByAudit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

export default function OpeningProgramPage() {
  const { data: openingProgram = [], isLoading, error } =
    useGetAllOpeningProgramsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const { data: masterProgram = [] } = useGetAllMasterProgramsQuery();
  const [updateProgram]  = useUpdateOpeningProgramMutation()
  // ✅ Auto-update status based on deadline
  const today = new Date();
useEffect(() => {
  openingProgram.forEach((program) => {
    if (program.deadline && new Date(program.deadline) < today && program.status !== "CLOSED") {
      updateProgram({
        uuid: program.uuid,
        body: {
          ...program,
          status: "CLOSED",
        },
      });
    }
  });
}, [openingProgram, updateProgram]);

    const updatedPrograms: openingProgramType[] = openingProgram.map((program) => {
    if (program.deadline && new Date(program.deadline) < today && program.status !== "CLOSED") {
      return { ...program, status: "CLOSED" };
    }
    return program;
  });

  // ✅ Use updatedPrograms for sorting and columns
  const openingPrograms: openingProgramType[] = sortByAudit(updatedPrograms);
  const columns = openingProgramColumns(openingPrograms);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title="Opening Program"
          description="Opening Program Management"
        />
        <Link href="/opening-program/create">
          <Button variant="outline" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] cursor-pointer">
              Create New Opening Program
            </span>
          </Button>
        </Link>
      </div>

      <OpeningProgramStatisticCard
        OpeningProgram={updatedPrograms}
        isLoading={isLoading}
        MasterProgram={masterProgram}
      />

      <Card className="flex flex-col space-y-4 rounded-lg shadow-sm">
        <CardHeader className="items-center pb-2">
          <CardTitle>Opening Program Overview</CardTitle>
          <CardDescription>
            View and manage opening program information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton columnCount={5} />
          ) : (
            <OpeningProgramTable
              data={openingPrograms} // pass sorted, updated programs
              totalItems={openingPrograms.length}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

