"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export async function CampAction(formData: FormData) {
  const user = await getUser();
  if (!user) {
    console.log("not authorized");
    return null;
  }
  const supabase = await createClient();
  // name, location, latitude, longitude, startdate, enddate
  const name = formData.get("name")?.toString();
  const location = formData.get("location")?.toString();
  const longitude = formData.get("longitude")?.toString();
  const latitude = formData.get("latitude")?.toString();
  const startdate = formData.get("start_date")?.toString();
  const endDate = formData.get("end_date")?.toString();

  const { error } = await supabase.from("donation_camps").upsert({
    organisaton_id: user.organisation_id,
    name: name,
    location: location,
    latitude: latitude,
    longitude: longitude,
    start_date: startdate,
    end_date: endDate,
  });
    if (error) {
        console.error(error.message);
        return encodedRedirect("error", "/organisation/camp", error.message);
    }
}
