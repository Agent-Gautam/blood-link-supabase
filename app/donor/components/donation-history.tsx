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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ExternalLink, ArrowUp, ArrowDown, Search } from "lucide-react";
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
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>You haven't donated yet</CardTitle>
          <CardDescription>
            Donate blood today! Find a donation camp near you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/donor/donation-camps">
            <Button variant="default" className="gap-2">
              <Search className="w-4 h-4" />
              Find Donation Camp
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>Your recent blood donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Camp Name</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={handleSortToggle}
              >
                <span className="inline-flex items-center gap-1">
                  Date
                  {sortOrder === "asc" ? (
                    <ArrowUp className="w-4 h-4 text-blue-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-blue-500" />
                  )}
                </span>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  <span>
                    <p>{donation?.donation_camps?.name}</p>
                    {donation?.donation_camp_id && (
                      <Link
                        href={`/info/camp/${donation?.donation_camp_id}?backTo=/donor/donation-history`}
                      >
                        <Button variant={"outline"} className="size-5 p-0">
                          <ExternalLink />
                        </Button>
                      </Link>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex gap-2 flex-wrap">
                    <p>{donation?.organisations?.name}</p>
                    {donation?.organisation_id && (
                      <Link
                        href={`/info/organisation/${donation?.organisation_id}?backTo=/donor/donation-history`}
                        about="link to organisation"
                      >
                        <Button variant={"outline"} className="size-5 p-0">
                          <ExternalLink />
                        </Button>
                      </Link>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDate(donation?.donation_date).date}
                </TableCell>
                <TableCell>{donation?.donation_camps?.location}</TableCell>
                <TableCell>{donation?.units_donated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
