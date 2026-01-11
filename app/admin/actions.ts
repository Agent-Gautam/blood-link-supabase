"use server";
import { createClient } from "@/utils/supabase/server";
import { ApiResponse } from "@/app/types";

type params = {
  type?: string;
  isVerified?: boolean;
};

export async function fetchOrganisations(
  params?: params
): Promise<ApiResponse<any[]>> {
  try {
    const supabase = await createClient();
    let query = supabase.from("organisations").select("*");

    if (params?.type) {
      query = query.eq("type", params.type);
    }
    if (typeof params?.isVerified === "boolean") {
      query = query.eq("is_verified", params.isVerified);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

export async function verifyOrganisation(
  orgId: string
): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organisations")
      .update({ is_verified: true })
      .eq("id", orgId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("Error verifying organisation:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function unverifyOrganisation(
  orgId: string
): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organisations")
      .update({ is_verified: false })
      .eq("id", orgId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("Error unverified organisation:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}
