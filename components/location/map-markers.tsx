"use client";

import { Coordinates } from "@/lib/types";
import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

type markerData = {
  lat: number;
  lng: number;
};

type props = {
  userCoordinates: Coordinates | null;
  geoData: GeoFeatureCollection;
};

// Types for GeoJSON marker data
export type GeoFeature = {
  type: string;
  properties: {
    htmlPopup: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [lat, lng]
  };
};

export type GeoFeatureCollection = {
  type: string;
  features: GeoFeature[];
};

const MapMarkers = ({ userCoordinates, geoData }: props) => {
  const mapRef = useRef<ReturnType<typeof mapplsClassObject.Map> | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  console.log("user coordinates", userCoordinates);
  const loadObject = {
    map: true,
    version: "3.0", // // Optional, other version 3.5 also available with CSP headers
    plugins: ["direction"],
  };

  useEffect(() => {
    try {
      mapplsClassObject.initialize(
        process.env.NEXT_PUBLIC_MAPPLS_API_KEY,
        loadObject,
        () => {
          const newMap = mapplsClassObject.Map({
            id: "map",
            properties: {
              center: userCoordinates
                ? [userCoordinates.lat, userCoordinates.lng]
                : undefined,
              zoom: 18,
            },
          });

          newMap.on("load", () => {
            setIsMapLoaded(true);
            // Add markers from geoData
            if (geoData && geoData.features.length > 0) {
              mapplsClassObject.Marker({
                map: newMap,
                position: geoData,
                icon_url: "https://apis.mapmyindia.com/map_v3/1.png",
                clusters: true,
                fitbounds: true,
                fitboundOptions: { padding: 120, duration: 1000 },
                popupOptions: { offset: { bottom: [0, -20] } },
              });
            }
          });

          mapRef.current = newMap;
        }
      );
    } catch (error) {
      console.log(error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [userCoordinates, geoData]);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "99vh", display: "inline-block" }}
    />
  );
};

export default MapMarkers;
