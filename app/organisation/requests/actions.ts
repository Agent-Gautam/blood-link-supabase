"use server"

import { createClient } from "@/utils/supabase/server";

export default async function fetchBloodRequests(org_id: string, limit?: number) {
    console.log(org_id);
    const supabase = await createClient();
    const query = supabase
        .from("blood_requests")
        .select("*")
        .eq("organisation_id", org_id)
    if (limit) {
        query.limit(limit);
    }
    const { data, error } = await query;
    if (error) {
        console.log(`Error fetching blood requests: ${error.message}`);
        return {success: false, error}
    }
    return {success: true, data};
}