"use client";

import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

type markerData = {
  lat: number,
  lng: number,
}

type props = {
  startMarkersData: markerData,
  endMarkersData: markerData,
}

const MapComponent = ({ startMarkersData, endMarkersData }: props) => {
  const mapRef = useRef<ReturnType<typeof mapplsClassObject.Map> | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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
              center: startMarkersData
                ? [startMarkersData.lat, startMarkersData.lng]
                : undefined,
              zoom: 18,
            },
          });

          newMap.on("load", () => {
            setIsMapLoaded(true);
          });
          mapplsPluginObject.direction({
            Resource: "route_eta",
            annotations: "nodes,congestion",
            map: newMap,
            start: `${startMarkersData.lat},${startMarkersData.lng}`,
            end: `${endMarkersData.lat},${endMarkersData.lng}`,
            search: false,
            collapse: true,
            connector: true,
            profile: "biking",
          }, (e: any) => e.collapse());
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
  }, []);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "99vh", display: "inline-block" }}
    />
  );
};

export default MapComponent;
