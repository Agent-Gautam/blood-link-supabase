// Shared Types

// Blood Type
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// API Response Type
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: any;
  message?: string;
};

// Blood Request Types

export type BloodRequestStatus =
  | "PENDING"
  | "ACKNOWLEDGED"
  | "FULFILLED"
  | "CANCELLED";

export type BloodRequest = {
  id: string;
  donor_id: string;
  organisation_id: string;
  blood_type: string;
  units_needed: number;
  urgency: boolean;
  request_date: string;
  status: BloodRequestStatus;
  fulfilled_date: string | null;
  organisations?: { name: string };
  donor_name?: string;
};

// Donation Types

export type DonationStatus = "pending" | "completed" | "rejected";

export type Donation = {
  id: string;
  donor_id: string;
  organisation_id: string;
  donation_camp_id: string | null;
  blood_type: BloodType;
  units_donated: number;
  donation_date: string;
  status: DonationStatus;
  created_at: string;
};

// Donation Camp Types

export type CampStatus = "upcoming" | "ongoing" | "completed";

export type DonationCamp = {
  id: string;
  organisation_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  blood_bank_id: string | null;
  created_at: string;
  updated_at?: string;
  banner_url: string | null;
};

// Blood Bank Types

export type BloodBank = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contact_number: string;
  email?: string;
  created_at: string;
};

// Notification Types

export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  sent_at: string;
  is_read: boolean;
};

// Donor Details Types

export type DonorDetailsData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bloodType: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  isActive: boolean;
  lastDonationDate: string | null;
  isAnonymous: boolean;
  healthConditions: string | null;
  xp: number | null;
};
