import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { DropletIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DonorRequestLoading() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Previous Requests Button */}
        <Button disabled>
          Previous Requests
        </Button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Blood Donation Request
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Complete the form below to submit a blood donation request to
            organizations
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="rounded-t-lg border-b">
            <CardTitle className="text-2xl font-bold flex items-center">
              <DropletIcon className="h-6 w-6 mr-2 text-red-500" /> New Request
            </CardTitle>
            <CardDescription>
              Fill in all the required details to create your blood donation
              request
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="font-medium">
                    Blood Type <span className="text-red-500">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units" className="font-medium">
                    Units Needed <span className="text-red-500">*</span>
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Organizations Select */}
              <div className="space-y-2">
                <Label htmlFor="organizations" className="font-medium">
                  Organizations
                </Label>
                <Skeleton className="h-10 w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Please select blood type and units needed first
                </p>
              </div>

              {/* Urgent Checkbox */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="space-y-1.5">
                  <Label className="font-medium">
                    Urgent Request
                  </Label>
                </div>
              </div>

              {/* Organizations Preview Table Skeleton */}
              <div className="mt-4 space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Available Organizations (Loading...)
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Skeleton className="h-5 w-32" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-5 w-24" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-5 w-28" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-5 w-20" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-5 w-24" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-5 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-16" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="px-6 py-4 rounded-b-lg flex justify-end">
            <Skeleton className="h-10 w-[140px]" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
