"use server";

import { createClient } from "@/utils/supabase/server";
import { ApiResponse } from "../types";
import { Donor } from "./types";

export async function fetchDonor(
  donorId: string | undefined
): Promise<ApiResponse<Donor>> {
  if (!donorId) {
    return { success: false, error: "Donor ID is required" };
  }

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("donors")
      .select(
        `
        id,
        blood_type,
        date_of_birth,
        gender,
        is_anonymous,
        health_conditions,
        address,
        city,
        state,
        country,
        postcode,
        last_donation_date,
        next_eligible_date,
        is_active,
        created_at,
        xp
      `
      )
      .eq("id", donorId)
      .single();

    if (error && error.code === "PGRST116") {
      return { success: false, error: "Donor not found" };
    }
    if (error) {
      console.log("Error fetching donor:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Donor };
  } catch (error: any) {
    console.log("Error fetching donor:", error);
    return { success: false, error: error.message };
  }
}
