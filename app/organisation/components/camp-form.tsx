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
import { useEffect, useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { Coordinates, Location } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GeoLocation from "@/components/location/geo-location-access";
import { randomUUID } from "crypto";
import { uploadEntityImage } from "@/app/actions/bucket-actions/store";
import React from "react";
import FileUpload from "@/components/file-upload";
import generateUUID from "@/app/actions/get-uuid";
const MapWithSearch = dynamic(
  () => import("@/components/location/map-with-search"),
  {
    ssr: false,
  }
);

import { CampDetails, DonationCamp } from "../types";
import Image from "next/image";
import { redirect } from "next/navigation";

/**
 * Converts an ISO date string to datetime-local input format (YYYY-MM-DDTHH:mm)
 * @param isoString - ISO date string like "2025-12-07T10:00:00+00:00"
 * @returns Formatted string like "2025-12-07T10:00" or undefined if invalid
 */
function formatDateForInput(isoString: string | undefined): string | undefined {
  if (!isoString) return undefined;
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return undefined;

    // Get local date/time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return undefined;
  }
}

export default function CampForm({
  campData,
  inventoryOn,
  org_id,
}: {
  campData: DonationCamp | null;
  inventoryOn: boolean | null;
  org_id: string;
}) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [location, setLocation] = useState<Location>();
  const [selectedBloodBank, setSelectedBloodBank] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // useEffect to set selected blood bank, location, and coordinates from campData
  useEffect(() => {
    if (campData?.blood_bank_id) {
      setSelectedBloodBank(campData.blood_bank_id);
    }
    if (campData?.location) {
      setLocation(campData.location);
    }
    if (campData?.latitude && campData?.longitude) {
      setCoordinates({
        lat: campData.latitude,
        lng: campData.longitude,
      });
    }
  }, [campData]);

  const handleLocationChange = (
    newLocation: Location,
    newCoordinates: Coordinates
  ) => {
    if (newCoordinates.lat && newCoordinates.lng && newLocation) {
      setLocation(newLocation);
      setCoordinates(newCoordinates);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedBloodBank && !inventoryOn) {
      toast.error("Please select a blood bank");
      return;
    }
    if (!location || !coordinates) {
      toast.error("Please select a valid location from the map");
      return;
    }
    setLoading(true);
    toast.loading(campData?.id ? "Updating camp..." : "Creating camp...");
    // Use existing camp ID if editing, otherwise generate new one
    const campId = campData?.id || (await generateUUID());
    console.log("campId: ", campId);

    if (file) {
      // check file size < 1MB
      if (file.size > 1024 * 1024) {
        toast.error("File size must be less than 1MB");
        return;
      }
      const fileRes = await uploadEntityImage("camp", campId, file);
      console.log("fileRes: ", fileRes);
      if (fileRes.success && fileRes.data) {
        formData.set("banner_url", fileRes.data);
      } else {
        toast.error("Failed to upload banner: " + fileRes.error?.message);
      }
    }
    formData.set("id", campId);
    formData.set("latitude", coordinates?.lat.toString());
    formData.set("longitude", coordinates?.lng.toString());
    formData.set("location", location);
    const response = await CreateCampAction(formData);
    setLoading(false);
    toast.dismiss();
    if (response) {
      if (response.success) {
        toast.success(`Camp ${campData?.id ? "updated" : "created"} successfully`);
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
    <>
      <h1 className="text-2xl font-medium">Create Camp</h1>
      <div>
        {campData?.banner_url ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/camp-banner/${campData.banner_url}`}
            alt="camp banner"
            width={500}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <FileUpload
            files={file}
            setFiles={setFile}
            label="Uplaod donation camp banner"
            accept="images/*"
          />
        )}
      </div>
      <form className="flex flex-col max-w-[500px] mx-auto">
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
                    <span>{location || "—"}</span>
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
            defaultValue={formatDateForInput(campData?.start_date)}
            required
          />

          <Label htmlFor="end_date">End Date</Label>
          <Input
            name="end_date"
            type="datetime-local"
            defaultValue={formatDateForInput(campData?.end_date)}
            required
          />
          <Input
            name="blood_bank_id"
            type="hidden"
            value={inventoryOn ? org_id : (selectedBloodBank ?? "")}
            required
            readOnly
          />
          {!inventoryOn && (
            <>
              <Label htmlFor="blood_bank_id">Blood Bank</Label>
              <p className="text-sm text-muted-foreground">
                Select a blood bank to create a camp. This is where your
                collected donations will transfer
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
                <DialogContent className="w-full">
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
          <SubmitButton
            formAction={handleSubmit}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <h1 className="flex items-center justify-center gap-3">
                <Loader className="animate-spin" />
                Creating...
              </h1>
            ) : campData?.id ? (
              "Update Camp"
            ) : (
              "Create Camp"
            )}
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
