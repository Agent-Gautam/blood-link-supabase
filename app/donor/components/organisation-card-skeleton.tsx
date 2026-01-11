import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganisationCardSkeleton() {
  return (
    <Card className="h-full max-w-[300px] min-w-[300px]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="flex items-start">
            <Skeleton className="h-4 w-4 rounded-full mr-1.5 shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 rounded-full mr-1.5 shrink-0" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="mt-3">
            <div className="flex items-center mb-1.5">
              <Skeleton className="h-4 w-4 rounded-full mr-1.5" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

