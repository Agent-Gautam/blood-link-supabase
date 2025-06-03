import StatBox from "@/components/dashboard/stat-box";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { DropletIcon, PersonStanding, PlusSquare } from "lucide-react";
import Link from "next/link";

export default async function OrganisationStats({
  org_id,
}: {
  org_id: string;
}) {
  const supabase = await createClient();

  const [
    { count: totalDonations, error: donationsError },
    { count: totalDonationCamps, error: campsError },
    { count: donors, error: donorsError },
  ] = await Promise.all([
    supabase
      .from("donations")
      .select("*", { count: "exact", head: true })
      .eq("organisation_id", org_id),
    supabase
      .from("donation_camps")
      .select("id", { count: "exact", head: true })
      .eq("organisation_id", org_id),
    supabase
      .from("donations")
      .select("donor_id", { count: "exact", head: false })
      .eq("organisation_id", org_id)
      .not("donor_id", "is", null),
  ]);

  if (donationsError)
    console.error("Error fetching donations:", donationsError);
  if (campsError) console.error("Error fetching donation camps:", campsError);
  if (donorsError) console.error("Error fetching unique donors:", donorsError);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-red-100">
      <StatBox
        heading="Total Collections"
        data={totalDonations || 0}
        icon={<DropletIcon className="h-8 w-8 text-bloodlink-red" />}
        additional="+2 from last year"
        className="transition-transform duration-200 hover:scale-105 bg-white rounded-lg shadow-md p-6"
      />
      <StatBox
        heading="Donation Camps"
        data={totalDonationCamps || 0}
        icon={<PlusSquare className="h-8 w-8 text-bloodlink-red" />}
        additional="+1 from last year"
        className="transition-transform duration-200 hover:scale-105 bg-white rounded-lg shadow-md p-6"
      />
      <StatBox
        heading="Participating Donors"
        data={donors || 0}
        icon={<PersonStanding className="h-8 w-8 text-bloodlink-red" />}
        additional="+2 from last year"
        className="transition-transform duration-200 hover:scale-105 bg-white rounded-lg shadow-md p-6"
      />
      <div className="sm:col-span-2 lg:col-span-3 flex justify-center mt-4">
        <Button
          asChild
          className="bg-bloodlink-red hover:bg-red-700 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          <Link href="/organisation/camps/update">Organise a Donation Camp</Link>
        </Button>
      </div>
    </div>
  );
}
