"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { Organisation } from "@/lib/types";
import { verifyOrganisation } from "../actions";
import OrganisationTableRow from "./organisation-table-row";

type OrganizationTableProps = {
  initialOrganisations: Organisation[];
};

export default function OrganizationTable({
  initialOrganisations,
}: OrganizationTableProps) {
  const [organisations, setOrganisations] =
    useState<Organisation[]>(initialOrganisations);

  const handleVerify = async (orgId: string) => {
    setOrganisations((prev) =>
      prev.map((org) =>
        org.id === orgId ? { ...org, verified: !org.verified } : org
      )
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
            <TableBody>
              {organisations.map((org) => (
                <OrganisationTableRow
                  key={org.id}
                  orgData={org}
                  handleVerify={handleVerify}
                />
              ))}
            </TableBody>
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
