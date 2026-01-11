import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CampDetailsShow from "./camp-details";
import { DonationCamp } from "../types";

export default function OngoingCamps({ camps }: { camps: DonationCamp[] }) {
  if (!camps || camps.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-semibold text-red-700">
          Ongoing Donation Camps
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Currently active blood donation camps hosted by your organisation.
        </CardDescription>
      </CardHeader>
      <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {camps.map((camp) => (
          <div
            key={camp.id}
            className="transition-transform duration-200 hover:scale-105"
          >
            <CampDetailsShow campData={camp} />
          </div>
        ))}
      </div>
    </Card>
  );
}
