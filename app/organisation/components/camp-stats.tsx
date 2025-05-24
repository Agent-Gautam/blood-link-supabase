import StatBox from "@/components/dashboard/stat-box";
import { CheckCircle, DropletIcon, UserIcon } from "lucide-react";

export default function CampStats({
  registrations,
  donations,
}: {
  registrations: number;
  donations: any[];
}) {
  const totalDonors = new Set(donations.map((d) => d.donor.id)).size;
  const totalUnits = donations.reduce((sum, d) => sum + d.units_donated, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatBox
        heading="Total Registrations"
        data={registrations}
        icon={<UserIcon className="h-4 w-4 text-muted-foreground" />}
      />
      <StatBox
        heading="Total Donors"
        data={totalDonors}
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
      />
      <StatBox
        heading="Total Units Collected"
        data={totalUnits}
        icon={<DropletIcon className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
