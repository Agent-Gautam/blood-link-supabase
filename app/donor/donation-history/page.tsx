import { getUser } from "@/utils/supabase/server";
import fetchDonations from "./actions";
import ErrorComponent from "@/components/error-component";
import DonationHistory from "../components/donation-history";

export default async function DonationHistoryPage() {
  const user = await getUser();
  const donorId = user?.id;
  const res = await fetchDonations(donorId);
  if (!res.success) {
    return <ErrorComponent message={res.message} />;
  }
  const rawDonations = res.data ?? null;

  // Transform the data to match the expected structure
  const donations = rawDonations
    ? rawDonations.map((donation: any) => ({
        id: donation.id,
        donation_date: donation.donation_date,
        donation_camps: Array.isArray(donation.donation_camps)
          ? donation.donation_camps[0]
          : donation.donation_camps,
        units_donated: donation.units_donated,
        status: donation.status,
        organisations: Array.isArray(donation.organisations)
          ? donation.organisations[0]
          : donation.organisations,
        organisation_id: donation.organisation_id,
        donation_camp_id: donation.donation_camp_id,
      }))
    : null;

  return (
    <div>
      <DonationHistory donationData={donations} />
    </div>
  );
}
