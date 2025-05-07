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
} from "lucide-react";
import { BloodRequest } from "@/app/donor/components/request-table";
import { createClient } from "@/utils/supabase/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function BloodRequests({
  requests,
}: {
  requests: BloodRequest[];
}) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableCaption>Your blood donation request history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Blood Type</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRowComponent
                key={request.id}
                request={request}
                router={router}
              />
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
  router,
}: {
  request: BloodRequest;
  router: AppRouterInstance;
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Generalized handler for status update
  const handleStatusUpdate = async (
    newStatus: "ACKNOWLEDGED" | "FULFILLED"
  ) => {
    setLoading(true);
    const supabase = createClient();
    const updateData: any = { status: newStatus };
    if (newStatus === "FULFILLED") {
      updateData.fulfilled_date = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from("blood_requests")
      .update(updateData)
      .eq("id", request.id);

    if (error) {
      console.error("Error updating request status:", error.message);
    } else {
      setStatus(newStatus);
    }
    setLoading(false);
    setDialogOpen(false);
    router.refresh();
  };

  // Button and dialog logic
  let actionButton = null;
  if (status === "PENDING") {
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
            <DialogTitle>Are you absolutely sure?</DialogTitle>
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
  } else if (status === "ACKNOWLEDGED") {
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
  } else if (status === "FULFILLED") {
    actionButton = (
      <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
        <ClockIcon className="h-3.5 w-3.5" />
        <span>
          {request.fulfilled_date
            ? request.fulfilled_date
            : "Date not recorded"}
        </span>
      </div>
    );
  }

  return (
    <TableRow key={request.id} className="hover:bg-gray-50">
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
          {request.request_date}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(status)}</TableCell>
      <TableCell className="text-right">{actionButton}</TableCell>
    </TableRow>
  );
};
