"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateCampAction } from "../camps/actions";
import SelectBloodBanks from "./select-blood-bank";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader } from "lucide-react";

export type CampDetailsType = {
  name: string;
  location: string;
  longitude: string;
  latitude: number | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  blood_bank_id: string | undefined;
  organisation_id: string | undefined;
};

export default function CampForm({
  campData,
  inventoryOn,
  org_id,
}: {
  campData: CampDetailsType | null;
  inventoryOn: boolean | null;
  org_id: string;
}) {
  const [selectedBloodBank, setSelectedBloodBank] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!selectedBloodBank && !inventoryOn) {
      toast.error("Please select a blood bank");
      return;
    }
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    toast.loading("Creating camp...");
    const response = await CreateCampAction(formData);
    setLoading(false);
    toast.dismiss();
    if (response) {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.error?.message || "Error creating camp");
      }
    } else {
      toast.error("Failed to create camp: not authorized");
    }
  };
  if (inventoryOn === null) {
    toast.error("Error fetching inventory status");
  }
  return (
    <form
      className="flex flex-col min-w-64 max-w-64 mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-medium">Create Camp</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="name">Camp Name</Label>
        <Input
          name="name"
          placeholder="Camp Name"
          defaultValue={campData?.name}
          required
        />

        <Label htmlFor="location">Location</Label>
        <Input
          name="location"
          placeholder="Location"
          defaultValue={campData?.location}
          required
        />

        <Label htmlFor="latitude">Latitude</Label>
        <Input
          name="latitude"
          placeholder="Latitude"
          type="number"
          step="any"
          defaultValue={campData?.latitude}
          required
        />

        <Label htmlFor="longitude">Longitude</Label>
        <Input
          name="longitude"
          placeholder="Longitude"
          type="number"
          step="any"
          defaultValue={campData?.longitude}
          required
        />

        <Label htmlFor="start_date">Start Date</Label>
        <Input
          name="start_date"
          type="datetime-local"
          defaultValue={campData?.start_date}
          required
        />

        <Label htmlFor="end_date">End Date</Label>
        <Input
          name="end_date"
          type="datetime-local"
          defaultValue={campData?.end_date}
          required
        />
        <Input
          name="blood_bank_id"
          type="hidden"
          defaultValue={campData?.blood_bank_id}
          value={inventoryOn ? org_id : (selectedBloodBank ?? "")}
          required
          readOnly
        />
        {!inventoryOn && (
          <>
            <Label htmlFor="blood_bank_id">Blood Bank</Label>
            <p className="text-sm text-muted-foreground">
              Select a blood bank to create a camp. This is where your collected
              donations will transfer
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {selectedBloodBank ? "Selected" : "Select Blood Bank"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[700px]">
                <DialogTitle>Select Blood Banks</DialogTitle>
                <SelectBloodBanks
                  org_id={org_id}
                  selectedBloodBank={selectedBloodBank}
                  selectBloodBank={(id) => setSelectedBloodBank(id)}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <h1 className="flex items-center justify-center gap-3">
              <Loader className="animate-spin" />
              Creating...
            </h1>
          ) : (
            "Create Camp"
          )}
        </Button>
      </div>
    </form>
  );
}
