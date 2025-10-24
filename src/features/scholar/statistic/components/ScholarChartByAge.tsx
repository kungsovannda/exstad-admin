import { AgeDistributionChart } from "@/components/statistic-card/ChartByAgeComponent";
import { Scholar } from "@/types/scholar";

export default function ScholarChartByAge({ data }: { data: Scholar[] }) {
  return (
    <div className="grid h-full grid-cols-1 gap-5">
      <AgeDistributionChart title={"Scholar"} data={data} />
    </div>
  );
}
