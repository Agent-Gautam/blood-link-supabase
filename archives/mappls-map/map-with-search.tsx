"use client";

import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { CoordinatesToLocation } from "@/app/actions/map-actions/coordinates-to-location";
import { Coordinates } from "@/lib/types";

export const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

interface MapWithSearchProps {
  initialCoordinates?: Coordinates | null;
  handleLocationChange: (
    location: {
      city: string;
      state: string;
      country: string;
      address: string;
      postalCode: string;
    },
    coordinates: { lat: number; lng: number }
  ) => void;
}

const MapWithSearch = ({
  initialCoordinates,
  handleLocationChange,
}: MapWithSearchProps) => {
  const mapRef = useRef<ReturnType<typeof mapplsClassObject.Map> | null>(null);
  const placeSearchRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [marker, setMarker] = useState<any>(null);
  const [zoom, setZoom] = useState<number>(16);

  const loadObject = {
    map: true,
    version: "3.0",
    libraries: ["polydraw"],
    plugins: ["search"],
  };

  // Helper: fly to location
  const flyTo = (map: any, lat: number, lng: number) => {
    map.setView([lat, lng], 20, { animate: true });
  };

  // Helper: drop marker
  const dropMarker = (map: any, lat: number, lng: number) => {
    if (marker) marker.remove();
    const m = mapplsClassObject.Marker({
      map,
      position: { lat, lng },
      popupHtml: "Selected Location",
      popupOptions: { openPopup: true },
    });
    setMarker(m);
  };

  // Map initialization
  useEffect(() => {
    let mapInstance: any;
    try {
      mapplsClassObject.initialize(
        process.env.NEXT_PUBLIC_MAPPLS_API_KEY!,
        loadObject,
        () => {
          mapInstance = mapplsClassObject.Map({
            id: "map",
            properties: {
              center: initialCoordinates
                ? [initialCoordinates.lat, initialCoordinates.lng]
                : [28.6139, 77.209],
              zoom: zoom,
            },
          });
          mapRef.current = mapInstance;
          setIsMapLoaded(true);

          // Listen for zoom changes and update state
          mapInstance.on("zoomend", () => {
            setZoom(mapInstance.getZoom());
          });

          // Map click handler
          mapInstance.on("click", async (e: any) => {
            if (zoom < 20) {
              setMessage(
                "Zoom in to level 20 or higher to select a specific locality."
              );
              return;
            }
            const { lat, lng } = e.lngLat;
            try {
              const res = await CoordinatesToLocation({ lat, lng });
              const data = res.data;
              const dt = data?.results?.[0];
              if (!dt) {
                setMessage("Failed to fetch location details.");
                return;
              }
              dropMarker(mapInstance, lat, lng);
              handleLocationChange(
                {
                  city: dt.city || dt.village || dt.subDistrict,
                  state: dt.state,
                  country: dt.area,
                  address: dt.formatted_address,
                  postalCode: dt.pincode,
                },
                { lat, lng }
              );
              setMessage("");
            } catch (err) {
              setMessage("Failed to fetch location details.");
            }
          });
        }
      );
    } catch (error) {
      setMessage("Map initialization failed.");
      console.log(error);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
      if (marker) marker.remove();
    };
  }, []);

  // Search initialization
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    // Cleanup previous search layer
    if (placeSearchRef.current) {
      mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
    }

    // Search plugin configuration
    const optional_config = {
      location: initialCoordinates
        ? [initialCoordinates.lat, initialCoordinates.lng]
        : [28.61, 77.23],
      region: "IND",
      height: 300,
    };

    // Initialize search plugin
    placeSearchRef.current = mapplsPluginObject.search(
      document.getElementById("search"),
      optional_config,
      (data: any) => {
        if (data && data[0]) {
          const dt = data[0];
          if (dt.type !== "locality") {
            setMessage("Please select a locality (not a POI or address).");
            return;
          }
          flyTo(map, dt.latitude, dt.longitude);
          dropMarker(map, dt.latitude, dt.longitude);
          handleLocationChange(
            {
              city: dt.city || dt.placeName,
              state: dt.state,
              country: dt.country,
              address: dt.placeAddress,
              postalCode: dt.pincode,
            },
            { lat: dt.latitude, lng: dt.longitude }
          );
          setMessage("");
        }
      }
    );

    return () => {
      if (map && placeSearchRef.current) {
        mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
      }
    };
  }, [mapRef, isMapLoaded]);

  return (
    <div className="relative size-full">
      <div
        id="map"
        className="z-40"
        style={{ width: "100%", height: "100%", display: "inline-block" }}
      />
      {isMapLoaded && (
        <Input
          id="search"
          name="search"
          className="absolute top-2 left-2 z-50 w-[350px] search-outer form-control as-input"
          spellCheck={false}
          placeholder="Search for a locality..."
        />
      )}
      {message && (
        <div className="absolute top-2 right-2 z-50 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
    </div>
  );
};

export default MapWithSearch;
