import { getUser } from "@/utils/supabase/server";
import fetchDonations from "./actions"
import ErrorComponent from "@/components/error-component";
import DonationHistory from "../components/donation-history";

export default async function DonationHistoryPage() {
  const user = await getUser();
  const donorId = user?.donor_id;
  const res = await fetchDonations(donorId);
  if (!res.success) {
    return <ErrorComponent message={res.message} />
  }
  const donations = res.data;
  
  return (
    <div>
      <DonationHistory donationData={donations} />
    </div>
  )
}