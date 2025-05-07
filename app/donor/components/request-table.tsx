"use client"

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropletIcon, CalendarIcon, CheckIcon, ClockIcon, Loader } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface BloodRequest {
  id: string;
  blood_type: string;
  units_needed: number;
  urgency: boolean;
  request_date: string;
  status: "PENDING" | "FULFILLED" | "ACKNOWLEDGED";
  fulfilled_date: string | null;
  organisations: { name: string };
}

interface RequestHistoryProps {
  requests: BloodRequest[];
}

export const DonorRequestTable: React.FC<RequestHistoryProps> = ({
  requests
}) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableCaption>Your blood donation request history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Blood Type</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRowComponent key={request.id} request={request} router={router}/>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-600 border-amber-200"
          >
            Pending
          </Badge>
        );
      case "FULFILLED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Fulfilled
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-600 border-gray-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

const TableRowComponent = ({
  request,
  router,
}: {
  request: BloodRequest;
  router: AppRouterInstance;
}) => {
  const [loading, setLoading] = useState(false);
  const handleMarkFulfilled = async () => {
    setLoading(true);
    console.log(`Request ${request.id} marked fulfilled`);
    const supabase = createClient();
    const fulfilled_date = new Date().toISOString();
    const { data, error } = await supabase
      .from("blood_requests")
      .update({ status: "FULFILLED", fulfilled_date })
      .eq("id", request.id);

    if (error) {
      console.error("Error updating request status:", error.message);
    } else {
      console.log("Request status updated successfully:", data);
    }
    router.refresh();
    setLoading(false);
  };
  return (
    <TableRow key={request.id} className="hover:bg-gray-50">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <DropletIcon className="h-4 w-4 text-red-500" />
          <span>{request.blood_type}</span>
        </div>
      </TableCell>
      <TableCell>{request?.organisations?.name}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className="font-medium">{request.units_needed}</span>
          <span className="ml-1 text-gray-500 text-sm">units</span>
          {request.urgency && (
            <Badge
              variant="outline"
              className="ml-2 bg-red-50 text-red-600 border-red-200"
            >
              Urgent
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarIcon className="h-3.5 w-3.5" />
          {request.request_date}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(request.status)}</TableCell>
      <TableCell className="text-right">
        {request.status === "ACKNOWLEDGED" && (
          <Button
            onClick={handleMarkFulfilled}
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            <CheckIcon className="h-3.5 w-3.5 mr-1" />
            {loading ? <Loader className="animate-spin" /> : "Mark Fulfilled"}
          </Button>
        )}
        {request.status == "PENDING" && <div>Not ACKNOWLEDGED yet</div>}
        {request.status === "FULFILLED" && (
          <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>
              {request.fulfilled_date
                ? request.fulfilled_date
                : "Date not recorded"}
            </span>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
  