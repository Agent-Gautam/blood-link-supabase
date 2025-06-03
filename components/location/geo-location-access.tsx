"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { CoordinatesToLocation } from "@/app/actions/map-actions/coordinates-to-location";
import { Coordinates, Location } from "@/lib/types";

type GeoLocationProps = {
  onLocationSet: (newLocation: Location, newCoordinates: Coordinates) => void;
};

export default function GeoLocation({ onLocationSet }: GeoLocationProps) {
  const [loading, setLoading] = useState(false);

  async function getCurrentLocation() {
    if (navigator.geolocation) {
        setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Reverse geocode to get location name
          const result = await CoordinatesToLocation(currentCoordinates);
          if (result.success && result.data) {
            const data = result.data.results[0];
            onLocationSet(
              {
                country: data.area,
                state: data.state,
                city: data.city || data.village || data.subDistrict,
                postalCode: data.pincode,
                address: data.formatted_address,
              },
              currentCoordinates
            );
              } else toast.error(`Error getting current address : ${result.error}`);
              setLoading(false);
        },
        () => {
          toast.error("Please enable geolocation to access your location");
        }
      );
    } else {
      toast.error("Error fetching current location");
    }
    
  }

  return (
    <Button type="button" disabled={loading} onClick={getCurrentLocation}>
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader className="animate-spin" />
          <h1>Getting current location ...</h1>
        </div>
      ) : (
        <h1>Get current Location</h1>
      )}
    </Button>
  );
}
