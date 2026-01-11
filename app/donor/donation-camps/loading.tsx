import { Skeleton } from "@/components/ui/skeleton";
import CampCardSkeleton from "./camp-card-skeleton";

export default function DonationCampsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-96 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full max-w-xs" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-full max-w-xs" />
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      {/* Camp Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CampCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}
