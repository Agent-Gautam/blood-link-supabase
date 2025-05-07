import { getUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import fetchInventoryAction from "./actions";
import InventoryStats from "../components/inventory-stats";
import InventoryDetails from "../components/inventory-details";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InventoryPage() {
    const user = await getUser();
    if (!user) {
        console.log("Not authorized")
        redirect("/sign-in");
    }
    const org_id = user.organisation_id;
    const fetchResult = await fetchInventoryAction(org_id);
    const inventory = fetchResult?.data;

  return (
      <div>
          <Button><Link href={"/organisation/inventory/all"}>Open Inventory</Link></Button>
          <InventoryStats inventory={inventory}/>
          <InventoryDetails inventoryDetails={inventory}/>
    </div>
  )
}