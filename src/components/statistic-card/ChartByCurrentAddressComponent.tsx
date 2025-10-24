import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import React from "react";

const colorScale = [
  { bg: "var(--chart-3)", text: "var(--chart-4)", border: "var(--chart-6)" },
  { bg: "var(--chart-6)", text: "var(--chart-5)", border: "var(--chart-1)" },
  {
    bg: "var(--chart-1)",
    text: "var(--primary-foreground)",
    border: "var(--chart-7)",
  },
  {
    bg: "var(--chart-7)",
    text: "var(--primary-foreground)",
    border: "var(--chart-2)",
  },
  {
    bg: "var(--chart-2)",
    text: "var(--primary-foreground)",
    border: "var(--chart-4)",
  },
  {
    bg: "var(--chart-4)",
    text: "var(--primary-foreground)",
    border: "var(--chart-5)",
  },
  {
    bg: "var(--chart-intermediate)",
    text: "var(--chart-5)",
    border: "var(--chart-advanced)",
  },
  {
    bg: "var(--chart-basic)",
    text: "var(--primary-foreground)",
    border: "var(--chart-5)",
  },
];

export function AddressMapChart({
  data,
  title,
}: {
  data: { currentAddress: string }[];
  title: string;
}) {
  const addressData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const addressCounts: Record<string, number> = {};

    data.forEach((c) => {
      const address = c.currentAddress?.trim();
      if (address) {
        addressCounts[address] = (addressCounts[address] || 0) + 1;
      }
    });

    const sortedData = Object.entries(addressCounts)
      .map(([address, count]) => ({
        address,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const maxCount = Math.max(...sortedData.map((d) => d.count));

    return sortedData.map((item) => {
      const intensity = Math.min(
        Math.floor((item.count / maxCount) * colorScale.length),
        colorScale.length - 1
      );
      return {
        ...item,
        colorClass: colorScale[intensity],
      };
    });
  }, [data]);

  const totalEnrollments = addressData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {title} by Current Address
        </CardTitle>
        <CardDescription>
          Distribution of {totalEnrollments} scholars across{" "}
          {addressData.length} locations
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {addressData.map((item, index) => (
            <div
              key={index}
              className={`${item.colorClass} rounded-lg border-2 p-4 transition-all hover:scale-101 hover:shadow-md cursor-pointer`}
            >
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium opacity-90">
                  {item.address.length > 25
                    ? item.address.substring(0, 22) + "..."
                    : item.address}
                </div>
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-xs opacity-75">
                  {((item.count / totalEnrollments) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        {addressData.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No address data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
