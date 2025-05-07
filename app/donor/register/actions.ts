"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";


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
    const country = formdata.get("country")?.toString();
    
    const { data, error } = await supabase.from("donors").insert({
        blood_type: bloodtype,
        date_of_birth: dateOfBirth,
        gender: gender,
        user_id: userId,
        is_anonymous: anonymous,
        health_conditions: healthConditions,
        address: address,
        city: city,
        country: country,
    });
    if (error) {
        console.error(error.message);
        return encodedRedirect("error", "/register/donor", error.message);
    }
    console.log("User registered successfully", data);
    redirect("/donor");
}