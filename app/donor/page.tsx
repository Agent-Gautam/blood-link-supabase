import { createClient, getUser } from "@/utils/supabase/server";
import DonorStats from "./components/donor-stats";
import DonationHistory from "./components/donation-history";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchRequestHistory } from "./request/actions";
import { DonorRequestTable } from "./components/request-table";
export default async function DonorDashboard() {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Please login to view your dashboard
      </div>
    );
  }
  const userName = user.firstName + " " + user.lastName;
  const { data } = await supabase
    .from("donors")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              You need to complete your donor profile to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/donor/register">Complete Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  const { data: donationData, error } = await supabase
    .from("donations")
    .select(
      `
      id,
    units_donated,
    donation_date,
    status,
    organisations!donations_organisation_id_fkey (name),
    donation_camps!fk_donation_camp(location)
  `
    )
    .eq("donor_id", data.id);
  if (error) {
    console.error("Error fetching donation details:", error);
  }
  const requestsResult = await fetchRequestHistory(5);
  const requestsData = requestsResult?.data;
  const blood_group = data?.blood_type;
  return (
    <div>
      <h1>Welcome {userName}</h1>
      <h2>Your blood group {blood_group}</h2>
      <Link href={"/donor/request"}>
        <Button>Request for blood</Button>
      </Link>
      {/* stats */}
      <DonorStats
        lastDonationDate={data.last_donation_date ?? "N/A"}
        nextEligibleDate={data.next_eligible_date ?? "N/A"}
        donationCounts={donationData?.length || 0}
      />
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Blood Donation Requests
        </h2>
        <DonorRequestTable requests={requestsData ? requestsData : []} />
      </div>
      <DonationHistory donationData={donationData} />
    </div>
  );
}
