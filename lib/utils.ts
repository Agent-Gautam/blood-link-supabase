import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: string) {
  const [datePart, timePartWithZone] = timestamp.split("T");
  const [timePart, zone] = timePartWithZone
    .split(/([+-]\d{2}:\d{2})/)
    .filter(Boolean);

  return {
    date: datePart,
    time: timePart.split(".")[0], // removes milliseconds
    zone: zone,
  };
}
