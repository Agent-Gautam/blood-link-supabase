import { DropletIcon, Droplet } from "lucide-react";
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
import { InventorySummary } from "../types";
import EmptyState from "@/components/empty-state";
import { Plus } from "lucide-react";

export default function InventoryShowcase({
  inventory,
}: {
  inventory: InventorySummary[] | null;
}) {
  if (!inventory || inventory.length === 0) {
    return (
      <EmptyState
        title="No Inventory Yet"
        description="Your blood bank inventory is empty. Start by adding your first blood units to begin tracking and managing your stock effectively."
        icon={Droplet}
        showAddButton={false}
        footer={
          <Link href="/organisation/inventory/all">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add First Inventory
            </Button>
          </Link>
        }
      />
    );
  }
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
