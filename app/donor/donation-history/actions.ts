"use server";

import { createClient } from "@/utils/supabase/server";

export default async function fetchDonations(donorId: string, filters?: any) {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("donations")
      .select(
        `
      id,
    units_donated,
    donation_date,
    status,
    organisation_id,
    donation_camp_id,
    organisations!donations_organisation_id_fkey (name),
    donation_camps!fk_donations_camp(name,location)
    `
      )
      .eq("donor_id", donorId)
    .order("donation_date", { ascending: false });
    if (filters?.limit) {
      query.limit(filters.limit);
    }
    const { data, error } = await query;
    if(error) {
      console.error("Error fetching donations:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching donations:", error);
    return { success: false, message: error.message };
  }
}
