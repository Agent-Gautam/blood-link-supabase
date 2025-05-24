import { getUser } from "@/utils/supabase/server";
import AllCamps from "../components/organisation-camps";

export default async function OrganisationCampsPage() {
  const user = await getUser();
  if (!user) {
    return <div>Not authorized</div>;
  }
  const orgId = user?.organisation_id;
  if (!orgId) {
    return <div>Organisation not found</div>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        My Organisation's Donation Camps
      </h1>
      <AllCamps org_id={orgId} />
    </div>
  );
}