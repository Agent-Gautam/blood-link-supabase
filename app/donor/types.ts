// Donor Types

import { BloodType } from "@/app/types";

// Re-export shared types for convenience
export type { BloodType, ApiResponse, BloodRequest } from "@/app/types";

// Core Donor Types

export type Donor = {
  id: string;
  blood_type: BloodType;
  date_of_birth: string;
  gender: string;
  is_anonymous: boolean;
  health_conditions: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  last_donation_date: string | null;
  next_eligible_date: string | null;
  is_active: boolean;
  created_at: string;
  xp: number | null;
};

export type DonorWithUser = Donor & {
  users: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

// Donor Registration Form Data

export type DonorRegistrationData = {
  bloodType: string;
  dateOfBirth: string;
  gender: string;
  anonymous: boolean;
  healthConditions?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  lat: string;
  lng: string;
};

// Donation History Types

export type DonationHistoryItem = {
  id: string;
  donation_date: string;
  units_donated: number;
  status: string;
  organisation_id: string;
  donation_camp_id: string;
  donation_camps: { name: string; location: string } | null;
  organisations: { name: string } | null;
};

// Camp Card Types

export type DonationCampResult = {
  id: string;
  name: string | null;
  location: string | null;
  start_date: string;
  end_date: string;
  blood_bank_id: string | null;
  banner_url: string | null;
  distance_km: number;
};

export type DonationCampCard = {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  organisation_name: string;
};

// Blood Request Types (Donor Perspective)

export type BloodRequestFormData = {
  selectedOrganisations: string[];
  bloodType: string;
  unitsNeeded: string;
  urgent: boolean;
};

// Donor Stats Props

export type DonorStatsProps = {
  donationCounts: number;
  nextEligibleDate: string;
  lastDonationDate: string;
};

export type OrganisationsWithBlood = {
  organisation_id: string;
  name: string;
  type: string;
  is_verified: boolean;
  address: string;
  contact_number: string;
  blood_type: string;
  total_units: number;
  distance_km: number;
};

export type OrganisationFilter = {
  id: string;
  type: string;
  name: string;
  distance_metres: number;
};

// Certificate Types
export type CertificateData = {
  id: string;
  donation_date: string;
  units_donated: number;
  organisation_id: string;
  organisation_name: string;
  organisation_logo_url: string | null;
  donation_camp_id: string | null;
  camp_name: string | null;
  camp_location: string | null;
  donor_name: string;
  donor_email: string;
};
