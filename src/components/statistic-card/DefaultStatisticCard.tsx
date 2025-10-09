import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
interface DefaultStatisticCardProps {
  icon: LucideIcon;
  title: string;
  total?: {
    total: number;
    male: number;
    female: number;
  };
  isLoading?: boolean;
}
export default function DefaultStatisticCard({
  icon: Icon,
  title,
  total,
  isLoading = false,
}: DefaultStatisticCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="w-12 h-8" /> : total?.total}
        </div>
        <p className="text-xs text-muted-foreground flex items-center">
          Female: {isLoading ? <Skeleton className="w-5 h-3" /> : total?.female}
          , Male: {isLoading ? <Skeleton className="w-5 h-3" /> : total?.male}
        </p>
      </CardContent>
    </Card>
  );
}
