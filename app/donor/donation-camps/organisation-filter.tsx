"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, X, Loader2 } from "lucide-react";
import { OrganisationFilter } from "../types";
import { useState } from "react";

type OrganisationFilterProps = {
  organisations: OrganisationFilter[];
  selectedOrgIds: string[];
  onSelectionChange: (orgIds: string[]) => void;
  loading?: boolean;
};

export default function OrganisationFilterComponent({
  organisations,
  selectedOrgIds,
  onSelectionChange,
  loading = false,
}: OrganisationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (orgId: string) => {
    if (selectedOrgIds.includes(orgId)) {
      onSelectionChange(selectedOrgIds.filter((id) => id !== orgId));
    } else {
      onSelectionChange([...selectedOrgIds, orgId]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
          Filter by Organisation
          {selectedOrgIds.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedOrgIds.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Select Organisations</h3>
            {selectedOrgIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          {loading ? (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-2 rounded-md"
                >
                  <Skeleton className="h-4 w-4 rounded mt-1" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : organisations.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4">
              No organisations found
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {organisations.map((org) => {
                const isSelected = selectedOrgIds.includes(org.id);
                return (
                  <div
                    key={org.id}
                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      id={org.id}
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(org.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={org.id}
                        className="text-sm font-medium cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">{org.name}</span>
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {org.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistance(org.distance_metres)} away
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
