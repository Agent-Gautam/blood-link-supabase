"use server";
import { createClient, getUser } from "@/utils/supabase/server";

export async function fetchDonationCamps(
  filters = {},
  sort = { column: "start_date", order: "asc" },
  search = ""
) {
  const supabase = await createClient();

  let query = supabase.from("donation_camps").select(
    `
            id,
            name,
            location,
            start_date,
            end_date,
            organisations!donation_camps_organisation_id_fkey (name)
        `
  );

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  // Apply search
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // Apply sorting
  if (sort && sort.column) {
    query = query.order(sort.column, { ascending: sort.order === "asc" });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching donation camps:", error);
    return [];
  }

  return data;
}

export async function registerForCamp(campId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const donorId = user.donor_id;
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

export async function fetchCampRegistrations() {
    const user = await getUser();
    const donorId = user?.donor_id;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("camp_registrations")
        .select("camp_id")
        .eq("donor_id", donorId);

  if (error) {
    console.log("Error checking registration:", error.message);
    return [];
    }
    const reg = data.map(item => item.camp_id);
  return reg;
}