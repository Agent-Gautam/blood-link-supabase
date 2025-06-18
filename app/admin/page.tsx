import { Organisation } from "@/lib/types";
import OrganizationTable from "./components/verify-organisations-table";
import { fetchOrganisations } from "./actions";

export default async function AdminDashboard() {
  // Sample organization data
  let unverifiedOrganizations: Organisation[] = [];
  const res = await fetchOrganisations({ isVerified: false });
  if (res.error) {
    console.error("Error fetching organizations:", res.error);
  }
  if (res.data) {
    unverifiedOrganizations = res.data;
  }
  return (
    <div>
      <OrganizationTable initialOrganisations={unverifiedOrganizations} />
    </div>
  );
}