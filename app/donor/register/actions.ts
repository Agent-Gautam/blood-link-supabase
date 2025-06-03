"use server";

import { createClient, getUser } from "@/utils/supabase/server";


export async function RegisterDonor(formdata: FormData) {
    const supabase = await createClient();
    const user = await getUser();
    const userId = user?.id;
    const bloodtype = formdata.get("bloodType")?.toString();
    const dateOfBirth = formdata.get("dateOfBirth")?.toString();
    const gender = formdata.get("gender")?.toString();
    const anonymous = formdata.get("anonymous")?.toString() === "on" ? true : false;
    const healthConditions = formdata.get("healthConditions")?.toString();
    const address = formdata.get("address")?.toString();
    const city = formdata.get("city")?.toString();
    const state = formdata.get("state")?.toString();
    const country = formdata.get("country")?.toString();
    const postcode = formdata.get("postcode")?.toString();
    const latitude = formdata.get("lat")?.toString();
    const longitude = formdata.get("lng")?.toString();
    
    const { data, error } = await supabase.from("donors").insert({
        blood_type: bloodtype,
        date_of_birth: dateOfBirth,
        gender: gender,
        user_id: userId,
        is_anonymous: anonymous,
        health_conditions: healthConditions,
        address: address,
        city: city,
        state: state,
        country: country,
        postcode: postcode,
        location: `POINT(${longitude} ${latitude})`
    });
    if (error) {
        console.error(error.message);
        return {success: false, error: error.message};
    }
    return { success: true, data, message: "Successfully registered as a donor" };
}