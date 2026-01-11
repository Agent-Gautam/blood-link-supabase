import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplets,
  Heart,
  Activity,
  Edit,
  UserCheck,
} from "lucide-react";
import { fetchDonorDetails } from "../../actions";
import fetchImage from "@/app/actions/bucket-actions/fetch";
import Image from "next/image";
import XPLevel from "@/app/donor/components/xp-level";
import { DonorDetailsData } from "@/app/types";

export default async function DonorDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const searchParams = await params;
  const donorId = searchParams.id;
  const res = await fetchDonorDetails(donorId);
  if (!res.success && !res.data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-red-500">{res.message}</p>
      </div>
    );
  }
  const donor: DonorDetailsData = res.data!;
  const age =
    new Date().getFullYear() - new Date(donor.dateOfBirth).getFullYear();
  const donorPhotoUrl = await fetchImage("donor-photo", donorId);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={donorPhotoUrl || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {donor.firstName[0]}
                {donor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    {donor.firstName} {donor.lastName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={donor.isActive ? "default" : "secondary"}>
                      {donor.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      <Droplets className="w-3 h-3 mr-1" />
                      {donor.bloodType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{donor.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{donor.phoneNumber}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(donor.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      ({age} years old)
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Gender
                  </label>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                    <span>{donor.gender}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <span>{donor.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Blood Type
                </label>
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 text-lg px-3 py-1"
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  {donor.bloodType}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Health Conditions
                </label>
                <div className="flex flex-wrap gap-2">
                  {donor.healthConditions || "None"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donation History */}
        <div className="space-y-6">
          {/* XP Level Card */}
          <XPLevel xp={donor.xp} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Donation History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Last Donation
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {donor.lastDonationDate
                      ? new Date(donor.lastDonationDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "No donations yet"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <Button variant="outline" size="sm" className="w-full">
                  View Full History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Donor Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    donor.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Activity className="w-8 h-8" />
                </div>
                <p className="font-semibold">
                  {donor.isActive ? "Active Donor" : "Inactive Donor"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {donor.isActive
                    ? "Eligible for donation"
                    : "Not currently eligible"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
