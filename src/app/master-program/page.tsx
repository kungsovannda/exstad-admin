'use client'
import React, {  useMemo } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { SectionCards } from "@/components/program/section-card";
import DataTable from "./data-table";
import { columns } from "./column";
import { programData } from "@/data/programData";
import { programType } from "@/types/programs";

export default function Page() {
  const search = "";
const filterType = "all";
const filterLevel = "all";

  const filteredPrograms = useMemo(() => {
    return programData.filter((p: programType) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || p.program_type === filterType;
      const matchesLevel = filterLevel === "all" || p.level === filterLevel;
      return matchesSearch && matchesType && matchesLevel;
    });
  }, [search, filterType, filterLevel]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center  gap-10">
        <h1 className="text-3xl font-semibold">Program Management</h1>
        <Link href="/master-program/create">
          <Button variant="outline" className="flex items-center gap-2.5">
            <FiPlus className="text-[18px]" />
            <span className="text-[14px] font-bold">Open Program</span>
          </Button>
        </Link>
      </div>
      <SectionCards />
      <DataTable columns={columns} data={filteredPrograms} />
    </div>
  );
}
