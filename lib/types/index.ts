export enum UserRole {
  DONOR = "DONOR",
  ORGANISATION = "ORGANISATION",
  ADMIN = "ADMIN",
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type Location = string;

export interface MarkerData {
  coordinates: Coordinates;
  details: Location;
}

export interface Organisation {
  id: string;
  name: string;
  type: string;
  address: string;
  created_at: string;
  unique_id: string;
  verified: boolean;
}
