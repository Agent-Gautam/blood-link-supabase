import { getUser } from "@/utils/supabase/server";
import DonorStats from "./components/donor-stats";
import DonationHistory from "./components/donation-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchRequestHistory } from "./request/actions";
import { DonorRequestTable } from "./components/request-table";
import fetchDonations from "./donation-history/actions";
import DonorProfile from "./components/profile";
import { fetchDonor } from "./actions";
import CompleteProfilePrompt from "../organisation/components/complete-profile-prompt";
import { DonorWithUser } from "./types";
import { HeartHandshake, Plus } from "lucide-react";

export default async function DonorDashboard() {
  const user = await getUser();
  const donorId = user?.id;
  const res = await fetchDonor(donorId);

  if (!res.success || !res.data) {
    return <CompleteProfilePrompt />;
  }

  // Map user metadata to match DonorWithUser type
  const donor: DonorWithUser = {
    ...res.data,
    users: {
      firstName: (user as any).firstName || (user as any).first_name || "",
      lastName: (user as any).lastName || (user as any).last_name || "",
      email: (user as any).email || "",
    },
  };

  const requestsResult = await fetchRequestHistory(5);
  const requestsData = requestsResult?.data || [];

  const donationsResult = await fetchDonations(donorId, { limit: 5 });
  // Map donations to match DonationHistoryProps structure
  const donationsData =
    donationsResult?.data?.map((donation: any) => ({
      id: donation.id,
      donation_date: donation.donation_date,
      donation_camps: donation.donation_camps || { name: "", location: "" },
      units_donated: donation.units_donated,
      status: donation.status,
      organisations: donation.organisations || { name: "" },
      organisation_id: donation.organisation_id,
      donation_camp_id: donation.donation_camp_id,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Section */}
        <DonorProfile donorData={donor} />

        {/* Quick Actions */}
        <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link href="/donor/request" className="flex-1">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <HeartHandshake className="h-5 w-5" />
                  Request for Blood
                </Button>
              </Link>
              <Link href="/donor/donation-camps" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 border-red-200 text-red-700 hover:bg-red-50 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  Find Donation Camp
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <section aria-label="Donation Statistics">
          <DonorStats />
        </section>

        {/* Blood Donation Requests Section */}
        <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Recent Blood Donation Requests
              </CardTitle>
              <CardDescription className="mt-1.5 text-base">
                Track your recent blood requests and their status
              </CardDescription>
            </div>
            <Link href="/donor/request/history">
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 font-medium transition-colors duration-200"
              >
                View All Requests
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {requestsData.length > 0 ? (
              <DonorRequestTable requests={requestsData} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven't made any blood requests yet.
                </p>
                <Link href="/donor/request">
                  <Button variant="default" className="gap-2">
                    <HeartHandshake className="h-4 w-4" />
                    Create Your First Request
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Donation History Section */}
        <section aria-label="Donation History">
          <DonationHistory donationData={donationsData} />
        </section>
      </div>
    </div>
  );
}
