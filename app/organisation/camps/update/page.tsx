import { createClient, getUser } from "@/utils/supabase/server";
import CampForm from "../../components/camp-form";
import { fetchCamp } from "../actions";

type searchParamsType = {
  id: string;
  error: string;
  message: string;
}

export default async function CreateCamp(props: { searchParams: Promise<searchParamsType> }) {
  const user = await getUser();
  if (!user) {
    return (
      <div>Not authorized</div>
    )
  }
  const org_id = user?.organisation_id;
  const params = await props.searchParams;
  const camp_id = params.id;
  let campDetails = null;
  if (camp_id) {
    const result = await fetchCamp(camp_id, org_id);
    if (result.error?.code == "PGRST116") {
      return (
        <div>No donation camp existed </div>
      )
    }
    if (!result.success) {
      return (
        <div>Error {result.error?.message}</div>
      )
    }
    campDetails = result.data;
    console.log("camp details: ", campDetails);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organisations")
    .select("inventory_on")
    .eq("id", org_id)
    .single();
  let inventoryOn = null;
  if (data) {
    inventoryOn = data.inventory_on;
  } else {
    console.log("error fetching inventory status", error);
    inventoryOn = null;
  }
  console.log(inventoryOn);
  return (
    <div>
      <CampForm campData={campDetails} inventoryOn={inventoryOn} org_id={org_id} />
    </div>
  );
}
