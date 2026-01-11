"use client";

import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();
var callback: ((data: any) => void) | undefined;
const PlaceSearchPlugin = ({ map }: { map: any }) => {
  const placeSearchRef = useRef(null);

  useEffect(() => {
    if (map && placeSearchRef.current) {
      mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
    }
    var optional_config = {
      location: [28.61, 77.23],
      region: "IND",
      height: 300,
    };
    placeSearchRef.current = mapplsPluginObject.search(
      document.getElementById("auto"),
      optional_config,
      callback
    );
    callback = (data) => {
      console.log(data); /* get search data in console */
    };

    return () => {
      if (map && placeSearchRef.current) {
        mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
      }
    };
  }, [map]);
};

const OriginalMap = () => {
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const auto = {
    width: "300px",
    position: "absolute",
    zIndex: 999,
    fontSize: "15px",
    padding: "10px",
    border: "1px solid #ddd",
    outline: "none !important",
  };

  const loadObject = { map: true, plugins: ["search"] };

  useEffect(() => {
    mapplsClassObject.initialize(
      "eff37ce3b1e2a0e3a46b9706a31b4b6b",
      loadObject,
      () => {
        const newMap = mapplsClassObject.Map({
          id: "map",
          properties: {
            center: [28.633, 77.2194],
            zoom: 4,
          },
        });

        newMap.on("load", () => {
          setIsMapLoaded(true);
        });

        mapRef.current = newMap;
      }
    );
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
    >
      <input
        style={auto}
        type="text"
        id="auto"
        name="auto"
        className="search-outer form-control as-input"
        placeholder="Search places or eLoc's..."
        required=""
        spellCheck="false"
      />

      {isMapLoaded && <PlaceSearchPlugin map={mapRef.current} />}
    </div>
  );
};

export default OriginalMap;
