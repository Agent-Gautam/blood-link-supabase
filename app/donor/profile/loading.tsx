import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

export default function DonorProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link href="/donor">
            <Button variant="ghost" className="gap-2" disabled>
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Page Title */}
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Profile Card Skeleton */}
        <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-1 md:flex-initial space-y-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-5 w-20 mt-2" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* XP Level Display Skeleton */}
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-xl border-2 border-amber-200 bg-amber-50 p-6 shadow-lg">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-current to-transparent rounded-full blur-2xl" />
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>

                  {/* XP Display */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-full rounded-full" />
                      <div className="flex items-center justify-between text-xs">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>

                  {/* Level Milestones */}
                  <div className="pt-4 border-t border-white/20">
                    <Skeleton className="h-3 w-28 mb-2" />
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="flex-1 h-2 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 bg-muted/30 rounded-lg"
                >
                  <Skeleton className="h-5 w-5 mb-2 rounded-full" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Card Skeleton */}
        <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
              {/* Health Conditions (full width) */}
              <div className="md:col-span-2 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-full max-w-md" />
              </div>
              {/* Anonymous Donation (full width) */}
              <div className="md:col-span-2 space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Card Skeleton */}
        <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-7 w-64 mb-1" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>

              {/* Certificate Carousel */}
              <div className="overflow-hidden">
                <div className="flex gap-6">
                  <Skeleton className="flex-shrink-0 w-full md:w-[800px] h-[500px] rounded-lg" />
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-2 w-2 rounded-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
