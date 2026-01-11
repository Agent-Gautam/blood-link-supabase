"use server";
import { createClient, getUser } from "@/utils/supabase/server";
import { ApiResponse } from "@/app/types";
import { DonationCampResult, OrganisationFilter } from "../types";

export async function fetchDonationCamps(
  sort = "start_date-asc",
  search: string | null = null,
  orgIds: string | null = null,
  limit: number = 10,
  offset: number = 0,
  lat: number | null = null,
  lng: number | null = null
): Promise<ApiResponse<DonationCampResult[]>> {
  const user = await getUser();
  const donorId = user?.id;

  // If lat/lng provided, use geolocation; otherwise use donor_id
  const useGeolocation = lat !== null && lng !== null;

  if (!useGeolocation && !donorId) {
    return { success: false, error: "User not authenticated" };
  }

  const supabase = await createClient();
  // Handle orgIds: if null or empty string, pass null to fetch all camps
  const orgIdsArray =
    orgIds && orgIds.trim() ? orgIds.split(",").filter(Boolean) : null;
  // Handle search: if null or empty string, pass null to fetch all camps
  const searchQuery = search && search.trim() ? search : null;
  const [column, order] = sort.split("-");

  const query: any = {
    p_limit: limit,
    p_offset: offset,
    p_search: searchQuery,
    p_org_ids: orgIdsArray,
    p_sort_by: column, // or 'start_date' / 'end_date'
    p_order: order, // 'asc' / 'desc'
  };

  // Use geolocation if provided, otherwise use donor_id
  if (useGeolocation) {
    query.p_lat = lat;
    query.p_lng = lng;
  } else {
    query.p_donor_id = donorId;
  }

  const { data, error } = await supabase.rpc(
    "get_nearby_donation_camps",
    query
  );
  if (error) {
    console.error("Error fetching donation camps:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data: data as DonationCampResult[] };
}

export async function registerForCamp(
  campId: string
): Promise<ApiResponse<void>> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }
  const donorId = user.id;
  const supabase = await createClient();
  const { error } = await supabase
    .from("camp_registrations")
    .insert([{ donor_id: donorId, camp_id: campId }]);

  if (error) {
    console.error("Error registering for camp:", error);
    return { success: false, error: error.message };
  }
  return { success: true, message: "Successfully registered for the camp." };
}

export async function checkCampRegistration(
  campId: string
): Promise<ApiResponse<boolean>> {
  const user = await getUser();
  const donorId = user?.id;
  if (!donorId) {
    return { success: false, error: "User not authenticated" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("camp_registrations")
    .select("id")
    .eq("donor_id", donorId)
    .eq("camp_id", campId)
    .maybeSingle();

  if (error) {
    console.error("Error checking registration:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data: !!data };
}

export async function fetchOrganisationsForFilters(
  limit: number = 50
): Promise<ApiResponse<OrganisationFilter[]>> {
  const user = await getUser();
  const donorId = user?.id;
  if (!donorId) {
    return { success: false, error: "User not authenticated" };
  }
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_nearby_organisations", {
    p_donor_id: donorId,
    p_limit: limit,
  });

  if (error) {
    console.error("Error fetching organisations for filters:", error);
    return { success: false, error: error.message };
  }

  // Map the SQL function result to OrganisationFilter type
  // SQL returns distance_meters, but type expects distance_metres
  const mappedData: OrganisationFilter[] = (data || []).map((org: any) => ({
    id: org.organisation_id,
    type: org.type,
    name: org.name,
    distance_metres: org.distance_meters || 0,
  }));

  return { success: true, data: mappedData };
}
