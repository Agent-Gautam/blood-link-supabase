"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { revalidatePath } from "next/cache";

//camp creation action
export async function CreateCampAction(formData: FormData) {
  const user = await getUser();
  if (!user) {
    console.log("not authorized");
    return null;
  }
  const supabase = await createClient();
  // name, location, latitude, longitude, startdate, enddate
  const name = formData.get("name")?.toString();
  const location = formData.get("location")?.toString();
  const longitude = formData.get("longitude")?.toString();
  const latitude = formData.get("latitude")?.toString();
  const startdate = formData.get("start_date")?.toString();
  const endDate = formData.get("end_date")?.toString();
  const bloodBankId = formData.get("blood_bank_id")?.toString();
  console.log(formData);

  const { error } = await supabase.from("donation_camps").upsert({
    organisation_id: user.organisation_id,
    name: name,
    location: location,
    latitude: latitude,
    longitude: longitude,
    start_date: startdate,
    end_date: endDate,
    blood_bank_id: bloodBankId,
  });
  if (error) {
    console.error(error.message);
    return {
      success: false,
      error,
    };
  }
  return {
    success: true,
    message: "Camp created successfully",
  };
}

// fetch single camp by id
export async function fetchCamp(camp_id: string, org_id: string) {
  if (!camp_id || !org_id) {
    console.log("camp_id and org_id are required");
    return { success: false, message: "camp_id and org_id are required" };
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("donation_camps")
    .select("*")
    .eq("id", camp_id)
    .eq("organisation_id", org_id)
    .single();

  if (error) {
    console.log(error.message);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function fetchAllCamps(
  org_id: string,
  filters = {},
  sort = { column: "start_date", order: "asc" },
  search = ""
) {
  if (!org_id) {
    console.log("org_id is required");
    return { success: false, message: "org_id is required" };
  }
  const supabase = await createClient();

  let query = supabase
    .from("donation_camps")
    .select("*")
    .eq("organisation_id", org_id);

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
    console.log(error.message);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function fetchCampData(campId: string) {
  const supabase = await createClient();

  // Fetch camp details
  const { data: camp, error: campError } = await supabase
    .from("donation_camps")
    .select("*")
    .eq("id", campId)
    .single();

  if (campError || !camp) {
    return { error: "Camp not found" };
  }

  // Fetch registrations and donations in parallel
  const [
    { count: registrations, error: regError },
    { data: donations, error: donError },
  ] = await Promise.all([
    supabase
      .from("camp_registrations")
      .select("", { count: "exact", head: true })
      .eq("camp_id", campId),
    supabase
      .from("donations")
      .select("id, blood_type, donation_date, units_donated, donor:donors(id, date_of_birth, gender, user:users(first_name, last_name) )")
      .eq("donation_camp_id", campId),
  ]);
  console.log(regError, donError);

  if (regError || donError) {
    return { error: "Error fetching data" };
  }
  const donors = donations.map(don => ({...don.donor, donation_date: don.donation_date}));

  return { camp, registrations, donations, donors };
}

//donor related actions
export async function searchDonor(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!email && !phone) {
    return { error: "Please provide either email or phone number" };
  }

  let query = supabase.from("users").select("*, donors(*)").eq("role", "DONOR");

  if (email) {
    query = query.eq("email", email);
  } else if (phone) {
    query = query.eq("phone_number", phone);
  }

  const { data: users, error } = await query;

  if (error || !users || users.length === 0) {
    return { error: "Donor not found" };
  }

  const user = users[0];
  const donor = user.donors;
  const today = new Date();
  const dob = new Date(donor.date_of_birth);
  const age = today.getFullYear() - dob.getFullYear();
  const lastDonation = donor.last_donation_date
    ? new Date(donor.last_donation_date)
    : null;
  const eligible =
    !lastDonation ||
    (today.getTime() - lastDonation.getTime()) / (1000 * 3600 * 24) > 56;

  return {
    donor: {
      id: donor.id,
      first_name: user.first_name,
      last_name: user.last_name,
      age,
      gender: donor.gender,
      blood_type: donor.blood_type,
      email: user.email,
      phone_number: user.phone_number,
      last_donation_date: donor.last_donation_date,
      is_eligible: eligible,
      health_conditions: donor.health_conditions,
    },
  };
}

export async function registerDonor(formData: FormData) {
  const supabase = await createClient();

  const userData = {
    email: formData.get("email") as string,
    phone_number: formData.get("phone") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    role: "DONOR",
  };

  const { data: user, error: userError } = await supabase
    .from("users")
    .insert(userData)
    .select()
    .single();

  if (userError || !user) {
    return { error: `Failed to create user ${userError?.message}` };
  }

  const donorData = {
    user_id: user.id,
    blood_type: formData.get("blood_type") as string,
    date_of_birth: formData.get("date_of_birth") as string,
    gender: formData.get("gender") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    country: formData.get("country") as string,
    is_anonymous: false,
    created_at: new Date().toISOString(),
    is_active: true,
  };

  const { data: donor, error: donorError } = await supabase
    .from("donors")
    .insert(donorData)
    .select()
    .single();

  if (donorError || !donor) {
    await supabase.from("users").delete().eq("id", user.id);
    return { error: `Failed to create donor ${donorError?.message}` };
  }

  const today = new Date();
  const dob = new Date(donor.date_of_birth);
  const age = today.getFullYear() - dob.getFullYear();

  return {
    donor: {
      id: donor.id,
      first_name: user.first_name,
      last_name: user.last_name,
      age,
      gender: donor.gender,
      blood_type: donor.blood_type,
      email: user.email,
      phone_number: user.phone_number,
      last_donation_date: null,
      is_eligible: true,
      health_conditions: null,
    },
  };
}

export async function addDonation(formData: FormData) {
  const supabase = await createClient();
  const campId = formData.get("camp_id") as string;
  const donorId = formData.get("donor_id") as string;

  const donationData = {
    donor_id: donorId,
    donation_camp_id: campId,
    blood_type: formData.get("blood_type") as string,
    units_donated: 1,
    donation_date: new Date().toISOString(),
    status: "completed",
  };

  const { error } = await supabase.from("donations").insert(donationData);

  if (error) {
    return { error: "Failed to add donation" };
  }

  await supabase
    .from("donors")
    .update({
      last_donation_date: new Date().toISOString(),
      next_eligible_date: new Date(
        Date.now() + 56 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .eq("id", donorId);

  revalidatePath(`/camp/${campId}`);
  return { success: true };
}
