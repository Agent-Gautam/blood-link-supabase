import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Building2,
  Droplets,
  Clock,
  ExternalLink,
  Edit,
  Users,
} from "lucide-react";
import Link from "next/link";
import { fetchCampDetails } from "../../actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MapComponent from "@/components/location/map-component";
import { createClient, getUser } from "@/utils/supabase/server";

interface CampDetails {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  organization: {
    id: string;
    name: string;
    type: string;
    address: string;
    contactNumber: string;
  };
  bloodBank: {
    id: string;
    name: string;
    address: string;
    contactNumber: string;
  };
  // status: "upcoming" | "ongoing" | "completed";
  // expectedDonors: number;
  bannerUrl?: string;
}

export default async function CampDetails({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = await params;
  const campId = searchParams.id;
  const res = await fetchCampDetails(campId);

  if (!res.success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-red-500">{res.message}</p>
      </div>
    );
  }
  const camp: CampDetails = res.data!;
  const supabase = await createClient();
  const user = await getUser();
  let userCoordinates = null;
  if (user?.role == 'DONOR') {
    const { data, error } = await supabase.from("donors").select("latitude, longitude").match({ user_id: user.id }).single();
    console.log(data);
    if(data) {userCoordinates = { lat: data?.latitude, lng: data?.longitude };}
    
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-0">
          <div className="h-48 bg-gradient-to-r from-red-500 to-pink-600 rounded-t-lg relative">
            <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
            <div className="absolute bottom-4 left-6 text-white">
              <h1 className="text-3xl font-bold">{camp.name}</h1>
              <p className="text-red-100">Blood Donation Camp</p>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {/* <Badge className={getStatusColor(camp.status)}>
                {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
              </Badge> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Camp Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Camp Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Camp ID
                  </label>
                  <span className="font-mono text-sm">{camp.id}</span>
                </div>
                {/* <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Expected Donors
                  </label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{camp.expectedDonors} people</span>
                  </div>
                </div> */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(camp.startDate)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Time
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {/* <span>
                      {formatTime(camp.startTime)} - {formatTime(camp.endTime)}
                    </span> */}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Location
                </label>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <span>{camp.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organizing Institution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {camp.organization.name}
                  </h3>
                  <Badge variant="outline">{camp.organization.type}</Badge>
                  <p className="text-sm text-muted-foreground">
                    Organization ID: {camp.organization.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Address: {camp.organization.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contact: {camp.organization.contactNumber}
                  </p>
                </div>
                <Link href={`/info/organisation/${camp.organization.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blood Bank Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-red-500" />
                Blood Bank
              </CardTitle>
            </CardHeader>
            {camp.bloodBank.name ? (
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="font-semibold">{camp.bloodBank.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{camp.bloodBank.address}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Contact
                    </label>
                    <p className="text-sm">{camp.bloodBank.contactNumber}</p>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="text-center text-muted-foreground">
                <p>No blood bank information available.</p>
              </CardContent>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                <Users className="w-4 h-4 mr-2" />
                View Registrations
              </Button>
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Reminder
              </Button>
              {camp.latitude && camp.longitude && userCoordinates && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
                    <DialogHeader className="bg-red-300 sr-only">
                  <DialogTitle>Donation Camp Directions</DialogTitle>
                      <DialogDescription>
                        Take directions to the donation camp
                      </DialogDescription>
                    </DialogHeader>
                    <MapComponent
                      startMarkersData={userCoordinates}
                      endMarkersData={{
                        lat: camp.latitude,
                        lng: camp.longitude,
                      }}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {/* Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Status Summary</CardTitle>
            </CardHeader>
            {/* <CardContent>
              <div className="text-center space-y-2">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    camp.status === "upcoming"
                      ? "bg-blue-100 text-blue-600"
                      : camp.status === "ongoing"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Calendar className="w-8 h-8" />
                </div>
                <p className="font-semibold capitalize">{camp.status}</p>
                <p className="text-sm text-muted-foreground">
                  {camp.status === "upcoming" && "Camp scheduled"}
                  {camp.status === "ongoing" && "Currently active"}
                  {camp.status === "completed" && "Successfully completed"}
                </p>
              </div>
            </CardContent> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
