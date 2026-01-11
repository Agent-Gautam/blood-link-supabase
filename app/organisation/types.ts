// Organisation Types

import { BloodType } from "@/app/types";

// Re-export shared types for convenience
export type {
  BloodType,
  ApiResponse,
  BloodRequest,
  BloodRequestStatus,
  DonationStatus,
  Donation,
  DonationCamp,
  CampStatus,
  BloodBank,
} from "@/app/types";

export type OrganisationDetails = {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  geo_point: string; // PostGIS POINT format
  contact_number: string;
  inventory_on: boolean;
  unique_id: string;
  created_at: string;
  updated_at?: string;
};

// Inventory Types

export type InventoryRecord = {
  id: string;
  organisation_id: string;
  blood_type: BloodType;
  units: number;
  added_at: string;
  last_updated: string;
  expiry_date: string;
};

export type InventorySummary = {
  blood_type: BloodType;
  total_units: number;
  last_updated: string;
};

export type InventoryStats = {
  blood_type: BloodType;
  total_units: number;
};

// Camp Form Details

export type CampDetails = {
  id?: string;
  name: string;
  location: string;
  longitude: string;
  latitude: number | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  blood_bank_id: string | undefined;
  organisation_id: string | undefined;
  banner_url: string | undefined;
};

// Organisation Stats Types

export type OrganisationStats = {
  totalDonations: number;
  totalDonationCamps: number;
  totalDonors: number;
};

// Donor Information (for organisation use)

export type DonorInfo = {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  blood_type: BloodType;
  email: string;
  phone_number: string;
  last_donation_date: string | null;
  is_eligible: boolean;
  health_conditions: string | null;
};

// Form Data Types

export type OrganisationRegistrationData = {
  orgType: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  latitude: string;
  longitude: string;
  contact_number: string;
  unique_id: string;
  inventory_on: boolean;
};

export type CampFormData = {
  id?: string;
  name: string;
  location: string;
  longitude: string;
  latitude: string;
  start_date: string;
  end_date: string;
  blood_bank_id?: string;
};
