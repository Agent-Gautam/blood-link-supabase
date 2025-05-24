import StatBox from "@/components/dashboard/stat-box";
import { AlertTriangle, Calendar, CheckCircle, Droplet } from "lucide-react";

export default function InventoryStats({
  inventory
}: {
    inventory: { blood_type: string; total_units: number }[];
}) {
  const criticalLevels = inventory.filter((item) => item.total_units < 30);

  const healthyLevels = inventory.filter((item) => item.total_units > 100);

  const totalUnits = inventory.reduce((sum, item) => sum + item.total_units, 0);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatBox
        heading="Total blood units"
        data={totalUnits}
        icon={<Droplet className="h-4 w-4 text-red-600" />}
        additional={"Across all blood types"}
      />
      <StatBox
        heading="Critical Levels"
        icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
        data={criticalLevels.length}
        additional={`${
          criticalLevels.length > 0
            ? criticalLevels.map(t => t.blood_type).join(", ")
            : "No critical levels"
        }`}
      />
      <StatBox
        heading="Universal Donor (O-)"
        data={inventory[7] ? inventory[7].total_units : "N/A"}
        icon={<Droplet className="h-4 w-4 text-purple-600" />}
        additional={
          inventory[7] ? inventory[7]?.total_units < 30 ? "Critical level" : "Sufficient level" : ""
        }
      />
    </div>
  );
}
