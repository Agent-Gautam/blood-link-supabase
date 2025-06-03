"use client";

import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { CoordinatesToLocation } from "@/app/actions/map-actions/coordinates-to-location";
import { Coordinates } from "@/lib/types";
import { toast, Toaster } from "sonner";

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

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

export default function MapWithSearch({
  initialCoordinates,
  handleLocationChange,
}: MapWithSearchProps) {
  const mapRef = useRef<ReturnType<typeof mapplsClassObject.Map> | null>(null);
  const placeSearchRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [marker, setMarker] = useState<any>(null);

  const dropMarker = async (e: any) => {
    console.log(e);
    if (e.target.getZoom() < 20) {
        setMessage("Zoom in to level 20 to get accurate results");
      toast.message(
        `Zoom in to level 20 to get accurate results`
      );
        return;
    }
    if (marker) marker.remove();
    const { lat, lng } = e.lngLat;
    const m = mapplsClassObject.Marker({
      map: mapRef.current,
      position: { lat, lng },
      popupHtml: `
              <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-family: Arial, sans-serif;">
                Loading ...
              </div>
            `,
      popupOptions: { openPopup: true },
    });
    setMarker(m);
    const res = await CoordinatesToLocation({ lat, lng });
    const data = res.data;
    const dt = data?.results?.[0];
    if (!dt) {
      setMessage("Failed to fetch location details.");
      return;
    }
    m.setPopup(
      `
              <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-family: Arial, sans-serif;">
                <h3 style="margin: 0; font-size: 14px; color: #333;">Selected Location</h3>
                <p style="margin: 5px 0 0; font-size: 12px; color: #666;">${dt.formatted_address}</p>
              </div>
            `,
      { openPopup: true }
    );

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
    console.log(e);
  };

  const loadObject = {
    map: true,
    version: "3.0",
    libraries: ["polydraw"],
    plugins: ["search"],
    fullscreenControl: false,
    clickableIcons: false,
  };

  useEffect(() => {
    try {
      mapplsClassObject.initialize(
        process.env.NEXT_PUBLIC_MAPPLS_API_KEY!,
        loadObject,
        () => {
          const newMap = mapplsClassObject.Map({
            id: "map",
            properties: {
              center: initialCoordinates
                ? [initialCoordinates.lat, initialCoordinates.lng]
                : [28.633, 77.2194],
            },
          });
          newMap.on("load", () => {
            setIsMapLoaded(true);
            if (newMap && placeSearchRef.current) {
              mapplsClassObject.removeLayer({
                map: newMap,
                layer: placeSearchRef.current,
              });
            }
            var optional_config = {
              region: "IND",
              height: 300,
              tokenizeAddress: true,
            };

            placeSearchRef.current = mapplsPluginObject.search(
              placeSearchRef.current,
              optional_config,
              (data: any) => {
                console.log(data);
                if (data.error) {
                  setMessage("Search not working");
                  return;
                }
                const eloc = data[0].eLoc;
                console.log(eloc);
                const location = data[0].placeName + data[0].placeAddress;
                console.log(
                  mapplsPluginObject.pinMarker({
                    map: newMap,
                    pin: eloc,
                    popupHtml: location,
                    icon: {url: "/place-search-icon.png", width: 40, height: 40},
                  },
                  (mark: any) => {
                    mark.fitbounds({ padding: 100 });
                  })
                );
                //  console.log(mark);
                // mark.fitbounds({ padding: 100 });
                // var options = {
                //   map: newMap,
                //   location: { lat: 28.8787, lng: 77.08888 },
                //   search: true,
                //   closeBtn: false,
                //   topText: "Select a location",

                // };
                // placeSearchRef.current = mapplsPluginObject.placePicker(
                //   options,
                // )
              }
            );
          });
          // Listen for zoom changes and update state
          newMap.on("click", dropMarker);

          mapRef.current = newMap;
        }
      );
    } catch (error) {
      setMessage("Map initialization failed.");
      console.log(error);
    }

    return () => {
      if (mapRef.current && placeSearchRef.current) {
        mapplsClassObject.removeLayer({
          map: mapRef.current,
          layer: placeSearchRef.current,
        });
      }
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);
  return (
    
    <div className="relative size-full">
      <div
        id="map"
        className="z-40"
        style={{ width: "100%", height: "100%", display: "inline-block" }}
      />
      <Input
        ref={placeSearchRef}
        id="search"
        name="search"
        className="absolute top-2 left-2 z-50 w-[350px] search-outer form-control as-input"
        spellCheck={false}
        placeholder="Search for a locality..."
      />
      {message && (
        <div className="absolute top-2 right-2 z-50 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
    </div>
  );
}
