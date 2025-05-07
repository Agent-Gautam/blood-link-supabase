import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { LatLng, LatLngLiteral, Map as MapType, icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist";
import { useState } from "react";

type MapLocation = LatLngLiteral & { id: string };

type MapProps = {
  center: LatLngLiteral;
  locations: MapLocation[];
  markers: LatLngLiteral[];
  onClick: (e: LatLngLiteral) => void;
  onMarkerClick: (e: LatLngLiteral) => void;
};

const SelectedLocation = ({center}: {center: LatLngLiteral}) => {
    const map = useMap();
    map.panTo(center, { animate: true });
    return null;
}

export default function Map({ center }: MapProps) {
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const renderMarks = (locations: MapLocation[]) => {
        return locations.map((location) => (
            <Marker
                key={location.id}
                position={location}
                icon={icon({
                    iconUrl: "/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                })}
                eventHandlers={{
                    click: () => {
                        setSelectedLocation(location);
                    },
                }}
            />
        ));
    };
  return (
    <div className="h-full w-full overflow-hidden border-spacing-5">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedLocation && SelectedLocation({center: selectedLocation})}
      </MapContainer>
    </div>
  );
}
