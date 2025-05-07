"use server";
import { createClient, getUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function fetchOrganisationsAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organisations").select("*, blood_inventory(blood_type, total_units)");
  if (error) {
    console.log("error fetching organisations", error);
    return null;
  }
  return data;
}

export async function submitRequestAction(formdata: {
  selectedOrganisations: string[];
  bloodType: string;
  unitsNeeded: string;
  urgent: boolean;
}) {
  const supabase = await createClient();
  const user = await getUser();
  if (!user || !user.donor_id) {
    console.log("Unauthorized, donor id not found");
    return { success: false, error: "User Not Authorized" };
  }
  // Prepare an array of request objects, one for each organisation
  const requests = formdata.selectedOrganisations.map((orgId) => ({
    donor_id: user.donor_id,
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
  return { success: true, data };
}

export async function fetchRequestHistory(limit?: number) {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
    return null;
  }

  const query = supabase
    .from("blood_requests")
    .select("*, organisations(name)")
    .eq("donor_id", user.donor_id);

  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error fetching request history", error);
    return { success: false, error };
  }

  return { success: true, data };
}
