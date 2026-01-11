"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { ApiResponse } from "@/app/types";

export async function RegisterDonor(
  formdata: FormData
): Promise<ApiResponse<void>> {
  const supabase = await createClient();
  const user = await getUser();
  const userId = user?.id;
  const bloodtype = formdata.get("bloodType")?.toString();
  const dateOfBirth = formdata.get("dateOfBirth")?.toString();
  const gender = formdata.get("gender")?.toString();
  const anonymous =
    formdata.get("anonymous")?.toString() === "on" ? true : false;
  const healthConditions = formdata.get("healthConditions")?.toString();
  const address = formdata.get("address")?.toString();
  const city = formdata.get("city")?.toString();
  const state = formdata.get("state")?.toString();
  const country = formdata.get("country")?.toString();
  const postcode = formdata.get("postcode")?.toString();
  const latitude = formdata.get("lat")?.toString();
  const longitude = formdata.get("lng")?.toString();

  // Convert lat/lng to PostGIS POINT format (longitude first, then latitude)
  const geo_point =
    latitude && longitude ? `POINT(${longitude} ${latitude})` : null;

  const { data, error } = await supabase.from("donors").insert({
    id: userId,
    blood_type: bloodtype,
    date_of_birth: dateOfBirth,
    gender: gender,
    is_anonymous: anonymous,
    health_conditions: healthConditions,
    address: address,
    city: city,
    state: state,
    country: country,
    postcode: postcode,
    geo_point: geo_point,
  });
  if (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
  return { success: true, message: "Successfully registered as a donor" };
}
