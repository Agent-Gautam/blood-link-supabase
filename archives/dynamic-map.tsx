"use client"

import { useEffect, ReactNode } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";


const { MapContainer } = ReactLeaflet;

type MapProps = {
  children: (reactLeaflet: typeof ReactLeaflet, leaflet: typeof Leaflet) => ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  [key: string]: any;
};

const Map = ({ children, className, width, height, ...rest }: MapProps) => {
    let mapClassName;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    (async function init() {
      delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer className={`size-full ${mapClassName}`} {...rest}>
      {children(ReactLeaflet, Leaflet)}
    </MapContainer>
  );
};

export default Map;
