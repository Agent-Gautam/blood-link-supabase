import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Shield,
  Droplets,
  User,
  Edit,
} from "lucide-react";
import { fetchOrganisationDetails } from "../../actions";

interface OrganizationDetails {
    id: string;
    name: string;
    email: string;
    adminFirstName: string;
    adminLastName: string;
    type: string;
    address: string;
    contactNumber: string;
    createdAt: string;
    isVerified: boolean;
    managesBloodInventory: boolean;
    bannerUrl?: string;
  };

export default async function OrganizationDetailsPage({ params }: { params: { id: string } }) {
  const searchParams = await params;
  const organizationId = searchParams.id;
  const res = await fetchOrganisationDetails(organizationId);
  if (!res.success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-red-500">{res.message}</p>
      </div>
    );
  }
  const organization: OrganizationDetails = res.data!;
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-0">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative">
            <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
            <div className="absolute bottom-4 left-6 text-white">
              <h1 className="text-3xl font-bold">{organization.name}</h1>
              <p className="text-blue-100">{organization.type}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Organization ID
                  </label>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono">{organization.id}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Type
                  </label>
                  <Badge variant="secondary">{organization.type}</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{organization.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Contact Number
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{organization.contactNumber}</span>
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
                  <span>{organization.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Administrator Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {organization.adminFirstName[0]}
                    {organization.adminLastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {organization.adminFirstName} {organization.adminLastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Organization Administrator
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status & Metadata */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Verification Status
                </label>
                <Badge
                  variant={organization.isVerified ? "default" : "destructive"}
                >
                  {organization.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Blood Inventory
                </label>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-red-500" />
                  <span className="text-sm">
                    {organization.managesBloodInventory
                      ? "Manages Inventory"
                      : "No Inventory Management"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Created Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(organization.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
