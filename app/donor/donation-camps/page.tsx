"use client";

import { fetchDonationCamps, fetchOrganisationsForFilters } from "./actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { redirect } from "next/navigation";
import EmptyState from "@/components/empty-state";
import { DonationCampResult, OrganisationFilter } from "../types";
import CampCard from "./CampCard";
import CampCardSkeleton from "./camp-card-skeleton";
import { Calendar, X, Search, MapPin, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import OrganisationFilterComponent from "./organisation-filter";
import { toast } from "sonner";
import MapMarkers, {
  GeoFeatureCollection,
} from "@/components/location/map-markers";
import { Coordinates } from "@/lib/types";

async function handleSearch(formData: FormData) {
  const search = formData.get("search") as string;
  const location = formData.get("location") as string;
  const sort = formData.get("sort") as string;
  console.log(search, location, sort);

  const params = new URLSearchParams();
  if (search && search.trim()) params.append("search", search);
  if (location && location.trim()) params.append("location", location);
  if (sort && sort.trim()) params.append("sort", sort);

  const queryString = params.toString();
  const url = queryString
    ? `/donor/donation-camps?${queryString}`
    : `/donor/donation-camps`;

  redirect(url);
}

export default function DonationCampsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const [search, setSearch] = useState("");
  const [orgIds, setOrgIds] = useState("");
  const [sort, setSort] = useState("start_date-asc");
  const [camps, setCamps] = useState<DonationCampResult[]>([]);
  const [fetchedOrganisations, setFetchedOrganisations] = useState<
    OrganisationFilter[]
  >([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);
  const [loadingOrganisations, setLoadingOrganisations] = useState(false);
  const [loadingCamps, setLoadingCamps] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const offsetRef = useRef(0);
  const LIMIT = 10;

  const fetchOrganisations = useCallback(async () => {
    setLoadingOrganisations(true);
    const res = await fetchOrganisationsForFilters();
    console.log(res);
    if (!res.success) {
      console.error("Error fetching organisations:", res.error || res.message);
    }
    setFetchedOrganisations(res.data ?? []);
    setLoadingOrganisations(false);
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });
        setUseGeolocation(true);
        setGettingLocation(false);
        toast.success("Location accessed successfully");
      },
      (error) => {
        setGettingLocation(false);
        toast.error(
          "Failed to get your location. Please enable geolocation permissions."
        );
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const fetchCamps = useCallback(
    async (resetOffset = false) => {
      const offsetToUse = resetOffset ? 0 : offsetRef.current;
      const isInitialLoad = offsetToUse === 0;

      if (isInitialLoad) {
        setLoadingCamps(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetchDonationCamps(
        sort,
        search || null,
        orgIds || null,
        LIMIT,
        offsetToUse,
        useGeolocation && coordinates ? coordinates.lat : null,
        useGeolocation && coordinates ? coordinates.lng : null
      );

      if (!res.success) {
        console.error("Error fetching camps:", res.error || res.message);
        if (isInitialLoad) {
          setLoadingCamps(false);
        } else {
          setLoadingMore(false);
        }
        return;
      }

      const newCamps = res.data ?? [];

      if (isInitialLoad) {
        setCamps(newCamps);
        offsetRef.current = LIMIT;
        setOffset(LIMIT);
      } else {
        setCamps((prev) => [...prev, ...newCamps]);
        offsetRef.current = offsetRef.current + LIMIT;
        setOffset(offsetRef.current);
      }

      // Check if there are more camps to load
      setHasMore(newCamps.length === LIMIT);

      if (isInitialLoad) {
        setLoadingCamps(false);
      } else {
        setLoadingMore(false);
      }
    },
    [sort, search, orgIds, useGeolocation, coordinates]
  );

  // Update orgIds string when selectedOrgIds array changes
  useEffect(() => {
    setOrgIds(selectedOrgIds.join(","));
  }, [selectedOrgIds]);

  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);

  // Initial load on page mount
  useEffect(() => {
    offsetRef.current = 0;
    setOffset(0);
    setHasMore(true);
    fetchCamps(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleSearch = () => {
    offsetRef.current = 0;
    setOffset(0);
    setHasMore(true);
    fetchCamps(true);
  };

  const handleLoadMore = () => {
    fetchCamps(false);
  };

  const sortOptions = [
    { label: "Start Date (Asc)", value: "start_date-asc" },
    { label: "Start Date (Desc)", value: "start_date-desc" },
    { label: "Name (A-Z)", value: "name-asc" },
    { label: "Name (Z-A)", value: "name-desc" },
  ];

  // Convert camps to GeoFeatureCollection for map display
  const geoData: GeoFeatureCollection = useMemo(() => {
    // Note: DonationCampResult doesn't include lat/lng, so we'll need to fetch them
    // For now, return empty collection - camps would need lat/lng to be displayed
    return {
      type: "FeatureCollection",
      features: camps
        .filter((camp) => camp.location) // Only camps with location info
        .map((camp) => ({
          type: "Feature",
          properties: {
            htmlPopup: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${camp.name || "Unnamed Camp"}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${camp.location || ""}</p>
              </div>
            `,
          },
          geometry: {
            type: "Point",
            // Note: We need lat/lng from the database - using placeholder for now
            // The database query should return latitude and longitude
            coordinates: [0, 0] as [number, number], // Placeholder - needs actual coordinates
          },
        })),
    };
  }, [camps]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Ongoing Donation Camps near you
        </h1>
        <p className="text-muted-foreground">
          Discover and register for donation camps in your area
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            id="search"
            name="search"
            placeholder="Search by camp name..."
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <OrganisationFilterComponent
            organisations={fetchedOrganisations}
            selectedOrgIds={selectedOrgIds}
            onSelectionChange={setSelectedOrgIds}
            loading={loadingOrganisations}
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
            onClick={getCurrentLocation}
            disabled={gettingLocation || loadingCamps}
            variant={useGeolocation ? "default" : "outline"}
            className="gap-2"
            type="button"
          >
            {gettingLocation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                {useGeolocation ? "Using Location" : "Use My Location"}
              </>
            )}
          </Button>
          <Button
            onClick={handleSearch}
            disabled={loadingCamps}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        {(selectedOrgIds.length > 0 || useGeolocation) && (
          <div className="flex flex-wrap gap-2 items-center">
            {useGeolocation && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Using geolocation:
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setUseGeolocation(false);
                    setCoordinates(null);
                  }}
                  className="h-7 text-xs"
                >
                  {coordinates
                    ? `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
                    : "Current Location"}
                  <X className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
            {selectedOrgIds.length > 0 && (
              <>
                {useGeolocation && (
                  <span className="text-sm text-muted-foreground">•</span>
                )}
                <span className="text-sm text-muted-foreground">
                  Filtered by {selectedOrgIds.length} organisation
                  {selectedOrgIds.length !== 1 ? "s" : ""}:
                </span>
                {selectedOrgIds.map((orgId) => {
                  const org = fetchedOrganisations.find((o) => o.id === orgId);
                  return (
                    <Button
                      key={orgId}
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setSelectedOrgIds(
                          selectedOrgIds.filter((id) => id !== orgId)
                        )
                      }
                      className="h-7 text-xs"
                    >
                      {org?.name || orgId}
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      <div className="space-y-6">
        {loadingCamps ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CampCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : camps.length === 0 ? (
          <EmptyState
            title="No Donation Camps Found"
            description="No donation camps found near you. Please try again with different search criteria."
            icon={Calendar}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coordinates && camps.length > 0 && (
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
                    <MapMarkers
                      userCoordinates={coordinates as Coordinates}
                      geoData={geoData}
                    />
                  </DialogContent>
                </Dialog>
              )}
              {camps.map((camp) => (
                <CampCard
                  key={camp.id}
                  camp={camp}
                  caller="/donor/donation-camps"
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="min-w-[140px]"
                >
                  {loadingMore ? (
                    <>
                      <span className="mr-2">Loading...</span>
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
