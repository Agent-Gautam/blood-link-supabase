import { getUser } from "@/utils/supabase/server";
import CampForm from "../../components/camp-form";
import { fetchCamp } from "../actions";
import { fetchOrganisationInventoryStatus } from "../../actions";

type searchParamsType = {
  id: string;
  error: string;
  message: string;
};

export default async function CreateCamp(props: {
  searchParams: Promise<searchParamsType>;
}) {
  const user = await getUser();
  const org_id = user?.id;
  const params = await props.searchParams;
  const camp_id = params.id;
  let campDetails = null;
  if (camp_id) {
    const result = await fetchCamp(camp_id, org_id);
    if (result.error?.code == "PGRST116") {
      return <div>No donation camp existed </div>;
    }
    if (!result.success) {
      return <div>Error {result.error?.message}</div>;
    }
    campDetails = result.data;
    console.log("camp details: ", campDetails);
  }

  const inventoryResult = await fetchOrganisationInventoryStatus(org_id || "");
  let inventoryOn = null;
  if (inventoryResult.success && inventoryResult.data) {
    inventoryOn = inventoryResult.data.inventory_on;
  } else {
    console.log("error fetching inventory status", inventoryResult.error);
    inventoryOn = null;
  }
  console.log(inventoryOn);
  return (
    <div>
      <CampForm
        campData={campDetails ?? null}
        inventoryOn={inventoryOn}
        org_id={org_id}
      />
    </div>
  );
}
