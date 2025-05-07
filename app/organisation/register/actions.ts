"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

export async function RegisterOrganisation(formdata: FormData) {
    const supabase = await createClient();
    const user = await getUser();
    const userId = user?.id;
    const orgType = formdata.get("orgType")?.toString();
    const name = formdata.get("name")?.toString();
    const address = formdata.get("address")?.toString();
    const city = formdata.get("city")?.toString();
    const state = formdata.get("state")?.toString();
    const country = formdata.get("country")?.toString();
    const contactNumber = formdata.get("contact_number")?.toString();
    const uniqueId = formdata.get("unique_id")?.toString();
    const inventoryOn = formdata.get("inventory_on") ? true : false;
    const { data, error } = await supabase.from("organisations").insert({
        type: orgType,
        name: name,
        address: address,
        city: city,
        state: state,
        country: country,
        contact_number: contactNumber,
        user_id: userId,
        inventoryOn: inventoryOn,
        uniqueId: uniqueId
    });
    if (error) {
        console.error(error.message);
        return encodedRedirect("error", "/register/organisation", error.message);
    }
    console.log("User registered successfully", data);
    redirect("/organisation");
}