"use client";

import { useEffect, useState, useMemo } from "react";
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
import { getUser } from "@/utils/supabase/server";
import { Coordinates, MarkerData } from "@/lib/types";
import MapMarkers from "@/components/location/map-markers";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

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
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

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
    const fetchUserAndRegistrations = async () => {
      const user = await getUser();

      // Fetch donor's longitude and latitude from donors table
      if (user && user.id) {
        console.log("hello");
        const supabase = createClient();

        const { data, error } = await supabase
          .from("donors")
          .select("longitude, latitude")
          .eq("user_id", user.id)
          .single();
        console.log("User location data: ", data, error);
        if (!error && data) {
          setUserLocation({ lng: data.longitude, lat: data.latitude });
        }
      }
    };

    fetchUserAndRegistrations();
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

  // Create geoData from camps
  const geoData = {
    type: "FeatureCollection",
    features: camps
      .filter((camp) => camp.latitude && camp.longitude)
      .map((camp) => ({
        type: "Feature",
        properties: {
          htmlPopup: `
              <div style="padding: 8px 12px; min-width:180px;">
                <div style="font-weight:600; font-size:1rem; color:#d90429; margin-bottom:2px;">${camp.name}</div>
                <div style="font-size:0.95rem; color:#222;">Organised by: <span style='font-weight:500;'>${camp.organization?.name || "N/A"}</span></div>
              </div>
            `,
        },
        geometry: {
          type: "Point",
          coordinates: [camp.latitude, camp.longitude] as [number, number],
        },
      })),
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Donation Camps</h1>
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
        {userLocation && (
          <Dialog>
            <DialogTrigger asChild>
              <Card className="w-full max-w-md mx-auto mb-4 cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden">
                {/* Background image */}
                <img
                  src="/map-image.png"
                  alt="Map background"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
                />
                <div className="relative z-10">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold line-clamp-1">
                      View All Camps on Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground">
                      Click to view all donation camps on the map
                    </div>
                  </CardContent>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[80vh] p-0 flex items-center justify-center">
              <MapMarkers userCoordinates={userLocation} geoData={geoData} />
            </DialogContent>
          </Dialog>
        )}
        {camps.map((camp) => (
          <CampCard
            key={camp.id}
            camp={camp}
            register={registerDonorForCamp}
            isRegistered={campRegistrations.includes(camp.id)}
            caller="/donor/donation-camps"
          />
        ))}
      </div>
    </div>
  );
}
