import { createClient, getUser } from "@/utils/supabase/server"
import OrganisationStats from "./components/organisation-stats";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import fetchBloodRequests from "./requests/actions";
import BloodRequests from "./components/blood-requests";
import InventoryShowcase from "./components/inventory-showcase";
import { redirect } from "next/navigation";

export default async function OrganisationDashboard() {
    const supabase = await createClient();
    const user = await getUser();
      if (!user) {
        return (
          <div className="flex h-screen items-center justify-center">
            Please login to view your dashboard
          </div>
        );
  }
  if (user.role == "DONOR") {
    redirect("donor/");
  }
    const {data: orgData} = await supabase
        .from("organisations")
        .select("*")
        .eq("user_id", user.id)
        .single();
    if (!orgData) {
        return (
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  You need to complete your organisation profile to access the dashboard.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/organisation/register">Complete Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
  }
  const requestResult = await fetchBloodRequests(orgData.id);
  const bloodRequests = requestResult.data;
    const userName = user?.firstName + " " + user?.lastName;
  return (
    <div>
      Welcome {userName}
      <OrganisationStats org_id={orgData.id} />
      <Button asChild variant="outline">
        <Link href="/organisation/requests">Watch All Requests</Link>
      </Button>
      <BloodRequests requests={bloodRequests ? bloodRequests : []} />
      <InventoryShowcase org_id={orgData.id} />
    </div>
  );
}