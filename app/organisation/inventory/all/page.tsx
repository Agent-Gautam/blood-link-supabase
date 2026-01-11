import { createClient, getUser } from "@/utils/supabase/server";
import InventoryTable from "../../components/inventory-table";

export default async function AllInventory() {
  const user = await getUser();

  return (
    <div>
      <InventoryTable org_id={user.id} />
    </div>
  );
}
