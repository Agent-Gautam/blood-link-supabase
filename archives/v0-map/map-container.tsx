"use client";

import { useState } from "react";
import MapComponent from "./map-component";
import SearchComponent from "./search-component";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationDetails {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  rating?: string;
  category?: string;
}

export interface MarkerData {
  coordinates: Coordinates;
  details: LocationDetails;
}

export default function MapPage() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [location, setLocation] = useState<string>("");
  const [isZoomLocked, setIsZoomLocked] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Example of multiple markers - you can populate this from your data
  const [markers] = useState<MarkerData[]>([
    {
      coordinates: { lat: 28.6139, lng: 77.209 }, // Delhi
      details: {
        name: "India Gate",
        address: "Rajpath, India Gate, New Delhi, Delhi 110001",
        category: "Monument",
        rating: "4.5 (15,234 reviews)",
      },
    },
    {
      coordinates: { lat: 28.6562, lng: 77.241 },
      details: {
        name: "Red Fort",
        address:
          "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006",
        category: "Historical Site",
        rating: "4.3 (8,567 reviews)",
        hours: "9:30 AM - 4:30 PM",
      },
    },
  ]);

  const handleLocationSelect = (
    newLocation: string,
    newCoordinates: Coordinates
  ) => {
    setLocation(newLocation);
    setCoordinates(newCoordinates);
  };

  const handleMapClick = (newCoordinates: Coordinates, address: string) => {
    setCoordinates(newCoordinates);
    setLocation(address);
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            const address =
              data.display_name ||
              `${coordinates?.lat.toFixed(6)}, ${coordinates?.lng.toFixed(6)}`;

            setLocation(address);
          } catch (error) {
            toast.error(`Error reverse geocoding: ${error}`);
          }
        },
        (error) => {
          toast.error("Error getting your current location");
        }
      );
    } else {
      toast.message("Geolocation not enabled");
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2 bg-white shadow-sm border-b">
        <div className="max-w-md">
          <SearchComponent
            onLocationSelect={handleLocationSelect}
            currentLocation={location}
          />
        </div>
        <Button onClick={getCurrentLocation}>Use Current location</Button>
      </div>

      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogTrigger asChild>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded shadow"
            onClick={() => setShowMap(true)}
          >
            Show on map
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="absolute top-2 left-12 z-50 bg-white p-2 rounded-xl">
            <DialogTitle className="font-bold">Select on Map</DialogTitle>
            <DialogDescription>
              Click a place on map to select
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-full z-40">
            <MapComponent
              coordinates={coordinates}
              onMapClick={handleMapClick}
              isZoomLocked={isZoomLocked}
              markers={markers}
              selectedLocation={location}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
