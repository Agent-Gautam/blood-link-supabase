"use server"

import { Coordinates } from "@/lib/types";

export async function CoordinatesToLocation(coordinates: Coordinates) {
    try {
        const res = await fetch(
          `https://apis.mappls.com/advancedmaps/v1/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/rev_geocode?lat=${coordinates.lat}&lng=${coordinates.lng}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        // const data = {
        //   responseCode: 200,
        //   version: "281.240",
        //   results: [
        //     {
        //       houseNumber: "",
        //       houseName: "",
        //       poi: "",
        //       poi_dist: "",
        //       street: "Gaushala Road",
        //       street_dist: "56",
        //       subSubLocality: "",
        //       subLocality: "Katehra Chowk",
        //       locality: "Kataihra Bazar",
        //       village: "",
        //       district: "Kapurthala District",
        //       subDistrict: "Phagwara",
        //       city: "Phagwara",
        //       state: "Punjab",
        //       pincode: "144401",
        //       lat: "31.222952",
        //       lng: "75.770676",
        //       area: "India",
        //       isRooftop: false,
        //       formatted_address:
        //         "Gaushala Road, Katehra Chowk, Kataihra Bazar, Phagwara, Punjab. Pin-144401 (India)",
        //     },
        //   ],
        // };
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}