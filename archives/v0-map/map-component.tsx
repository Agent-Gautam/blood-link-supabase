"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates, MarkerData } from "@/lib/types";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  coordinates: Coordinates | null;
  onMapClick: (    newLocation: string,
    newCoordinates: Coordinates) => void;
  isZoomLocked: boolean;
  markers?: MarkerData[];
  selectedLocation?: string;
}

export default function MapComponent({
  coordinates,
  onMapClick,
  isZoomLocked,
  markers = [],
  selectedLocation,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );

  // Get user's current location
  useEffect(() => {
    if (coordinates) {
      setCurrentLocation(coordinates);
    } else {
      // Default to Delhi if geolocation is not supported
      setCurrentLocation({ lat: 28.6139, lng: 77.209 });
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !currentLocation) return;

    const map = L.map(mapContainerRef.current).setView(
      [currentLocation.lat, currentLocation.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Handle map clicks
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        const address =
          data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        onMapClick(address,{ lat, lng } );
      } catch (error) {
        console.error("Error reverse geocoding:", error);
        onMapClick(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, { lat, lng });
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [currentLocation, onMapClick]);

  // Handle zoom lock
  useEffect(() => {
    if (!mapRef.current) return;

    if (isZoomLocked) {
      mapRef.current.dragging.disable();
      mapRef.current.touchZoom.disable();
      mapRef.current.doubleClickZoom.disable();
      mapRef.current.scrollWheelZoom.disable();
      mapRef.current.boxZoom.disable();
      mapRef.current.keyboard.disable();
    } else {
      mapRef.current.dragging.enable();
      mapRef.current.touchZoom.enable();
      mapRef.current.doubleClickZoom.enable();
      mapRef.current.scrollWheelZoom.enable();
      mapRef.current.boxZoom.enable();
      mapRef.current.keyboard.enable();
    }
  }, [isZoomLocked]);

  // Handle coordinates change (from search or map click)
  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    // Remove existing current marker
    if (currentMarkerRef.current) {
      mapRef.current.removeLayer(currentMarkerRef.current);
    }

    // Add new marker
    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(
      mapRef.current
    );

    if (selectedLocation) {
      marker
        .bindPopup(
          `
        <div class="p-2">
          <h3 class="font-semibold text-sm mb-1">Selected Location</h3>
          <p class="text-xs text-gray-600">${selectedLocation}</p>
          <p class="text-xs text-gray-500 mt-1">
            ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}
          </p>
        </div>
      `
        )
        .openPopup();
    }

    currentMarkerRef.current = marker;

    // Center map on new coordinates
    
    mapRef.current.flyTo([coordinates.lat, coordinates.lng], 15);
  }, [coordinates, selectedLocation]);

  // Handle multiple markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = L.marker([
        markerData.coordinates.lat,
        markerData.coordinates.lng,
      ]).addTo(mapRef.current!);

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-base mb-2">${markerData.details.name}</h3>
          ${markerData.details.category ? `<p class="text-sm text-blue-600 mb-1">${markerData.details.category}</p>` : ""}
          ${markerData.details.rating ? `<p class="text-sm text-yellow-600 mb-2">★ ${markerData.details.rating}</p>` : ""}
          ${
            markerData.details.hours
              ? `
            <div class="mb-2">
              <p class="text-xs font-medium text-gray-700">Hours</p>
              <p class="text-xs text-gray-600">${markerData.details.hours}</p>
            </div>
          `
              : ""
          }
          ${
            markerData.details.address
              ? `
            <div class="mb-2">
              <p class="text-xs font-medium text-gray-700">Address</p>
              <p class="text-xs text-gray-600">${markerData.details.address}</p>
            </div>
          `
              : ""
          }
          ${
            markerData.details.phone
              ? `
            <div class="mb-2">
              <p class="text-xs font-medium text-gray-700">Phone</p>
              <p class="text-xs text-blue-600">${markerData.details.phone}</p>
            </div>
          `
              : ""
          }
          ${
            markerData.details.website
              ? `
            <div class="mb-2">
              <p class="text-xs font-medium text-gray-700">Website</p>
              <a href="${markerData.details.website}" target="_blank" class="text-xs text-blue-600 hover:underline">${markerData.details.website}</a>
            </div>
          `
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  }, [markers]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full z-40"
      style={{ minHeight: "400px" }}
    />
  );
}
