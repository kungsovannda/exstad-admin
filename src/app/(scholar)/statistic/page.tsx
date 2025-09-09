import { Heading } from "@/components/Heading";
import { StatisticCard } from "@/components/scholar/statistic-card";
import { Button } from "@/components/ui/button";
import { scholars } from "@/data/scholars";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { columns } from "./column";
import { StatisticTable } from "./data-table";

export default function StatisticPage() {
  return (
    <div className="p-6 space-y-6 h-screen">
      <div className="flex justify-between items-center  gap-10">
        <Heading
          title="Scholar Management"
          description="View statistic and manage scholars"
        />
        <Button variant="outline" className="flex items-center gap-2.5">
          <FiPlus />
          <span>Add Scholar</span>
        </Button>
      </div>
      <StatisticCard />
      <StatisticTable
        columns={columns}
        totalItems={scholars.length}
        data={scholars}
      />
    </div>
  );
}
