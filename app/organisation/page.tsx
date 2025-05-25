import { createClient, getUser } from "@/utils/supabase/server";
import OrganisationStats from "./components/organisation-stats";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BloodRequests from "./components/blood-requests";
import InventoryShowcase from "./components/inventory-showcase";
import { redirect } from "next/navigation";
import CampDetailsShow from "./components/camp-details";
import ShowMap from "@/components/show-map";

// import Map from "@/components/map";
// import MapClient from "@/components/Map-client";

export default async function OrganisationDashboard() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-red-600 tracking-tight">
              Please Sign In
            </CardTitle>
            <CardDescription className="mt-3 text-gray-600 text-lg">
              Access your organisation dashboard by signing in.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center mt-6">
            <Button
              asChild
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (user.role === "DONOR") {
    redirect("donor/");
  }

  // Fetch organisation data
  const { data: orgData } = await supabase
    .from("organisations")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!orgData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-red-600 tracking-tight">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="mt-3 text-gray-600 text-lg">
              Finish setting up your organisation profile to access the
              dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center mt-6">
            <Button
              asChild
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              <Link href="/organisation/register">Complete Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const userName = `${user?.firstName} ${user?.lastName}`;
  const currentDate = new Date().toISOString();
  const { data: ongoingCamps, error: ongoingCampError } = await supabase
    .from("donation_camps")
    .select("*")
    .eq("organisation_id", orgData.id)
    .lte("start_date", currentDate)
    .gte("end_date", currentDate);

  if (ongoingCampError) {
    console.log("Error fetching ongoing camp:", ongoingCampError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Card */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div>
              <CardTitle className="text-3xl font-extrabold text-red-700 tracking-tight">
                Welcome, {userName}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-lg">
                Organisation:{" "}
                <span className="font-semibold text-gray-800">
                  {orgData.name}
                </span>
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
              >
                <Link href="/organisation/settings">Settings</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
              >
                <Link href="/organisation/register">Edit Profile</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Section */}
        <div className="transition-all duration-300">
          <OrganisationStats org_id={orgData.id} />
        </div>

        {/* Ongoing Camps */}
        {ongoingCamps && ongoingCamps.length > 0 && (
          <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold text-red-700">
                Ongoing Donation Camps
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Currently active blood donation camps hosted by your
                organisation.
              </CardDescription>
            </CardHeader>
            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {ongoingCamps.map((camp) => (
                <div
                  key={camp.id}
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <CampDetailsShow campData={camp} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Blood Requests */}
        <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
            <CardTitle className="text-2xl font-semibold text-red-700">
              Blood Requests
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
            <InventoryShowcase org_id={orgData.id} />
          </div>
        </Card>
        <ShowMap />
      </div>
    </div>
  );
}
