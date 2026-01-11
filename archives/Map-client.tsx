"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import * as ReactLeaflet from "react-leaflet";
import Leaflet from "leaflet";

const DynamicMap = dynamic(() => import("./dynamic-map"), {
  ssr: false,
});

// Set default sizing to control aspect ratio which will scale responsively
// but also help avoid layout shift

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

type MapProps = {
  children: (reactLeaflet: typeof ReactLeaflet, leaflet: typeof Leaflet) => ReactNode;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: any;
};

const Map = (props: MapProps) => {
  const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
  return (
    <div style={{ aspectRatio: width / height }}>
      <DynamicMap {...props} />
    </div>
  );
};

export default Map;
