"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { verifyOrganisation } from "../actions";

type OrganizationTableProps = {
  initialOrganisations: Organisation[];
};
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

const handleOpenDetails = (org: Organisation) => {
  toast.message(`Opening details for ${org.name}`);
  // Here you would typically open a modal or navigate to a details page
  console.log("Opening details for:", org);
};

export default function OrganizationTable({ initialOrganisations }: OrganizationTableProps) {
  const [organisations, setOrganisations] = useState<Organisation[]>(initialOrganisations);

  const handleVerify = async (orgId: string) => {
    setOrganisations((prev) =>
      prev.map((org) => (org.id === orgId ? { ...org, verified: !org.verified } : org))
    );
    const res = await verifyOrganisation(orgId);
    if (res.error) {
      setOrganisations((prev) =>
        prev.map((org) =>
          org.id === orgId ? { ...org, verified: !org.verified } : org
        )
      );
      toast.error(`Error verifying organisation: ${res.error}`);
    } else {
      toast.success(`Organisation verified successfully`);
    }
  };





  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization Directory
        </CardTitle>
        <CardDescription>
          Manage and verify healthcare organizations in the blood bank network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
                <TableHead className="font-semibold">Unique ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{organisations.map((org) => tableRow({orgData: org, handleVerify}))}</TableBody>
          </Table>
        </div>

        {/* Summary Statistics */}
        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold">{organisations.length}</div>
            <div className="text-sm text-muted-foreground">
              Total Organisations
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {organisations.filter((org) => org.verified).length}
            </div>
            <div className="text-sm text-green-600">Verified</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700">
              {organisations.filter((org) => !org.verified).length}
            </div>
            <div className="text-sm text-yellow-600">Pending Verification</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {organisations.filter((org) => org.type === "Blood Bank").length}
            </div>
            <div className="text-sm text-blue-600">Blood Banks</div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

const tableRow = ({ orgData, handleVerify }: { orgData: Organisation, handleVerify: (orgId: string) => void }) => {
  const [loading, setLoading] = useState(false);
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
            className={`h-8 ${orgData.verified
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
  )
}

