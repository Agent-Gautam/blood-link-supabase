import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function NotificationDrawerSkeleton() {
  return (
    <div className="h-[calc(100vh-120px)] mt-6 overflow-y-auto pr-2">
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <Skeleton className="h-2 w-2 rounded-full mt-2 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/4 mt-2" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded shrink-0" />
              </div>
            </div>
            {index < 4 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
