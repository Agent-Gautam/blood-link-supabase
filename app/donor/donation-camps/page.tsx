"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CampCard from "./CampCard";
import {
  fetchCampRegistrations,
  fetchDonationCamps,
  registerForCamp,
} from "./actions";
import { Button } from "@/components/ui/button";
import { RegisterDonor } from "../register/actions";
import { toast } from "sonner";
import GeoLocationAccess from "@/archives/map/geo-location-access";

const sortOptions = [
  { label: "Start Date (Asc)", value: "start_date-asc" },
  { label: "Start Date (Desc)", value: "start_date-desc" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function DonationCampsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState(sortOptions[0].value);
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [campRegistrations, setCampRegistrations] = useState<string[]>([]);

  const getSortObj = () => {
    const [column, order] = sort.split("-");
    return { column, order };
  };
  const fetchRegistrations = async () => {
    console.log("fetching registrations");
    const result = await fetchCampRegistrations();
    setCampRegistrations(result);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchCamps = async () => {
    console.log("fetching camps");
    setLoading(true);
    const filters: any = {};
    if (location) filters.location = location;
    const data = await fetchDonationCamps(filters, getSortObj(), search);
    setCamps(data);
    setLoading(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCamps();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line
  }, [search, location, sort]);

  async function registerDonorForCamp(campId: string) {
    toast.loading("Registering...");
    const result = await registerForCamp(campId);
    toast.dismiss();
    if (!result.success) {
      toast.error(`Registration error : ${result.error}`);
      return;
    }
    toast.success(`${result.message}`);
    fetchRegistrations();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Donation Camps</h1>
      <GeoLocationAccess />
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
        <Button onClick={fetchCamps} disabled={loading} variant="outline">
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {camps.length === 0 && !loading && <div>No camps found.</div>}
        {camps.map((camp) => (
          <CampCard
            key={camp.id}
            camp={camp}
            register={registerDonorForCamp}
            isRegistered={campRegistrations.includes(camp.id)}
          />
        ))}
      </div>
    </div>
  );
}
