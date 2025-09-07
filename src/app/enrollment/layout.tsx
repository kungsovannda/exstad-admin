import { Heading } from "@/components/Heading";
import { StatisticCard } from "@/components/scholar/statistic-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function StatisticPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-6 h-screen">
      <div className="flex justify-between items-center  gap-10">
        <Heading
          title="Enrollment Management"
          description="View statistic and manage scholars"
        />
        <Button variant="outline" className="flex items-center gap-2.5">
          <FiPlus />
          <span>Add Scholar</span>
        </Button>
      </div>
      <StatisticCard />
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <Link href={"/enrollment/paid"}>
            <TabsTrigger value="account">Paid</TabsTrigger>
          </Link>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}
