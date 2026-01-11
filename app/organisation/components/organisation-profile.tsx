import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrganisationProfileProps {
  userName: string;
  organisationName: string;
  settingsUrl?: string;
  editProfileUrl?: string;
}

export default function OrganisationProfile({
  userName,
  organisationName,
  settingsUrl = "/organisation/settings",
  editProfileUrl = "/organisation/register",
}: OrganisationProfileProps) {
  return (
    <Card className="shadow-xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
        <div>
          <CardTitle className="text-3xl font-extrabold text-red-700 tracking-tight">
            Welcome, {userName}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-lg">
            Organisation:{" "}
            <span className="font-semibold text-gray-800">
              {organisationName}
            </span>
          </CardDescription>
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
          >
            <Link href={settingsUrl}>Settings</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
          >
            <Link href={editProfileUrl}>Edit Profile</Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
