import { DonorRequestTable } from "@/app/donor/components/request-table";
import { createClient, getUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchRequestHistory } from "../actions";

export default async function DonorRequestHistory() {
  const requestsResult = await fetchRequestHistory();
  const requestsData = requestsResult?.data;
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Recent Blood Donation Requests
      </h2>
      <DonorRequestTable requests={requestsData ? requestsData : []} />
    </div>
  );
}
