"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchOrganisationDetails(orgId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("organisations")
      .select("*, users(first_name, last_name, email)")
      .eq("id", orgId)
      .single();

    if (error && error.code === "PGRST116") {
      return { success: false, message: "Organization not found" };
    }
    if (error) {
      console.log("Error fetching organization details:", error);
      return { success: false, message: error.message };
    }
    const orgData = {
      id: data.id,
      name: data.name,
      email: data.users.email,
      adminFirstName: data.users.first_name,
      adminLastName: data.users.last_name,
      type: data.type,
      address: data.address,
      contactNumber: data.contact_number,
      createdAt: data.created_at,
      isVerified: data.is_verified,
      managesBloodInventory: data.inventory_on,
    };
    return { success: true, data: orgData };
  } catch (error: any) {
    console.log("Error fetching organization details:", error);
    return { success: false, message: error.message };
  }
}

export async function fetchDonorDetails(donorId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("donors")
      .select("*, users(first_name, last_name, email)")
      .eq("id", donorId)
      .single();
    if (error && error.code === "PGRST116") {
      return { success: false, message: "Donor not found" };
    }
    if (error) {
      console.log("Error fetching donor details:", error);
      return { success: false, message: error.message };
    }
    const donorData = {
      id: data.id,
      firstName: data.users.first_name,
      lastName: data.users.last_name,
      email: data.users.email,
      bloodType: data.blood_type,
      phoneNumber: data.phone_number,
      gender: data.gender,
      dateOfBirth: data.date_of_birth,
      address: data.address,
      createdAt: data.created_at,
      isActive: data.is_active,
      lastDonationDate: data.last_donation_date,
      isAnonymous: data.is_anonymous,
      healthConditions: data.health_conditions,
    };
    return { success: true, data: donorData };
  } catch (error: any) {
    console.log("Error fetching donor details:", error);
    return { success: false, message: error.message };
  }
}

export async function fetchCampDetails(campId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("donation_camps")
      .select(
        "*, organisations:organisation_id(id, name, type), blood_bank:blood_bank_id(name, location, contact_number)"
      )
      .eq("id", campId)
      .single();
    if (error && error.code === "PGRST116") {
      return { success: false, message: "Camp not found" };
    }
    if (error) {
      console.log("Error fetching camp details:", error);
      return { success: false, message: error.message };
    }
    const campData = {
      id: data.id,
      name: data.name,
      location: data.location,
      startDate: data.start_date,
      endDate: data.end_date,
      organization: {
        id: data.organisations.id,
        name: data.organisations.name,
        type: data.organisations.type,
      },
      bloodBank: {
        name: data.blood_bank?.name,
        location: data.blood_bank?.location,
        contactNumber: data.blood_bank?.contact_number,
      },
    };
    return { success: true, data: campData };
  } catch (error: any) {
    console.log("Error fetching camp details:", error);
    return { success: false, message: error.message };
  }
}
