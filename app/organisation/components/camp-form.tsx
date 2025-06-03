"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateCampAction } from "../camps/actions";
import SelectBloodBanks from "./select-blood-bank";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { Coordinates, Location } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeoLocation from "@/components/location/geo-location-access";
const MapWithSearch = dynamic(
  () => import("@/components/location/map-with-search"),
  {
    ssr: false,
  }
);

export type CampDetailsType = {
  name: string;
  location: string;
  longitude: string;
  latitude: number | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  blood_bank_id: string | undefined;
  organisation_id: string | undefined;
};

export default function CampForm({
  campData,
  inventoryOn,
  org_id,
}: {
  campData: CampDetailsType | null;
  inventoryOn: boolean | null;
  org_id: string;
}) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [location, setLocation] = useState<Location>();
  const [selectedBloodBank, setSelectedBloodBank] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (
    newLocation: Location,
    newCoordinates: Coordinates
  ) => {
    if (newCoordinates.lat && newCoordinates.lng && newLocation.address) {
      setLocation(newLocation);
      setCoordinates(newCoordinates);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBloodBank && !inventoryOn) {
      toast.error("Please select a blood bank");
      return;
    }
    if (
      !location ||
      !location.state ||
      !location.city ||
      !location.country ||
      !coordinates
    ) {
      toast.error("Please select a valid location from the map");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set("latitude", coordinates.lat.toString());
    formData.set("longitude", coordinates.lng.toString());
    formData.set("location", location.address);
    setLoading(true);
    toast.loading("Creating camp...");
    const response = await CreateCampAction(formData);
    setLoading(false);
    toast.dismiss();
    if (response) {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.error?.message || "Error creating camp");
      }
    } else {
      toast.error("Failed to create camp: not authorized");
    }
  };
  if (inventoryOn === null) {
    toast.error("Error fetching inventory status");
  }
  return (
    <form
      className="flex flex-col max-w-[500px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-medium">Create Camp</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="name">Camp Name</Label>
        <Input
          name="name"
          placeholder="Camp Name"
          defaultValue={campData?.name}
          required
        />

        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Location*</label>
          {location && (
            <Card className="bg-gray-50 border border-gray-200 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Selected Location
                </CardTitle>
                <CardDescription className="text-xs">
                  Please verify your location details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    <span>{location.address || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium">City:</span>{" "}
                    <span>{location.city || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium">State:</span>{" "}
                    <span>{location.state || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Pincode:</span>{" "}
                    <span>{location.postalCode || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Country:</span>{" "}
                    <span>{location.country || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <GeoLocation onLocationSet={handleLocationChange} />
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" className="mt-2 bg-blue-600 text-white">
                Select Location on Map
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
              <DialogHeader className="bg-red-300 sr-only">
                <DialogTitle>Select Location</DialogTitle>
                <DialogDescription>
                  Search for a location or click on the map to select.
                </DialogDescription>
              </DialogHeader>
              <MapWithSearch
                initialCoordinates={coordinates}
                handleLocationChange={handleLocationChange}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Label htmlFor="start_date">Start Date</Label>
        <Input
          name="start_date"
          type="datetime-local"
          defaultValue={campData?.start_date}
          required
        />

        <Label htmlFor="end_date">End Date</Label>
        <Input
          name="end_date"
          type="datetime-local"
          defaultValue={campData?.end_date}
          required
        />
        <Input
          name="blood_bank_id"
          type="hidden"
          defaultValue={campData?.blood_bank_id}
          value={inventoryOn ? org_id : (selectedBloodBank ?? "")}
          required
          readOnly
        />
        {!inventoryOn && (
          <>
            <Label htmlFor="blood_bank_id">Blood Bank</Label>
            <p className="text-sm text-muted-foreground">
              Select a blood bank to create a camp. This is where your collected
              donations will transfer
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {selectedBloodBank ? "Selected" : "Select Blood Bank"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[700px]">
                <DialogTitle>Select Blood Banks</DialogTitle>
                <SelectBloodBanks
                  org_id={org_id}
                  selectedBloodBank={selectedBloodBank}
                  selectBloodBank={(id) => setSelectedBloodBank(id)}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <h1 className="flex items-center justify-center gap-3">
              <Loader className="animate-spin" />
              Creating...
            </h1>
          ) : (
            "Create Camp"
          )}
        </Button>
      </div>
    </form>
  );
}
