"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { ApiResponse, DonationCamp, DonorInfo } from "../types";

//camp creation action
export async function CreateCampAction(
  formData: FormData
): Promise<ApiResponse<any> | null> {
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
  const id = formData.get("id")?.toString();
  const bannerUrl = formData.get("banner_url")?.toString();
  console.log(formData);

  const { error } = await supabase.from("donation_camps").upsert({
    id: id,
    organisation_id: user.id,
    name: name,
    location: location,
    geo_points: `POINT(${longitude} ${latitude})`,
    start_date: startdate,
    end_date: endDate,
    blood_bank_id: bloodBankId,
    banner_url: bannerUrl,
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
export async function fetchCamp(
  camp_id: string,
  org_id: string
): Promise<ApiResponse<DonationCamp>> {
  if (!camp_id || !org_id) {
    console.log("camp_id and org_id are required");
    return { success: false, message: "camp_id and org_id are required" };
  }
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_donation_camp_with_latlon", {
    p_camp_id: camp_id,
    p_organisation_id: org_id,
  });

  if (error) {
    console.log(error.message);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function fetchAllCamps(
  filters = {},
  sort = "",
  search = ""
): Promise<ApiResponse<DonationCamp[]>> {
  const user = await getUser();
  if (!user || !user.id) {
    console.log("user is not authorized");
    return { success: false, message: "user is not authorized" };
  }
  const supabase = await createClient();

  let query = supabase
    .from("donation_camps")
    .select("*")
    .eq("organisation_id", user.id);

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    if (value && typeof value === "string" && value.trim()) {
      // Use ilike for location to allow partial matching
      if (key === "location") {
        query = query.ilike(key, `%${value}%`);
      } else {
        query = query.eq(key, value);
      }
    }
  }

  // Apply search
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  const [column, order] = sort ? sort.split("-") : ["start_date", "asc"];

  // Apply sorting
  if (column && order) {
    query = query.order(column as string, { ascending: order === "asc" });
  }

  const { data, error } = await query;

  if (error) {
    console.log(error.message);
    return { success: false, error };
  }

  return { success: true, data };
}

type CampData = {
  camp: DonationCamp;
  registrations: number | null;
  donations: any[];
  donors: any[];
};

export async function fetchCampData(
  campId: string
): Promise<ApiResponse<CampData>> {
  const supabase = await createClient();

  // Fetch camp details
  const { data: camp, error: campError } = await supabase
    .from("donation_camps")
    .select("*")
    .eq("id", campId)
    .single();

  if (campError || !camp) {
    return { success: false, error: "Camp not found" };
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
      .select(
        "id, blood_type, donation_date, units_donated, donor:donors(id, date_of_birth,blood_type, gender, user:users(first_name, last_name) )"
      )
      .eq("donation_camp_id", campId),
  ]);
  console.log(regError, donError);

  if (regError || donError) {
    return { success: false, error: "Error fetching data" };
  }
  const donors = donations.map((don) => ({
    ...don.donor,
    donation_date: don.donation_date,
  }));

  return {
    success: true,
    data: { camp: camp as DonationCamp, registrations, donations, donors },
  };
}

//donor related actions
type DonorSearchResult = {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  blood_type: string;
  email: string;
  phone_number: string;
  last_donation_date: string | null;
  is_eligible: boolean;
  health_conditions: string | null;
};

export async function searchDonor(
  formData: FormData
): Promise<ApiResponse<DonorSearchResult>> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!email && !phone) {
    return {
      success: false,
      error: "Please provide either email or phone number",
    };
  }

  let query = supabase.from("users").select("*, donors(*)").eq("role", "DONOR");

  if (email) {
    query = query.eq("email", email);
  } else if (phone) {
    query = query.eq("phone_number", phone);
  }

  const { data: users, error } = await query;

  if (error || !users || users.length === 0) {
    return { success: false, error: "Donor not found" };
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
    success: true,
    data: {
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

export async function registerDonor(
  formData: FormData
): Promise<ApiResponse<DonorSearchResult>> {
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
    return {
      success: false,
      error: `Failed to create user ${userError?.message}`,
    };
  }

  const donorData = {
    id: user.id,
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
    return {
      success: false,
      error: `Failed to create donor ${donorError?.message}`,
    };
  }

  const today = new Date();
  const dob = new Date(donor.date_of_birth);
  const age = today.getFullYear() - dob.getFullYear();

  return {
    success: true,
    data: {
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

export async function addDonation(
  formData: FormData
): Promise<ApiResponse<void>> {
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
    return { success: false, error: "Failed to add donation" };
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
