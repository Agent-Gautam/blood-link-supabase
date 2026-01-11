import { getUser } from "@/utils/supabase/server";
import DonorProfile from "../components/profile";
import { fetchDonor } from "../actions";
import CompleteProfilePrompt from "../../organisation/components/complete-profile-prompt";
import { DonorWithUser } from "../types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Certificates from "../components/certificates";
import { fetchCertificates } from "../certificates/actions";

export default async function DonorProfilePage() {
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

  // Fetch certificates
  const certificatesResult = await fetchCertificates(donorId || "");
  const certificates = certificatesResult?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link href="/donor">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/donor/register">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1.5">
            View and manage your donor profile information
          </p>
        </div>

        {/* Profile Component */}
        <DonorProfile donorData={donor} showEditButton={false} />

        {/* Additional Profile Details */}
        <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Additional Information
            </CardTitle>
            <CardDescription>
              Complete profile details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Gender
                </p>
                <p className="text-base font-semibold capitalize">
                  {donor.gender || "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>
                <p className="text-base font-semibold">
                  {donor.date_of_birth
                    ? new Date(donor.date_of_birth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  City
                </p>
                <p className="text-base font-semibold">
                  {donor.city || "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  State
                </p>
                <p className="text-base font-semibold">
                  {donor.state || "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Country
                </p>
                <p className="text-base font-semibold">
                  {donor.country || "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Postcode
                </p>
                <p className="text-base font-semibold">
                  {donor.postcode || "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Last Donation Date
                </p>
                <p className="text-base font-semibold">
                  {donor.last_donation_date
                    ? new Date(donor.last_donation_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "No donations yet"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Next Eligible Date
                </p>
                <p className="text-base font-semibold">
                  {donor.next_eligible_date
                    ? new Date(donor.next_eligible_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Eligible now"}
                </p>
              </div>
              {donor.health_conditions && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Health Conditions
                  </p>
                  <p className="text-base font-semibold">
                    {donor.health_conditions}
                  </p>
                </div>
              )}
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Anonymous Donation
                </p>
                <p className="text-base font-semibold">
                  {donor.is_anonymous ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Section */}
        <Certificates certificates={certificates} />
      </div>
    </div>
  );
}
