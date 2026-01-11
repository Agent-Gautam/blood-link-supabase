"use server";

import { createClient } from "@/utils/supabase/server";
import {
  ApiResponse,
  OrganisationDetails,
  OrganisationStats,
  DonationCamp,
} from "./types";

/**
 * Fetch organisation details by user ID
 * @param userId - The user ID (which is the same as organisation ID)
 * @returns Organisation details or null if not found
 */
export async function fetchOrganisationByUserId(
  userId: string
): Promise<ApiResponse<OrganisationDetails>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organisations")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return {
        success: false,
        error: { code: "PGRST116", message: "Organisation not found" },
      };
    }
    console.error("Error fetching organisation:", error);
    return { success: false, error };
  }

  return { success: true, data: data as OrganisationDetails };
}

/**
 * Fetch organisation inventory status by user ID
 * @param userId - The user ID (which is the same as organisation ID)
 * @returns Inventory status (inventory_on) or null if not found
 */
export async function fetchOrganisationInventoryStatus(
  userId: string
): Promise<ApiResponse<{ inventory_on: boolean }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organisations")
    .select("inventory_on")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return {
        success: false,
        error: { code: "PGRST116", message: "Organisation not found" },
      };
    }
    console.error("Error fetching organisation inventory status:", error);
    return { success: false, error };
  }

  return { success: true, data: { inventory_on: data.inventory_on } };
}

/**
 * Fetch organisation statistics (donations, camps, unique donors)
 * @param org_id - The organisation ID
 * @returns Organisation statistics
 */
export async function fetchOrganisationStats(
  org_id: string
): Promise<ApiResponse<OrganisationStats>> {
  const supabase = await createClient();

  const [
    { count: totalDonations, error: donationsError },
    { count: totalDonationCamps, error: campsError },
    { data: uniqueDonors, error: donorsError },
  ] = await Promise.all([
    // Optimized: Use select with single column instead of * for count
    supabase
      .from("donations")
      .select("id", { count: "exact", head: true })
      .eq("organisation_id", org_id),
    // Already optimized: Using id column
    supabase
      .from("donation_camps")
      .select("id", { count: "exact", head: true })
      .eq("organisation_id", org_id),
    // Optimized: Fetch distinct donor_ids and count in application
    // This is more efficient than fetching all rows
    supabase
      .from("donations")
      .select("donor_id")
      .eq("organisation_id", org_id)
      .not("donor_id", "is", null),
  ]);

  if (donationsError) {
    console.error("Error fetching donations:", donationsError);
    return { success: false, error: donationsError };
  }

  if (campsError) {
    console.error("Error fetching donation camps:", campsError);
    return { success: false, error: campsError };
  }

  if (donorsError) {
    console.error("Error fetching unique donors:", donorsError);
    return { success: false, error: donorsError };
  }

  // Count unique donors from the fetched data
  const totalDonors = uniqueDonors
    ? new Set(uniqueDonors.map((d) => d.donor_id)).size
    : 0;

  return {
    success: true,
    data: {
      totalDonations: totalDonations || 0,
      totalDonationCamps: totalDonationCamps || 0,
      totalDonors,
    },
  };
}

/**
 * Fetch ongoing donation camps for an organisation
 * @param org_id - The organisation ID
 * @returns Array of ongoing donation camps
 */
export async function fetchOngoingCamps(
  org_id: string
): Promise<ApiResponse<DonationCamp[]>> {
  const supabase = await createClient();
  const currentDate = new Date().toISOString();

  const { data: ongoingCamps, error } = await supabase
    .from("donation_camps")
    .select("*")
    .eq("organisation_id", org_id)
    .lte("start_date", currentDate)
    .gte("end_date", currentDate);

  if (error) {
    console.error("Error fetching ongoing camps:", error);
    return { success: false, error };
  }

  return {
    success: true,
    data: (ongoingCamps || []) as DonationCamp[],
  };
}
