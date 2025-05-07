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
  let totalDonationCamps = [];
  let totalDonors: any[] | null = [];
  const supabase = await createClient();
  // fetching total donations
  const { data: totalDonations, error } = await supabase
    .from("donations")
    .select("*", { count: "exact", head: true })
    .eq("organisation_id", org_id);
  // fetching total donations camps organised
  const { data } = await supabase
    .from("donation_camps")
    .select("id")
    .eq("organisation_id", org_id);
  if (data) {
    totalDonationCamps = data.map((value) => value.id);
  }

  // fetching total donors participated
  if (totalDonationCamps.length > 0) {
    const { data, error } = await supabase
      .from("camp_registrations")
      .select("donor_id")
      .in("camp_id", totalDonationCamps);
    totalDonors = data;
    if (error) console.error("Error fetching unique donors:", error);
  } else {
    totalDonors = [];
  }
  return (
    <div>
      <StatBox
        heading="Total collections"
        data={totalDonations || 0}
        icon={<DropletIcon />}
        additional="+2 from last year"
      />
      <StatBox
        heading="Total donation camps"
        data={totalDonationCamps?.length || 0}
        icon={<PlusSquare />}
        additional={"+1 from last year"}
      />
      <StatBox
        heading="total participating donors"
        data={totalDonors?.length || 0}
        icon={<PersonStanding />}
        additional={"+2 from last year"}
      />
      <Link href={"/organisation/camp"}><Button>Organise a donation camp</Button></Link>
    </div>
  );
}
