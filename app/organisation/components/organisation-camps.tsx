"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";
import { toast } from "sonner";
import { fetchAllCamps } from "../camps/actions";
import CampDetailsShow from "./camp-details";
import EmptyState from "@/components/empty-state";
import { Calendar, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const sortOptions = [
  { label: "Start Date (Asc)", value: "start_date-asc" },
  { label: "Start Date (Desc)", value: "start_date-desc" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function AllCamps({ org_id }: { org_id: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState(sortOptions[0].value);
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getSortObj = () => {
    const [column, order] = sort.split("-");
    return { column, order };
  };

  const fetchCamps = useCallback(
    async (searchVal = search, locationVal = location, sortVal = sort) => {
      setLoading(true);
      const filters: any = {};
      if (locationVal) filters.location = locationVal;
      const result = await fetchAllCamps(
        filters,
        sortVal,
        searchVal
      );
      if (!result.success) {
        toast.error(
          `Error fetching camps: ${result.error?.message || "Unknown error"}`
        );
        return;
      }
      setCamps(result.data ? result.data : []);
      setLoading(false);
    },
    [org_id, search, location, sort]
  );

  // Debounced version to avoid excessive calls
  const debouncedFetchCamps = useCallback(debounce(fetchCamps, 400), [
    fetchCamps,
  ]);

  useEffect(() => {
    debouncedFetchCamps(search, location, sort);
    return debouncedFetchCamps.cancel;
  }, [search, location, sort, debouncedFetchCamps]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by camp name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => fetchCamps()}
          disabled={loading}
          variant="outline"
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {camps.length === 0 && !loading ? (
          <EmptyState
            title="No Donation Camps Yet"
            description="Start organizing donation camps to collect blood from donors in your community. Create your first camp to begin."
            icon={Calendar}
            buttonText="Create First Camp"
            buttonIcon={Plus}
            onAdd={() => router.push("/organisation/camps/update")}
          />
        ) : (
          camps.map((camp) => <CampDetailsShow campData={camp} key={camp.id} />)
        )}
      </div>
    </div>
  );
}
