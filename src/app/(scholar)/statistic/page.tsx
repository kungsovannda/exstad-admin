"use client";
import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCurrentAddressesQuery } from "@/features/current-address/currentAddressApi";
import { useGetAllProvincesQuery } from "@/features/province/provinceApi";
import { useGetAllScholarsQuery } from "@/features/scholar/scholarApi";
import AddScholar from "@/features/scholar/statistic/components/AddScholar";
import ScholarCharts from "@/features/scholar/statistic/components/ScholarCharts";
import { StatisticCard } from "@/features/scholar/statistic/components/StatisticCard";
import { ScholarColumns } from "@/features/scholar/statistic/components/table/column";
import { ScholarTable } from "@/features/scholar/statistic/components/table/data-table";
import { useGetAllUniversitiesQuery } from "@/features/university/universityApi";
import { useAuth } from "@/hooks/use-auth";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function StatisticPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data, isLoading } = useGetAllScholarsQuery();
  const { hasRole } = useAuth();

  const { data: provinces } = useGetAllProvincesQuery();
  const provinceOptions = useMemo(
    () =>
      provinces?.map((p) => ({
        label: p.englishName ?? "",
        value: p.englishName ?? "",
      })) ?? [],
    [provinces]
  );

  const { data: currentAddresses } = useGetCurrentAddressesQuery();
  const addressOptions = useMemo(
    () =>
      currentAddresses?.map((p) => ({
        label: p.englishName ?? "",
        value: p.englishName ?? "",
      })) ?? [],
    [currentAddresses]
  );
  const { data: universities } = useGetAllUniversitiesQuery();
  const universityOptions = useMemo(
    () =>
      universities?.map((p) => ({
        label: p.englishName ?? "",
        value: p.englishName ?? "",
      })) ?? [],
    [universities]
  );
  const column = useMemo(
    () => ScholarColumns(provinceOptions, universityOptions, addressOptions),
    [provinceOptions, universityOptions, addressOptions]
  );
  return (
    <div className="p-6 space-y-6 min-h-screen h-fit">
      <div className="flex justify-between items-center  gap-10">
        <Heading
          title="Scholar Management"
          description="View statistic and manage scholars"
        />
        {hasRole(["INSTRUCTOR1", "ADMIN"]) && (
          <Button
            onClick={() => {
              setIsCreateOpen(true);
            }}
            variant="outline"
            className="flex items-center gap-2.5"
          >
            <FiPlus />
            <span>Add Scholar</span>
          </Button>
        )}
      </div>
      <StatisticCard />
      <ScholarCharts />
      <Card className="flex flex-col space-y-4 rounded-lg shadow-sm">
        <CardHeader className="items-center pb-2">
          <CardTitle>Scholar Overview</CardTitle>
          <CardDescription>View and manage scholar information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton columnCount={5} />
          ) : (
            <ScholarTable
              columns={column}
              totalItems={Array.isArray(data) ? data.length : 0}
              data={Array.isArray(data) ? data : []}
            />
          )}
          {isCreateOpen && (
            <AddScholar open={isCreateOpen} onOpenChange={setIsCreateOpen} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
