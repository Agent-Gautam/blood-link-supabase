"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { ReactEventHandler, SetStateAction, useEffect, useState } from "react";
import OrganisationCard from "@/components/organisation-card";
import { Loader, Filter, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import OrganisationCardSkeleton from "./organisation-card-skeleton";
import { OrganisationsWithBlood } from "../types";
import { Button } from "@/components/ui/button";

export default function SelectNearbyOrganisations({
  fetchedOrganisations,
  selectedOrganisations,
  setSelectedOrganisations,
  loading,
  setOffset,
  onRefresh,
}: {
  fetchedOrganisations: OrganisationsWithBlood[];
  selectedOrganisations: string[];
  setSelectedOrganisations: (organisations: string[]) => void;
  setOffset: (offset: number) => void;
  loading: boolean;
  onRefresh?: () => void;
}) {
  const [searchParams, setSearchParams] = useState({
    orgName: "",
    status: "null",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">
          Available Organizations
          {fetchedOrganisations && fetchedOrganisations.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({fetchedOrganisations.length} found)
            </span>
          )}
        </h2>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          name="orgName"
          value={searchParams.orgName}
          onChange={handleChange}
          placeholder="Search by organization name..."
          className="flex-1"
        />
        <Select
          name="status"
          value={searchParams.status}
          onValueChange={(value) =>
            setSearchParams({ ...searchParams, status: value })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium">Status: </h2>
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="true">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Verified</span>
              </div>
            </SelectItem>
            <SelectItem value="false">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-orange-600" />
                <span>Unverified</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="border-t pt-4">
        {loading ? (
          <div className="flex flex-row flex-wrap gap-4 animate-in fade-in-50 duration-300">
            {Array.from({ length: 6 }).map((_, index) => (
              <OrganisationCardSkeleton key={index} />
            ))}
          </div>
        ) : fetchedOrganisations && fetchedOrganisations.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-4 animate-in fade-in-50 duration-300">
            {fetchedOrganisations.map((org) => (
              <div
                key={org.organisation_id}
                className="flex justify-center transition-all hover:scale-[1.02]"
              >
                <OrganisationCard
                  organisation={org}
                  selected={selectedOrganisations.includes(org.organisation_id)}
                  onSelect={(id) => {
                    selectedOrganisations.includes(id)
                      ? setSelectedOrganisations(
                          selectedOrganisations.filter((org_id) => org_id != id)
                        )
                      : setSelectedOrganisations([
                          ...selectedOrganisations,
                          id,
                        ]);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center space-y-3">
              <div className="text-muted-foreground text-lg font-medium">
                No organizations found
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Try adjusting your search filters or check back later for new
                organizations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
