import { AddressMapChart } from "@/components/statistic-card/ChartByCurrentAddressComponent";
import { Enrollment } from "@/types/enrollment";

export default function OverviewEnrollmentByAddress({
  data,
}: {
  data: Enrollment[];
}) {
  return (
    <div className="grid h-full grid-cols-1 gap-5">
      <AddressMapChart data={data} title="Enrollment" />
    </div>
  );
}
