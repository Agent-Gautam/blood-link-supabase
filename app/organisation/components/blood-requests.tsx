"use client";

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
import {
  DropletIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  Loader,
  HeartHandshake,
  User,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { BloodRequest } from "../types";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import fetchBloodRequests from "../requests/actions";
import { toast } from "sonner";
import { SupabaseClient } from "@supabase/supabase-js";
import EmptyState from "@/components/empty-state";
import BloodRequestsSkeleton from "./blood-requests-skeleton";
export default function BloodRequests({ org_id }: { org_id: string }) {
  const supabase = createClient();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setDataLoading(true);
    try {
      const requestResult = await fetchBloodRequests(org_id);
      if (!requestResult.success || requestResult.error) {
        console.error("Error fetching blood requests:", requestResult.error);
        toast.error("Failed to fetch blood requests. Please try again.");
        setRequests([]);
        return;
      }
      setRequests(requestResult.data || []);
    } catch (error: any) {
      console.error("Error fetching blood requests:", error);
      toast.error("Failed to fetch blood requests. Please try again.");
      setRequests([]);
    } finally {
      setDataLoading(false);
    }
  }, [org_id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
  // function handleRequestChange(id: string, newStatus: "FULFILLED"|"ACKNOWLEDGED") {
  //   setRequests((prevRequests: BloodRequest[]) =>
  //     prevRequests.map((request) =>
  //       request.id === id ? { ...request, status: newStatus } : request
  //     )
  //   );

  // }

  if (dataLoading) {
    return <BloodRequestsSkeleton />;
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No Blood Requests Yet"
        description="You haven't received any blood requests yet. When requests come in, they'll appear here for you to manage and fulfill."
        icon={HeartHandshake}
        showAddButton={false}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableCaption>Your blood donation request history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Requester</TableHead>
            <TableHead className="w-[100px]">Blood Type</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRowComponent
              key={request.id}
              request={request}
              fetchRequests={fetchRequests}
              supabase={supabase}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

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
  fetchRequests,
  supabase,
}: {
  request: BloodRequest;
  fetchRequests: () => void;
  supabase: SupabaseClient<any, "public", any>;
}) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Generalized handler for status update
  const handleStatusUpdate = async (
    newStatus: "ACKNOWLEDGED" | "FULFILLED"
  ) => {
    setLoading(true);
    const updateData: any = { status: newStatus };
    if (newStatus === "FULFILLED") {
      updateData.fulfilled_date = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from("blood_requests")
      .update(updateData)
      .eq("id", request.id);

    if (error) {
      toast.error(`Error updating request status: ${error.message}`);
      setLoading(false);
      return;
    }
    toast.success(`Request marked as ${newStatus.toLowerCase()}`);
    setLoading(false);
    setDialogOpen(false);
    fetchRequests();
  };

  // Button and dialog logic
  let actionButton = null;
  if (request.status === "PENDING") {
    actionButton = (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => setDialogOpen(true)}
            disabled={loading}
          >
            <CheckIcon className="h-3.5 w-3.5 mr-1" />
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              "Mark Acknowledged"
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark the request as Acknowledged</DialogTitle>
            <DialogDescription>
              This will mark the request as <b>ACKNOWLEDGED</b>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleStatusUpdate("ACKNOWLEDGED")}
              disabled={loading}
            >
              Yes, Mark Acknowledged
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else if (request.status === "ACKNOWLEDGED") {
    actionButton = (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
            onClick={() => setDialogOpen(true)}
            disabled={loading}
          >
            <CheckIcon className="h-3.5 w-3.5 mr-1" />
            {loading ? <Loader className="animate-spin" /> : "Mark Fulfilled"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will mark the request as <b>FULFILLED</b>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleStatusUpdate("FULFILLED")}
              disabled={loading}
            >
              Yes, Mark Fulfilled
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else if (request.status === "FULFILLED") {
    actionButton = (
      <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
        <ClockIcon className="h-3.5 w-3.5" />
        <span>
          {request.fulfilled_date
            ? `fulfilled on ${formatDate(request.fulfilled_date).date}`
            : "Date not recorded"}
        </span>
      </div>
    );
  }

  return (
    <TableRow key={request.id} className="hover:bg-gray-50">
      <TableCell>
        <Link
          href={`/info/donor/${request.donor_id}?backTo=/organisation/requests`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          <User className="h-4 w-4" />
          <span className="font-medium">
            {request.donor_name || "Unknown Donor"}
          </span>
        </Link>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <DropletIcon className="h-4 w-4 text-red-500" />
          <span>{request.blood_type}</span>
        </div>
      </TableCell>
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
          {formatDate(request.request_date).date}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(request.status)}</TableCell>
      <TableCell className="text-right">{actionButton}</TableCell>
    </TableRow>
  );
};
