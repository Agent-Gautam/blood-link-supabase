"use server";

import { createClient } from "@/utils/supabase/server";
import { ApiResponse, BloodRequest } from "../types";

export default async function fetchBloodRequests(
  org_id: string,
  limit?: number
): Promise<ApiResponse<BloodRequest[]>> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("blood_requests")
      .select(
        `
        *,
        donors (
          id,
          users (
            first_name,
            last_name
          )
        )
      `
      )
      .eq("organisation_id", org_id)
      .order("request_date", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching blood requests: ${error.message}`);
      return { success: false, error: error.message };
    }

    // Map the data to include donor_name
    const mappedData: BloodRequest[] = (data || []).map((request: any) => {
      const donorName =
        request.donors?.users?.first_name && request.donors?.users?.last_name
          ? `${request.donors.users.first_name} ${request.donors.users.last_name}`
          : "Unknown Donor";

      return {
        ...request,
        donor_name: donorName,
      };
    });

    return { success: true, data: mappedData };
  } catch (error: any) {
    console.error("Error fetching blood requests:", error);
    return { success: false, error: error.message };
  }
}
