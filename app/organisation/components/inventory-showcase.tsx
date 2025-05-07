import fetchInventoryAction from "../inventory/actions";
import { DropletIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default async function InventoryShowcase({
  org_id,
}: {
  org_id: string;
}) {
  const result = await fetchInventoryAction(org_id);
  if (!result || result.error) {
    console.error(
      "Failed to fetch inventory:",
      result?.error || "Unknown error"
    );
    return <div>Error loading inventory.</div>;
  }
  const inventory = result.data;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Inventory</CardTitle>
        <CardDescription>Current blood stock levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventory.map((item) => {
            const percentage = (item.total_units / 200) * 100;
            return (
              <div key={item.blood_type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DropletIcon className="h-4 w-4 text-bloodlink-red mr-2" />
                    <span>{item.blood_type}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {item.total_units} units
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-4">
          <Link href={`/organisation/inventory`}>
            <Button size="sm">View Full Inventory</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
