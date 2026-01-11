"use server";
import { createClient, getUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ApiResponse, BloodRequest } from "@/app/types";
import { OrganisationsWithBlood } from "../types";

export async function fetchOrganisationsAction(
  bloodType: string,
  unitsNeeded: number,
  cursor: number,
  rows: number
): Promise<ApiResponse<OrganisationsWithBlood[]>> {
  const user = await getUser();
  if (!user || !user.id) {
    console.log("Unauthorized, donor id not found");
    return { success: false, error: "User Not Authorized" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_organisations_with_blood", {
    requested_blood_type: bloodType,
    units_needed: unitsNeeded,
    donor_id: user.id,
    cursor: cursor,
    rows: rows,
  });
  if (error) {
    console.log("Error fetching organisations", error);
    return { success: false, error };
  }
  return { success: true, data: data as OrganisationsWithBlood[] };
}

export async function submitRequestAction(formdata: {
  selectedOrganisations: string[];
  bloodType: string;
  unitsNeeded: string;
  urgent: boolean;
}): Promise<ApiResponse<BloodRequest[]>> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user || !user.id) {
    console.log("Unauthorized, donor id not found");
    return { success: false, error: "User Not Authorized" };
  }
  // Prepare an array of request objects, one for each organisation
  const requests = formdata.selectedOrganisations.map((orgId) => ({
    donor_id: user.id,
    organisation_id: orgId,
    blood_type: formdata.bloodType,
    units_needed: Number(formdata.unitsNeeded),
    urgency: formdata.urgent,
    // Add other fields as needed, e.g. donor_id, request_date, etc.
  }));

  const { data, error } = await supabase
    .from("blood_requests")
    .insert(requests);

  if (error) {
    console.log("Error creating blood requests", error);
    return { success: false, error };
  }
  return { success: true, data: data ?? ([] as BloodRequest[]) };
}

export async function fetchRequestHistory(
  limit?: number
): Promise<ApiResponse<BloodRequest[]>> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
    return { success: false, error: "User not authenticated" };
  }

  const query = supabase
    .from("blood_requests")
    .select("*, organisations(name)")
    .eq("donor_id", user.id)
    .order("request_date", { ascending: false });

  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error fetching request history", error);
    return { success: false, error };
  }

  return { success: true, data: data as BloodRequest[] };
}
