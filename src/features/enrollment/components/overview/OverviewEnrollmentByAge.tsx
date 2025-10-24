import { AgeDistributionChart } from "@/components/statistic-card/ChartByAgeComponent";
import { Enrollment } from "@/types/enrollment";

export default function OverviewEnrollmentByAge({
  data,
}: {
  data: Enrollment[];
}) {
  return (
    <div className="grid h-full grid-cols-1 gap-5">
      <AgeDistributionChart title="Enrollment" data={data} />
    </div>
  );
}
