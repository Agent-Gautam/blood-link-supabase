import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Badge,
  CalendarIcon,
  DropletIcon,
  EditIcon,
  HeartIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonorWithUser } from "../types";
import { format, differenceInYears } from "date-fns";
import Link from "next/link";
import XPLevel from "./xp-level";

export default function DonorProfile({
  donorData,
  showEditButton = true,
}: {
  donorData: DonorWithUser;
  showEditButton?: boolean;
  }) {
  
  return (
    <Card className="shadow-sm border border-red-100 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="/profile-placeholder.jpeg"
                alt="Profile"
              />
              <AvatarFallback className="text-lg">
                {donorData?.users?.firstName?.[0]?.toUpperCase()}
                {donorData?.users?.lastName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {donorData?.users?.firstName + " " + donorData?.users?.lastName}
              </h2>
              <p className="text-muted-foreground">{donorData?.users?.email}</p>
              <div className="flex items-center mt-2">
                <DropletIcon className="h-4 w-4 text-bloodlink-red mr-1" />
                <span className="font-semibold text-bloodlink-red">
                  {donorData?.blood_type}
                </span>
              </div>
            </div>
          </div>
          {showEditButton && (
            <Link href="/donor/profile">
              <Button variant="outline" size="sm" className="mt-4 md:mt-0">
                <EditIcon className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* XP Level Display */}
        <div className="mb-6">
          <XPLevel xp={donorData?.xp ?? null} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
            <UserIcon className="h-5 w-5 text-bloodlink-red mb-2" />
            <span className="text-sm text-muted-foreground">Age</span>
            <span className="font-semibold">
              {donorData?.date_of_birth
                ? `${differenceInYears(new Date(), new Date(donorData.date_of_birth))} years`
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
            <MapPinIcon className="h-5 w-5 text-bloodlink-red mb-2" />
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="font-semibold">{donorData?.address}</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
            <CalendarIcon className="h-5 w-5 text-bloodlink-red mb-2" />
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="font-semibold">
              {format(new Date(donorData?.created_at), "MMM yyyy")}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
            <HeartIcon className="h-5 w-5 text-bloodlink-red mb-2" />
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className="bg-green-500">Active Donor</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
