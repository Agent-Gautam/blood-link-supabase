"use server";

import { createClient } from "@/utils/supabase/server";
import { ApiResponse, InventorySummary, InventoryRecord, BloodType } from "../types";

export default async function fetchInventoryAction(org_id: string): Promise<ApiResponse<InventorySummary[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blood_inventory")
    .select("last_updated, blood_type, total_units")
    .eq("organisation_id", org_id);

  if (error) {
    console.log("Error fetching inventory", error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function fetchAllInventory(org_Id: string): Promise<ApiResponse<InventoryRecord[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blood_stocks")
    .select("*")
    .eq("organisation_id", org_Id);

  if (error) {
    console.log("Error fetching inventory", error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function updateInventoryRecord(
  stock_id: string,
  new_units?: number | null
): Promise<ApiResponse<any>> {
  if (!stock_id || new_units === null || new_units === undefined) {
    console.log("Invalid input: inv_id or new_units is null/undefined");
    return { success: false, error: "Invalid input" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blood_stocks")
    .update({ units: new_units })
    .eq("id", stock_id);

  if (error) {
    console.log("Error updating inventory record", error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function addNewInventoryRecord(
  org_id: string,
  type: BloodType,
  quantity: number,
  expiry_date: string
): Promise<ApiResponse<any>> {
  if (!org_id || !type || quantity <= 0 || !expiry_date) {
    console.log("Invalid input: Missing or invalid parameters");
    return { success: false, error: "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("blood_stocks").insert([
    {
      organisation_id: org_id,
      blood_type: type,
      units: quantity,
      expiry_date: expiry_date,
    },
  ]);

  if (error) {
    console.log("Error adding new inventory record", error);
    return { success: false, error };
  }
  return { success: true, data };
}
