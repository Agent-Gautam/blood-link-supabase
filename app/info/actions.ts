"use server";

import { createClient } from "@/utils/supabase/server";
import { ApiResponse, DonorDetailsData } from "@/app/types";

type OrganisationDetailsData = {
  id: string;
  name: string;
  email: string;
  adminFirstName: string;
  adminLastName: string;
  type: string;
  address: string;
  contactNumber: string;
  createdAt: string;
  isVerified: boolean;
  managesBloodInventory: boolean;
};

export async function fetchOrganisationDetails(
  orgId: string
): Promise<ApiResponse<OrganisationDetailsData>> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("organisations")
      .select("*, users(first_name, last_name, email)")
      .eq("id", orgId)
      .single();

    if (error && error.code === "PGRST116") {
      return { success: false, error: "Organization not found" };
    }
    if (error) {
      console.log("Error fetching organization details:", error);
      return { success: false, error: error.message };
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
    return { success: false, error: error.message };
  }
}

export async function fetchDonorDetails(
  donorId: string
): Promise<ApiResponse<DonorDetailsData>> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("donors")
      .select("*, users(first_name, last_name, email)")
      .eq("id", donorId)
      .single();
    if (error && error.code === "PGRST116") {
      return { success: false, error: "Donor not found" };
    }
    if (error) {
      console.log("Error fetching donor details:", error);
      return { success: false, error: error.message };
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
      xp: data.xp,
    };
    return { success: true, data: donorData };
  } catch (error: any) {
    console.log("Error fetching donor details:", error);
    return { success: false, error: error.message };
  }
}

type CampDetailsData = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  bannerUrl: string | null;
  organization: {
    id: string;
    name: string;
    type: string;
    address: string;
    contactNumber: string;
  };
  bloodBank: {
    id: string | null;
    name: string | null;
    contactNumber: string | null;
    address: string | null;
  };
};

export async function fetchCampDetails(
  campId: string
): Promise<ApiResponse<CampDetailsData>> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("donation_camps_with_details")
      .select("*")
      .eq("id", campId)
      .single();
    if (error && error.code === "PGRST116") {
      return { success: false, error: "Camp not found" };
    }
    if (error) {
      console.log("Error fetching camp details:", error);
      return { success: false, error: error.message };
    }

    const campData = {
      id: data.id,
      name: data.name,
      location: data.location,
      startDate: data.start_date,
      endDate: data.end_date,
      latitude: data.latitude,
      longitude: data.longitude,
      bannerUrl: data.banner_url,
      organization: {
        id: data.organisation_id,
        name: data.organisation_name,
        type: data.organisation_type,
        address: data.organisation_address,
        contactNumber: data.organisation_contact_number,
      },
      bloodBank: {
        id: data.blood_bank_id,
        name: data.blood_bank_name,
        contactNumber: data.blood_bank_contact_number,
        address: data.blood_bank_address,
      },
    };
    return { success: true, data: campData };
  } catch (error: any) {
    console.log("Error fetching camp details:", error);
    return { success: false, error: error.message };
  }
}
