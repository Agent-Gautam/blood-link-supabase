export enum UserRole {
  DONOR = "DONOR",
  ORGANISATION = "ORGANISATION",
  ADMIN = "ADMIN",
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface MarkerData {
  coordinates: Coordinates;
  details: Location;
}
