import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrganisationDashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Card Skeleton */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div className="space-y-2">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
        </Card>

        {/* Stats Section Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-red-100">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white rounded-lg shadow-md p-6">
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

        {/* Ongoing Camps Skeleton */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader className="p-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96 mt-2" />
          </CardHeader>
          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        </Card>

        {/* Blood Requests Skeleton */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </CardHeader>
          <div className="p-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="border-b p-4">
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-6 w-20" />
                  ))}
                </div>
              </div>
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-6 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Inventory Overview Skeleton */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader className="p-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64 mt-2" />
          </CardHeader>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
