import StatBox from "@/components/dashboard/stat-box";
import { createClient } from "@/utils/supabase/server";
import { Badge, Calendar, Clock, DropletIcon, Heart } from "lucide-react";

type DonorStatsProps = {
  donationCounts: number;
  nextEligibleDate: string;
  lastDonationDate: string;
};

export default async function DonorStats({
  donationCounts,
  nextEligibleDate,
  lastDonationDate,
}: DonorStatsProps) {
  const isEligibleToDonate =
    !nextEligibleDate || new Date(nextEligibleDate) <= new Date();
  return (
    <div>
      <StatBox
        heading="Total donations"
        data={donationCounts || 0}
        icon={<DropletIcon />}
        additional="+2 from last year"
      />
      <StatBox
        heading="Last Donation Date"
        data={lastDonationDate.split("T")[0]}
        icon={<Heart />}
        additional="Impact"
      />
      <StatBox
        heading="Next Eligible Date"
        data={nextEligibleDate.split("T")[0]}
        icon={<Calendar />}
        additional={
          <div className="mt-4">
            {isEligibleToDonate ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                Eligible to Donate
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-amber-500 border-amber-500"
              >
                <Clock className="h-3 w-3 mr-1" />
                Not Eligible Yet
              </Badge>
            )}
          </div>
        }
      />
    </div>
  );
}
