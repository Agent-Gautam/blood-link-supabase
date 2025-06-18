"use server"
import { createClient } from "@/utils/supabase/server"

 
type params = {
    type?: string,
    isVerified?: boolean,
}

export async function fetchOrganisations(params?: params) {
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
            return { success: false, error: error.message, data: null };
        }

        return { success: true, error: null, data };
    } catch (err: any) {
        return { success: false, error: err.message || "Unknown error", data: null };
    }
}

export async function verifyOrganisation(orgId: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("organisations")
            .update({ is_verified: true })
            .eq("id", orgId);
        if (error) {
            return { success: false, error: error.message, data: null };
        }
        return { success: true, error: null, data };
    } catch (error: any) {
        console.error("Error verifying organisation:", error);
        return { success: false, error: error.message || "Unknown error", data: null };
    }
}

export async function unverifyOrganisation(orgId: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("organisations")
            .update({ is_verified: false })
            .eq("id", orgId);
        if (error) {
            return { success: false, error: error.message, data: null };
        }
        return { success: true, error: null, data };
    } catch (error: any) {
        console.error("Error unverified organisation:", error);
        return { success: false, error: error.message || "Unknown error", data: null };
    }
}
