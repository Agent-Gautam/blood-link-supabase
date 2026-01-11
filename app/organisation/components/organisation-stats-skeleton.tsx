import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrganisationStatsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-red-100">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="transition-transform duration-200 hover:scale-105 bg-white rounded-lg shadow-md p-6"
        >
          <div className="space-y-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        </Card>
      ))}
      <div className="sm:col-span-2 lg:col-span-3 flex justify-center mt-4">
        <Skeleton className="h-11 w-64" />
      </div>
    </div>
  );
}
