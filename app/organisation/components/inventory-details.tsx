import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { Droplet, Plus } from "lucide-react";
import { InventorySummary } from "../types";
import EmptyState from "@/components/empty-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InventoryDetails({
  inventoryDetails,
}: {
  inventoryDetails: InventorySummary[];
}) {
  if (!inventoryDetails || inventoryDetails.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Blood Type Inventory</h2>
        <EmptyState
          title="No Inventory Yet"
          description="Your blood bank inventory is empty. Start by adding your first blood units to begin tracking and managing your stock effectively."
          icon={Droplet}
          showAddButton={false}
          footer={
            <>
              <Link href="/organisation/inventory/all">
                <Button size="lg" className="gap-2 mb-8">
                  <Plus className="h-5 w-5" />
                  Add First Inventory
                </Button>
              </Link>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["A+", "B+", "AB+", "O+"].map((type) => (
                  <div
                    key={type}
                    className="flex flex-col items-center p-4 rounded-lg border border-dashed border-border bg-muted/30"
                  >
                    <Droplet className="h-6 w-6 text-muted-foreground/50 mb-2" />
                    <span className="text-sm font-medium text-muted-foreground/70">
                      {type}
                    </span>
                    <span className="text-xs text-muted-foreground/50">
                      0 units
                    </span>
                  </div>
                ))}
              </div>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Blood Type Inventory</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {inventoryDetails.map((blood, id) => (
          <BloodTypeCard
            key={id}
            bloodType={blood.blood_type}
            units={blood.total_units}
            lastUpdated={blood.last_updated}
          />
        ))}
      </div>
    </div>
  );
}

interface BloodTypeCardProps {
  bloodType: string;
  units: number;
  lastUpdated: string;
  capacity?: number;
}

const BloodTypeCard: React.FC<BloodTypeCardProps> = ({
  bloodType,
  units,
  lastUpdated,
  capacity = 200,
}) => {
  const percentage = Math.min(Math.round((units / capacity) * 100), 100);
  const getStatusColor = () => {
    if (percentage < 20) return "text-destructive";
    if (percentage < 50) return "text-amber-500";
    return "text-emerald-500";
  };
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-accent pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplet
              className={`h-5 w-5 text-bloodRed ${bloodType.includes("-") ? "opacity-70" : ""}`}
            />
            <span>{bloodType}</span>
          </div>
          <span className={getStatusColor()}>{units} units</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Inventory Level</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdated ? formatDate(lastUpdated).date : "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
