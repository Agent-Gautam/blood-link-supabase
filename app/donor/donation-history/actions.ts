"use server";

import { createClient } from "@/utils/supabase/server";
import { ApiResponse, Donation } from "@/app/types";

export default async function fetchDonations(
  donorId: string,
  filters?: any
): Promise<ApiResponse<Donation[]>> {
  try {
    const supabase = await createClient();
    const query = supabase
      .from("donations")
      .select(
        `
      id,
      donor_id,
      units_donated,
      donation_date,
      status,
      organisation_id,
      donation_camp_id,
      blood_type,
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
    if (error) {
      console.error("Error fetching donations:", error);
      return { success: false, error: error.message };
    }

    // Map the data to include nested relations while maintaining Donation type structure
    const mappedData = (data || []).map((item: any) => ({
      id: item.id,
      donor_id: item.donor_id,
      organisation_id: item.organisation_id,
      donation_camp_id: item.donation_camp_id,
      blood_type: item.blood_type,
      units_donated: item.units_donated,
      donation_date: item.donation_date,
      status: item.status,
      created_at: item.created_at,
      organisations: item.organisations,
      donation_camps: item.donation_camps,
    }));

    return { success: true, data: mappedData as any };
  } catch (error: any) {
    console.error("Error fetching donations:", error);
    return { success: false, error: error.message };
  }
}
