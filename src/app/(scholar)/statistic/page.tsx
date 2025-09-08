"use client";
import { Heading } from "@/components/Heading";
import ScholarCharts from "@/components/scholar/ScholarCharts";
import { StatisticCard } from "@/components/scholar/statistic-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { scholars } from "@/data/scholars";
import AddScholar from "@/features/scholar/statistic/components/AddScholar";
import { scholarColumns } from "@/features/scholar/statistic/components/table/column";
import { ScholarTable } from "@/features/scholar/statistic/components/table/data-table";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function StatisticPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="p-6 space-y-6 min-h-screen h-fit">
      <div className="flex justify-between items-center  gap-10">
        <Heading
          title="Scholar Management"
          description="View statistic and manage scholars"
        />
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
      </div>

      <StatisticCard />
      <ScholarCharts />
      <Card className="flex flex-col space-y-4 rounded-lg shadow-sm">
        <CardHeader className="items-center pb-2">
          <CardTitle>Scholar Overview</CardTitle>
          <CardDescription>View and manage scholar information</CardDescription>
        </CardHeader>
        <CardContent>
          <ScholarTable
            columns={scholarColumns}
            totalItems={scholars.length}
            data={scholars}
          />
          {isCreateOpen && (
            <AddScholar open={isCreateOpen} onOpenChange={setIsCreateOpen} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
