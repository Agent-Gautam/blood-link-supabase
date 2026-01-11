import StatBox from "@/components/dashboard/stat-box";
import { Button } from "@/components/ui/button";
import { DropletIcon, PersonStanding, PlusSquare } from "lucide-react";
import Link from "next/link";
import { OrganisationStats as OrganisationStatsType } from "../types";

export default function OrganisationStats({
  stats,
}: {
  stats: OrganisationStatsType;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-red-100">
      <StatBox
        heading="Total Collections"
        data={stats.totalDonations}
        icon={<DropletIcon className="h-8 w-8 text-bloodlink-red" />}
        additional="+2 from last year"
        className="transition-transform duration-200 hover:scale-105 bg-white rounded-lg shadow-md p-6"
      />
      <StatBox
        heading="Donation Camps"
        data={stats.totalDonationCamps}
        icon={<PlusSquare className="h-8 w-8 text-bloodlink-red" />}
        additional="+1 from last year"
        className="transition-transform duration-200 hover:scale-105 bg-white rounded-lg shadow-md p-6"
      />
      <StatBox
        heading="Participating Donors"
        data={stats.totalDonors}
        icon={<PersonStanding className="h-8 w-8 text-bloodlink-red" />}
        additional="+2 from last year"
        className="transition-transform duration-200 hover:scale-105 bg-white rounded-lg shadow-md p-6"
      />
      <div className="sm:col-span-2 lg:col-span-3 flex justify-center mt-4">
        <Button
          asChild
          className="bg-bloodlink-red hover:bg-red-700 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          <Link href="/organisation/camps/update">
            Organise a Donation Camp
          </Link>
        </Button>
      </div>
    </div>
  );
}
