"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BloodCollection from "./camp-blood-collection";
import BloodTypeChart from "./blood-type-chart";
import CollectionTrendsChart from "./collection-trend-chart";
import DonorDemographicsChart from "./donor-demographics-chart";
import DonorsManagement from "./donor-management";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function CampTabs({
  campId,
  donations,
  donors,
}: {
  campId: string;
  donations: any[];
  donors: any[];
}) {
    const [tab, setTab] = useState("overview");

  const handleTabChange = (value: string) => {
      setTab(value);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="donors">Donors</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="space-y-6">
          <BloodCollection donations={donations} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                {/* <BloodTypeChart donations={donations} /> */}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                {/* <CollectionTrendsChart donations={donations} /> */}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                {/* <DonorDemographicsChart donors={donors} /> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="donors">
        <DonorsManagement donorList={donors} campId={campId} />
      </TabsContent>
    </Tabs>
  );
}
