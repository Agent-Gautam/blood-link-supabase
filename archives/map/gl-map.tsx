"use client";

import { Map } from "@vis.gl/react-maplibre";

import GeocoderControl from "./geocoder-control";

export default function GlMap() {
  return (
    <div className="w-full h-[400px]">
      <Map
        initialViewState={{
          longitude: -79.4512,
          latitude: 43.6568,
          zoom: 13,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
      >
        <GeocoderControl position="top-left" />
      </Map>
    </div>
  );
}
