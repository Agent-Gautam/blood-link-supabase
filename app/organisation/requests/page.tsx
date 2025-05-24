import BloodRequests from "../components/blood-requests";
import fetchBloodRequests from "./actions";
import { getUser } from "@/utils/supabase/server"; // adjust if needed

export default async function OrganisationRequestsPage() {
  // Get the current user (organisation)
  const user = await getUser();
  if (!user || !user.organisation_id) {
    // handle unauthenticated or missing org
    return <div>Not authorized</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Blood Requests</h2>
      <BloodRequests org_id={user.organisation_id} />
    </div>
  );
}
