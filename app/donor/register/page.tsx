"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { RegisterDonor } from "./actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import GeoLocation from "@/components/location/geo-location-access";
import { Coordinates, Location } from "@/lib/types";
// import MapWithSearch from "@/components/location/map-with-search";
// import OriginalMap from "@/components/location/original-code";
import dynamic from "next/dynamic";
import { getUser } from "@/utils/supabase/server";
import { uploadEntityImage } from "@/app/actions/bucket-actions/store";
import React from "react";
import FileUpload from "@/components/file-upload";
const MapComponent = dynamic(
  () => import("@/components/location/map-with-search"),
  {
    ssr: false,
  }
);

export default function DonorRegistration() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [location, setLocation] = useState<Location>();
  const [showMap, setShowMap] = useState(false);
    const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState();

    useEffect(() => {
      async function fetchUser() {
        const user = await getUser();
        setUser(user);
      }
      fetchUser();
    },[])

  const handleSubmit = async (formData: FormData) => {
    // Client-side validation
    const bloodType = formData.get("bloodType")?.toString();
    const dateOfBirth = formData.get("dateOfBirth")?.toString();
    const gender = formData.get("gender")?.toString();

    // Validate required fields
    if (!bloodType) {
      toast.error("Blood type is required");
      return;
    }
    if (!dateOfBirth) {
      toast.error("Date of birth is required");
      return;
    }
    if (!gender) {
      toast.error("Gender is required");
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

        // uploading image to supabase storage
    if (file) {
      const fileRes = await uploadEntityImage(
        "donor",user?.id,file )
    }

    // Append location fields to FormData
    formData.set("address", location.address);
    formData.set("city", location.city);
    formData.set("state", location.state);
    formData.set("postcode", location.postalCode);
    formData.set("country", location.country);
    formData.set("lat", coordinates.lat.toString());
    formData.set("lng", coordinates.lng.toString());

    // Call server action
    toast.loading("Registering...");
    const result = await RegisterDonor(formData);
    toast.dismiss();

    if (!result.success) {
      toast.error(`Registration failed: ${result.error}`);
      return;
    }

    toast.success(result.message || "Successfully registered as a donor");
    redirect("/donor");
  };

  const handleLocationChange = (
    newLocation: Location,
    newCoordinates: Coordinates
  ) => {
    if (newCoordinates.lat && newCoordinates.lng && newLocation.address) {
      setLocation(newLocation);
      setCoordinates(newCoordinates);
    }
  };
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Donor Registration</CardTitle>
            <CardDescription>
              Please provide your blood donation information.
            </CardDescription>
          </CardHeader>
          <form action={handleSubmit}>
            <CardContent className="space-y-6">
              <FileUpload
                label="Your profile Photo"
                accept="images/*"
                setFiles={setFile}
                files={file}
              />
              {/* Blood Type */}
              <div className="space-y-2">
                <label htmlFor="bloodType" className="text-sm font-medium">
                  Blood Type*
                </label>
                <Select name="bloodType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of Birth*
                </label>
                <Input name="dateOfBirth" type="date" required />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender*
                </label>
                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Fields */}
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
                <Dialog open={showMap} onOpenChange={setShowMap}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="mt-2 bg-blue-600 text-white"
                    >
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
                    <MapComponent
                      initialCoordinates={coordinates}
                      handleLocationChange={handleLocationChange}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center space-x-2">
                <Input name="anonymous" type="checkbox" className="h-4 w-4" />
                <label htmlFor="anonymous" className="text-sm font-medium">
                  Keep me anonymous
                </label>
              </div>

              {/* Health Conditions */}
              <div className="space-y-2">
                <label
                  htmlFor="healthConditions"
                  className="text-sm font-medium"
                >
                  Health Conditions
                </label>
                <Input
                  name="healthConditions"
                  placeholder="List any health conditions (if any)"
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton
                formAction={handleSubmit}
                pendingText="Registering..."
              >
                Register
              </SubmitButton>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
