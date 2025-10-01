import { Skeleton } from "@/components/ui/skeleton";

type SectionSkeletonProps = {
  count?: number;
};

export function SectionSkeleton({ count = 3 }: SectionSkeletonProps) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" /> 
        <Skeleton className="h-9 w-32" /> 
      </div>

      {/* Highlight list skeleton */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center bg-accent rounded-sm p-4"
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" /> 
            <Skeleton className="h-3 w-60" /> 
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-4 w-4 rounded" /> 
            <Skeleton className="h-4 w-4 rounded" /> 
          </div>
        </div>
      ))}
    </div>
  );
}
