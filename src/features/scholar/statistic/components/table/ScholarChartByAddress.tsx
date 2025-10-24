import { AddressMapChart } from "@/components/statistic-card/ChartByCurrentAddressComponent";
import { Scholar } from "@/types/scholar";

export default function ScholarChartByAddress({ data }: { data: Scholar[] }) {
  return (
    <div className="grid h-full grid-cols-1 gap-5">
      <AddressMapChart data={data} title="Scholar" />
    </div>
  );
}
