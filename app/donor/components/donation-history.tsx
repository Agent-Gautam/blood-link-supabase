"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import {
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Search,
  Calendar,
  MapPin,
  Droplet,
  Building2,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

type DonationHistoryProps = {
  id: string;
  donation_date: string;
  donation_camps: { name: string; location: string };
  units_donated: number;
  status: string;
  organisations: { name: string };
  organisation_id: string;
  donation_camp_id: string;
};

const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
        >
          Completed
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
        >
          Pending
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
        >
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="capitalize">
          {status || "Unknown"}
        </Badge>
      );
  }
};

export default function DonationHistory({
  donationData,
}: {
  donationData: DonationHistoryProps[] | null;
}) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedData = useMemo(() => {
    if (!donationData) return [];
    return [...donationData].sort((a, b) => {
      const dateA = new Date(a.donation_date).getTime();
      const dateB = new Date(b.donation_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [donationData, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (!donationData || donationData.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold mb-2 text-center">
            No Donations Yet
          </CardTitle>
          <CardDescription className="text-center mb-6 max-w-md">
            Start your journey of saving lives! Find a donation camp near you
            and make your first blood donation.
          </CardDescription>
          <Link href="/donor/donation-camps">
            <Button variant="default" className="gap-2" size="lg">
              <Search className="h-4 w-4" />
              Find Donation Camp
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const totalUnits = donationData.reduce(
    (sum, donation) => sum + donation.units_donated,
    0
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Donation History
            </CardTitle>
            <CardDescription className="mt-1.5 text-base">
              Track your blood donation contributions and impact
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
            <Droplet className="h-5 w-5 text-red-500" />
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">
                Total Units
              </p>
              <p className="text-xl font-bold">{totalUnits}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-base h-12">
                  Camp Name
                </TableHead>
                <TableHead className="font-semibold text-base">
                  Organisation
                </TableHead>
                <TableHead
                  className="font-semibold text-base cursor-pointer select-none hover:bg-muted/50 transition-colors"
                  onClick={handleSortToggle}
                >
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                    {sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4 text-primary" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-primary" />
                    )}
                  </span>
                </TableHead>
                <TableHead className="font-semibold text-base">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </span>
                </TableHead>
                <TableHead className="font-semibold text-base">
                  <span className="inline-flex items-center gap-2">
                    <Droplet className="h-4 w-4" />
                    Units
                  </span>
                </TableHead>
                <TableHead className="font-semibold text-base">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((donation, index) => (
                <TableRow
                  key={donation.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base leading-tight mb-1">
                          {donation?.donation_camps?.name || "Unnamed Camp"}
                        </p>
                      </div>
                      {donation?.donation_camp_id && (
                        <Link
                          href={`/info/camp/${donation.donation_camp_id}?backTo=/donor/donation-history`}
                          className="shrink-0"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label="View camp details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-sm font-medium leading-tight">
                            {donation?.organisations?.name ||
                              "Unknown Organisation"}
                          </p>
                        </div>
                      </div>
                      {donation?.organisation_id && (
                        <Link
                          href={`/info/organisation/${donation.organisation_id}?backTo=/donor/donation-history`}
                          className="shrink-0"
                          aria-label="View organisation details"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">
                        {formatDate(donation?.donation_date).date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">
                        {donation?.donation_camps?.location ||
                          "Location not specified"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">
                        {donation?.units_donated || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        units
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(donation?.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
