"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { ApiResponse } from "@/app/types";

export async function RegisterOrganisation(
  formdata: FormData
): Promise<ApiResponse<void>> {
  const supabase = await createClient();
  const user = await getUser();
  const userId = user?.id;
  const orgType = formdata.get("orgType")?.toString();
  const name = formdata.get("name")?.toString();
  const address = formdata.get("address")?.toString();
  const city = formdata.get("city")?.toString();
  const state = formdata.get("state")?.toString();
  const country = formdata.get("country")?.toString();
  const postcode = formdata.get("postcode")?.toString();
  const latitude = formdata.get("lat")?.toString();
  const longitude = formdata.get("lng")?.toString();
  const contactNumber = formdata.get("contact_number")?.toString();
  const uniqueId = formdata.get("unique_id")?.toString();
  const inventoryOn = formdata.get("inventory_on") ? true : false;

  const { data, error } = await supabase.from("organisations").insert({
    id: userId,
    type: orgType,
    name: name,
    address: address,
    city: city,
    state: state,
    country: country,
    postcode: postcode,
    geo_point: `POINT(${longitude} ${latitude})`,
    contact_number: contactNumber,
    inventory_on: inventoryOn,
    unique_id: uniqueId,
  });
  if (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
  console.log("User registered successfully", data);
  return {
    success: true,
    message: "Successfully registered as an organisation",
  };
}
