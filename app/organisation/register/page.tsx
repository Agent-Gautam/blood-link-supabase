"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { RegisterOrganisation } from "./actions";
import { FormMessage, Message } from "@/components/form-message";
import { Coordinates } from "@/archives/v0-map/map-container";
import { Location } from "@/lib/types";
import GeoLocation from "@/components/location/geo-location-access";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import FileUpload from "@/components/file-upload";
import { uploadEntityImage } from "@/app/actions/bucket-actions/store";
import { getUser } from "@/utils/supabase/server";
const MapWithSearch = dynamic(
  () => import("@/components/location/map-with-search"),
  {
    ssr: false,
  }
);

export default function OrganisationRegistration(props: {
  searchParams: Promise<Message>;
}) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [location, setLocation] = useState<Location>();
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      setUser(user);
    }
    fetchUser();
  },[])
  const handleLocationChange = (
    newLocation: Location,
    newCoordinates: Coordinates
  ) => {
    if (newCoordinates.lat && newCoordinates.lng && newLocation.address) {
      setLocation(newLocation);
      setCoordinates(newCoordinates);
    }
  };

  const handleSubmit = async (formData: FormData) => {

    // Validate required fields
    const orgType = formData.get("orgType")?.toString();
    const name = formData.get("name")?.toString();
    const contactNumber = formData.get("contact_number")?.toString();
    const uniqueId = formData.get("unique_id")?.toString();

    // Validate location data
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

    // Validate other required fields
    if (!orgType) {
      toast.error("Please select an organisation type");
      return;
    }
    if (!name || name.trim().length < 3) {
      toast.error(
        "Please enter a valid organisation name (minimum 3 characters)"
      );
      return;
    }
    if (!contactNumber || !/^\+?\d{10,15}$/.test(contactNumber)) {
      toast.error("Please enter a valid contact number (10-15 digits)");
      return;
    }
    if (!uniqueId || uniqueId.trim().length < 3) {
      toast.error("Please enter a valid unique ID (minimum 3 characters)");
      return;
    }
    // uploading image to supabase storage
    if (file) {
      const fileRes = await uploadEntityImage(
        "organisation",user?.id,file )
    }

    // Append location data to formData
    formData.set("address", location.address);
    formData.set("city", location.city);
    formData.set("state", location.state);
    formData.set("country", location.country);
    formData.set("postalCode", location.postalCode || "");
    formData.set("lat", coordinates.lat.toString());
    formData.set("lng", coordinates.lng.toString());

    toast.loading("Registering...");
    const result = await RegisterOrganisation(formData);
    toast.dismiss();
    if (!result.success) {
      toast.error(`Registration failed: ${result.error}`);
      return;
    }
        toast.success(result.message || "Successfully registered as a donor");
        redirect("/organisation");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Organisation Registration</CardTitle>
            <CardDescription>
              Please provide your organisation information.
            </CardDescription>
          </CardHeader>
          <form action={handleSubmit}>
            <CardContent className="space-y-6">
              <FileUpload label="Your organisation Photo" accept="images/*" setFiles={setFile} files={file}  />
              {/* organisation type */}
              <div className="space-y-2">
                <label htmlFor="orgType" className="text-sm font-medium">
                  Organisation Type
                </label>
                <Select name="orgType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOOD_BANK">Blood Bank</SelectItem>
                    <SelectItem value="HOSPITAL">Hospital</SelectItem>
                    <SelectItem value="INSTITUTE">Institute</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* organisation name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Organisation Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your organisation name"
                  required
                />
              </div>
              {/* contact_number */}
              <div>
                <label htmlFor="contact_number" className="text-sm font-medium">
                  Contact Number
                </label>
                <Input
                  type="text"
                  name="contact_number"
                  id="contact_number"
                  placeholder="Enter your organisation contact number"
                  required
                />
              </div>
              {/* Unique id by which org is verified */}
              <div className="space-y-2">
                <label htmlFor="unique_id" className="text-sm font-medium">
                  Unique ID
                </label>
                <Input
                  type="text"
                  name="unique_id"
                  id="unique_id"
                  placeholder="Enter the unique ID for verification"
                  required
                />
              </div>
              {/* location */}
              <div className="space-y-2 flex flex-col gap-2">
                <label className="text-sm font-medium">Location*</label>
                {location?.address && (
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
                    <MapWithSearch
                      initialCoordinates={coordinates}
                      handleLocationChange={handleLocationChange}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {/* do you want to keep inventory checkbox */}
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="inventory_on"
                  id="inventory_on"
                  className="h-4 w-4"
                />
                <label htmlFor="inventory_on" className="text-sm font-medium">
                  Do you want to keep an inventory?
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton
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