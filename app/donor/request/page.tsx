"use client";

import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { fetchOrganisationsAction, submitRequestAction } from "./actions"; // import your action
import { Button } from "@/components/ui/button";
import { Message } from "@/components/form-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircleIcon,
  ChevronRight,
  DropletIcon,
  Loader,
  RefreshCw,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import SelectNearbyOrganisations from "../components/select-nearby-organisations";
import { OrganisationsWithBlood } from "../types";
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonorRequestPage() {
  const [fetchedOrganisations, setFetchedOrganisations] = useState<
    OrganisationsWithBlood[] | null
  >(null);
  const [selectedOrganisations, setSelectedOrganisations] = useState<string[]>(
    []
  );
  const [offset, setOffset] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bloodType, setBloodType] = useState("");
  const [unitsNeeded, setUnitsNeeded] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingOrgs, setFetchingOrgs] = useState(false);

  const fetchOrganisations = useCallback(async () => {
    setFetchingOrgs(true);
    try {
      const result = await fetchOrganisationsAction(
        bloodType,
        Number(unitsNeeded),
        offset,
        10
      );
      console.log(result);
      if (result.success) {
        setFetchedOrganisations(result.data as OrganisationsWithBlood[]);
      } else {
        toast.error(`Error fetching organisations: ${result.error}`);
      }
    } catch (error) {
      toast.error("Failed to fetch organisations");
      console.error(error);
    } finally {
      setFetchingOrgs(false);
    }
  }, [bloodType, unitsNeeded, offset]);

  useEffect(() => {
    if (dialogOpen) {
      fetchOrganisations();
    }
  }, [dialogOpen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedOrganisations.length == 0) {
        toast.error("No Organisations Selected");
        return;
      }
      setLoading(true);
      const toastid = toast.loading("Submitting Request");
      // Gather all form data
      const formData = {
        selectedOrganisations,
        bloodType,
        unitsNeeded,
        urgent,
      };
      console.log(formData);
      // Call your action function with the combined data
      const result = await submitRequestAction(formData);
      if (!result?.success) {
        setLoading(false);
        toast.error(`Error submitting request: ${result?.error}`);
        return;
      }
      // Optionally reset form or show a message
      toast.dismiss();
      toast.success("Request submitted");
      setLoading(false);
      setSelectedOrganisations([]);
      setBloodType("");
      setUnitsNeeded("");
      setUrgent(false);
    },
    [selectedOrganisations, bloodType, unitsNeeded, urgent]
  );
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button>
          <Link href={"./request/history"}>Previous Requests</Link>
        </Button>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Blood Donation Request
          </h1>
          <p className="mt-3 text-xl ">
            Complete the form below to submit a blood donation request to
            organizations
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className=" rounded-t-lg border-b">
            <CardTitle className="text-2xl font-bold flex items-center">
              <DropletIcon className="h-6 w-6 mr-2 text-red-500" /> New Request
            </CardTitle>
            <CardDescription>
              Fill in all the required details to create your blood donation
              request
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="font-medium ">
                    Blood Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={bloodType} onValueChange={setBloodType}>
                    <SelectTrigger id="bloodType" className="w-full">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units" className="font-medium ">
                    Units Needed <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="units"
                    type="number"
                    name="units_needed"
                    placeholder="Number of units"
                    value={unitsNeeded}
                    required
                    min="1"
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizations" className="font-medium ">
                  Organizations
                </Label>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-between text-left font-normal"
                      disabled={!bloodType || !unitsNeeded || fetchingOrgs}
                    >
                      {fetchingOrgs ? (
                        <span className="flex items-center gap-2">
                          <Loader className="h-4 w-4 animate-spin" />
                          Loading organizations...
                        </span>
                      ) : !bloodType || !unitsNeeded ? (
                        "Please select blood type and units first"
                      ) : selectedOrganisations.length === 0 ? (
                        "Select Organizations"
                      ) : (
                        `${selectedOrganisations.length} organization(s) selected`
                      )}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl min-h-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogTitle className="sr-only">
                      Select Organizations for Request
                    </DialogTitle>
                    <SelectNearbyOrganisations
                      loading={fetchingOrgs}
                      fetchedOrganisations={
                        fetchedOrganisations || ([] as OrganisationsWithBlood[])
                      }
                      selectedOrganisations={selectedOrganisations}
                      setSelectedOrganisations={setSelectedOrganisations}
                      setOffset={setOffset}
                      onRefresh={fetchOrganisations}
                    />
                  </DialogContent>
                </Dialog>
                {selectedOrganisations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {fetchedOrganisations
                      ?.filter((org) =>
                        selectedOrganisations.includes(org.organisation_id)
                      )
                      .map((org) => (
                        <Badge
                          key={org.organisation_id}
                          variant="secondary"
                          className="text-sm py-1"
                        >
                          {org.name}
                        </Badge>
                      ))}
                  </div>
                )}
                {(!bloodType || !unitsNeeded) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please select blood type and units needed first
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  name="urgent"
                  checked={urgent}
                  onCheckedChange={(checked) => setUrgent(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="urgent"
                    className="font-medium flex items-center"
                  >
                    Urgent Request
                    {urgent && (
                      <AlertCircleIcon className="h-4 w-4 ml-2 text-red-500" />
                    )}
                  </Label>
                  {urgent && (
                    <p className="text-sm ">
                      Marking as urgent will prioritize your request
                    </p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>

          <Separator />

          <CardFooter className=" px-6 py-4 rounded-b-lg flex justify-end">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={
                loading ||
                selectedOrganisations.length === 0 ||
                !bloodType ||
                !unitsNeeded
              }
              className={`
                px-6 ${urgent ? "bg-red-600 hover:bg-red-700" : ""}
                ${loading ? "opacity-80" : ""}
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
