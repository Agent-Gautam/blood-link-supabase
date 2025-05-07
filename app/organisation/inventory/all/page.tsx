import { createClient, getUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InventoryTable from "../../components/inventory-table";

export default async function AllInventory() {
  const user = await getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  return <div><InventoryTable org_id={user.organisation_id} /></div>;
}
