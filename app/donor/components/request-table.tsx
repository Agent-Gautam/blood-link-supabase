"use client";
//task store in db who set the request fulfilled - donor or org ?
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
import {
  DropletIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  Loader,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SupabaseClient } from "@supabase/supabase-js";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BloodRequest } from "@/app/types";

interface RequestHistoryProps {
  requests: BloodRequest[];
}

export const DonorRequestTable: React.FC<RequestHistoryProps> = ({
  requests,
}) => {
  const router = useRouter();
  const supabase = createClient();

  // Gather all unique blood types from requests
  const bloodTypes = Array.from(
    new Set(requests.map((r) => r.blood_type))
  ).sort();
  const [selectedBloodType, setSelectedBloodType] =
    React.useState<string>("All");

  // Gather all unique statuses from requests
  const statusTypes = Array.from(new Set(requests.map((r) => r.status))).sort();
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  // Sort and filter requests by selected blood type, status, and request date
  const filteredRequests = React.useMemo(() => {
    let filtered = requests.filter((r) => {
      const bloodTypeMatch =
        selectedBloodType === "All" || r.blood_type === selectedBloodType;
      const statusMatch =
        selectedStatus === "All" || r.status === selectedStatus;
      return bloodTypeMatch && statusMatch;
    });
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.request_date).getTime();
      const dateB = new Date(b.request_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [requests, selectedBloodType, selectedStatus, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableCaption>Your blood donation request history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto min-w-0 flex items-center gap-1"
                  >
                    Blood Type
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => setSelectedBloodType("All")}
                    className={
                      selectedBloodType === "All" ? "font-bold bg-accent" : ""
                    }
                  >
                    All
                  </DropdownMenuItem>
                  {bloodTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setSelectedBloodType(type)}
                      className={
                        selectedBloodType === type ? "font-bold bg-accent" : ""
                      }
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="inline-flex items-center gap-1 cursor-pointer select-none"
                      onClick={handleSortToggle}
                    >
                      Request Date
                      {sortOrder === "asc" ? (
                        <ArrowUp className="w-4 h-4 text-blue-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-blue-500" />
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Sort by request date</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto min-w-0 flex items-center gap-1"
                  >
                    Status
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("All")}
                    className={
                      selectedStatus === "All" ? "font-bold bg-accent" : ""
                    }
                  >
                    All
                  </DropdownMenuItem>
                  {statusTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setSelectedStatus(type)}
                      className={
                        selectedStatus === type ? "font-bold bg-accent" : ""
                      }
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <TableRowComponent
                key={request.id}
                request={request}
                router={router}
                supabase={supabase}
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
  supabase,
}: {
  request: BloodRequest;
  router: AppRouterInstance;
  supabase: SupabaseClient<any, "public", any>;
}) => {
  const [loading, setLoading] = useState(false);
  const handleMarkFulfilled = async () => {
    setLoading(true);
    console.log(`Request ${request.id} marked fulfilled`);

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
          {formatDate(request.request_date).date}
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
