import { getUser } from "@/utils/supabase/server";
import OrganisationStats from "./components/organisation-stats";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BloodRequests from "./components/blood-requests";
import InventoryShowcase from "./components/inventory-showcase";
import OngoingCamps from "./components/ongoing-camps";
import {
  fetchOrganisationByUserId,
  fetchOrganisationStats,
  fetchOngoingCamps,
} from "./actions";
import CompleteProfilePrompt from "./components/complete-profile-prompt";
import OrganisationProfile from "./components/organisation-profile";
import fetchBloodRequests from "./requests/actions";
import fetchInventoryAction from "./inventory/actions";

export const revalidate = 60;

export default async function OrganisationDashboard() {
  const user = await getUser();
  // Fetch organisation data
  const result = await fetchOrganisationByUserId(user.id);

  if (!result.success || !result.data) {
    return <CompleteProfilePrompt />;
  }

  const orgData = result.data;
  const userName = `${user?.firstName} ${user?.lastName}`;

  // Fetch organisation statistics
  const statsResult = await fetchOrganisationStats(orgData.id);

  const stats =
    statsResult.success && statsResult.data
      ? statsResult.data
      : { totalDonations: 0, totalDonationCamps: 0, totalDonors: 0 };

  // Fetch ongoing camps
  const ongoingCampsResult = await fetchOngoingCamps(orgData.id);

  const ongoingCamps =
    ongoingCampsResult.success && ongoingCampsResult.data
      ? ongoingCampsResult.data
      : [];

  // Fetch blood requests
  const bloodRequestsResult = await fetchBloodRequests(orgData.id, 5);

  const bloodRequests =
    bloodRequestsResult.success && bloodRequestsResult.data
      ? bloodRequestsResult.data
      : [];

  // Fetch inventory
  const inventoryResult = await fetchInventoryAction(orgData.id);

  const inventory =
    inventoryResult.success && inventoryResult.data
      ? inventoryResult.data
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Card - Static content, shows immediately */}
        <OrganisationProfile
          userName={userName}
          organisationName={orgData.name}
        />

        {/* Stats Section */}
        <div className="transition-all duration-300">
          <OrganisationStats stats={stats} />
        </div>

        {/* Ongoing Camps */}
        {ongoingCamps.length > 0 && <OngoingCamps camps={ongoingCamps} />}

        {/* Blood Requests */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
            <CardTitle className="text-2xl font-semibold text-red-700">
              Recent Blood Requests
            </CardTitle>
            <Button
              asChild
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
            >
              <Link href="/organisation/requests">View All Requests</Link>
            </Button>
          </CardHeader>
          <div className="p-6">
            <BloodRequests org_id={orgData.id} />
          </div>
        </Card>

        {/* Inventory Overview */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-semibold text-red-700">
              Inventory Overview
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Current blood inventory status for your organisation.
            </CardDescription>
          </CardHeader>
          <div className="p-6">
            <InventoryShowcase inventory={inventory} />
          </div>
        </Card>
      </div>
    </div>
  );
}
