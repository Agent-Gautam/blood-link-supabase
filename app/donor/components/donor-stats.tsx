"use client";

import { useEffect, useState } from "react";
import StatBox from "@/components/dashboard/stat-box";
import { Badge, Calendar, Clock, DropletIcon, Heart } from "lucide-react";
import { fetchDonor } from "../actions";
import fetchDonations from "../donation-history/actions";
import { createClient } from "@/utils/supabase/client";

export default function DonorStats() {
  const [donationCounts, setDonationCounts] = useState<number>(0);
  const [nextEligibleDate, setNextEligibleDate] = useState<string>("N/A");
  const [lastDonationDate, setLastDonationDate] = useState<string>("N/A");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        // Get user ID from client-side
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const donorId = user?.id;

        if (!donorId) {
          setIsLoading(false);
          return;
        }

        // Fetch donor data and donations in parallel
        const [donorRes, donationsRes] = await Promise.all([
          fetchDonor(donorId),
          fetchDonations(donorId),
        ]);

        if (donorRes.success && donorRes.data) {
          setLastDonationDate(donorRes.data.last_donation_date || "N/A");
          setNextEligibleDate(donorRes.data.next_eligible_date || "N/A");
        }

        if (donationsRes.success && donationsRes.data) {
          setDonationCounts(donationsRes.data.length);
        }
      } catch (error) {
        console.error("Error loading donor stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const isEligibleToDonate =
    !nextEligibleDate ||
    nextEligibleDate === "N/A" ||
    new Date(nextEligibleDate) <= new Date();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatBox
        heading="Total donations"
        data={donationCounts || 0}
        icon={<DropletIcon className="h-4 w-4 text-muted-foreground" />}
        additional="+2 from last year"
        className=""
        isLoading={isLoading}
      />
      <StatBox
        heading="Last Donation Date"
        data={
          lastDonationDate !== "N/A"
            ? new Date(lastDonationDate).toLocaleDateString()
            : "N/A"
        }
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
        additional="Impact"
        className=""
        isLoading={isLoading}
      />
      <StatBox
        heading="Next Eligible Date"
        data={
          nextEligibleDate !== "N/A"
            ? new Date(nextEligibleDate).toLocaleDateString()
            : "N/A"
        }
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        className=""
        additional={
          isLoading ? null : (
            <div className="mt-4">
              {isEligibleToDonate ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Eligible to Donate
                </Badge>
              ) : (
                <Badge className="text-amber-500 border-amber-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Not Eligible Yet
                </Badge>
              )}
            </div>
          )
        }
        isLoading={isLoading}
      />
    </div>
  );
}
