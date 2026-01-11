"use server";

import { createClient } from "@/utils/supabase/server";
import { ApiResponse } from "@/app/types";

export type CertificateData = {
  id: string;
  donation_date: string;
  units_donated: number;
  organisation_id: string;
  organisation_name: string;
  organisation_logo_url: string | null;
  donation_camp_id: string | null;
  camp_name: string | null;
  camp_location: string | null;
  donor_name: string;
  donor_email: string;
};

export async function fetchCertificates(
  donorId: string
): Promise<ApiResponse<CertificateData[]>> {
  try {
    const supabase = await createClient();

    // Fetch donations with related data
    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select(
        `
        id,
        donation_date,
        units_donated,
        organisation_id,
        donation_camp_id,
        organisations!donations_organisation_id_fkey (
          name
        ),
        donation_camps!fk_donations_camp (
          name,
          location
        )
      `
      )
      .eq("donor_id", donorId)
      .in("status", ["completed", "Completed"])
      .order("donation_date", { ascending: false });

    if (donationsError) {
      console.error("Error fetching donations:", donationsError);
      return { success: false, error: donationsError.message };
    }

    // Fetch donor information
    const { data: donor, error: donorError } = await supabase
      .from("donors")
      .select("id")
      .eq("id", donorId)
      .single();

    if (donorError) {
      console.error("Error fetching donor:", donorError);
      return { success: false, error: donorError.message };
    }

    // Fetch user information for donor name
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      console.error("Error fetching user:", userError);
      return { success: false, error: "User not authenticated" };
    }

    const donorName =
      (user.user.user_metadata.firstName ||
        user.user.user_metadata.first_name ||
        "") +
      " " +
      (user.user.user_metadata.lastName ||
        user.user.user_metadata.last_name ||
        "");
    const donorEmail = user.user.email || "";

    // Map donations to certificate data
    const certificates: CertificateData[] =
      donations?.map((donation: any) => ({
        id: donation.id,
        donation_date: donation.donation_date,
        units_donated: donation.units_donated,
        organisation_id: donation.organisation_id,
        organisation_name:
          donation.organisations?.name || "Unknown Organisation",
        organisation_logo_url: donation.organisations?.logo_url || null,
        donation_camp_id: donation.donation_camp_id,
        camp_name: donation.donation_camps?.name || null,
        camp_location: donation.donation_camps?.location || null,
        donor_name: donorName.trim() || "Donor",
        donor_email: donorEmail,
      })) || [];

    return { success: true, data: certificates };
  } catch (error: any) {
    console.error("Error fetching certificates:", error);
    return { success: false, error: error.message };
  }
}
