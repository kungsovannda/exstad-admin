"use client";
import { useUniversities } from "@/hooks/university/useUniversities";
import { DataTable } from "./data-table";
import { columns } from "./column";

type University = {
  uuid: string;
  englishName: string;
  khmerName: string;
  shortName: string;
  audit: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  };
};

export default function University() {
  const { data, isLoading, error } = useUniversities();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
