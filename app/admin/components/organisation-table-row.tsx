"use client";

import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle,
  Building2,
  Calendar,
  MapPin,
  Hash,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import { Organisation } from "@/lib/types";
import { useRouter } from "next/navigation";

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "blood bank":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "hospital":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "clinic":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type OrganisationTableRowProps = {
  orgData: Organisation;
  handleVerify: (orgId: string) => void;
};

export default function OrganisationTableRow({
  orgData,
  handleVerify,
}: OrganisationTableRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOpenDetails = (org: Organisation) => {
    toast.message(`Opening details for ${org.name}`);
    router.push(`/info/organisation/${org.id}?backTo=/admin`);
  };

  return (
    <TableRow key={orgData.id} className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {orgData.name}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className={getTypeColor(orgData.type)}>
          {orgData.type}
        </Badge>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="flex items-start gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
          <span className="text-sm text-muted-foreground line-clamp-2">
            {orgData.address}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDate(orgData.created_at)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            {orgData.unique_id}
          </code>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={orgData.verified ? "default" : "secondary"}
          className={
            orgData.verified
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          }
        >
          {orgData.verified ? "Verified" : "Pending"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenDetails(orgData)}
            className="h-8"
          >
            <Eye className="h-3 w-3 mr-1" />
            Details
          </Button>
          <Button
            disabled={loading}
            variant={orgData.verified ? "secondary" : "default"}
            size="sm"
            onClick={() => handleVerify(orgData.id)}
            className={`h-8 ${
              orgData.verified
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            {loading ? (
              <>
                <Loader className="h-3 w-3 animate-spin mr-1" />
                Loading...
              </>
            ) : orgData.verified ? (
              "Unverify"
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
