import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { addDonation } from "../camps/actions";
import { SubmitButton } from "@/components/submit-button";

export function DonorDetails({
  donor,
  campId,
  onAddDonation,
}: {
  donor: any;
  campId: string;
  onAddDonation: () => void;
}) {
  const handleAddDonation = async (formData: FormData) => {
    const result = await addDonation(formData);
    if (result.success) {
      onAddDonation();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-bloodRed" />
          Donor Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">
              {donor.first_name} {donor.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="font-medium">{donor.age}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium">{donor.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blood Type</p>
            <p className="font-medium">{donor.blood_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{donor.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{donor.phone_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Donation</p>
            <p className="font-medium">
              {donor.last_donation_date
                ? formatDate(donor.last_donation_date).date
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Eligibility</p>
            <p
              className={`font-medium ${
                donor.is_eligible ? "text-emerald-500" : "text-destructive"
              }`}
            >
              {donor.is_eligible ? "Eligible" : "Not Eligible"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Health Conditions</p>
            <p className="font-medium">{donor.health_conditions || "None"}</p>
          </div>
        </div>
        <form action={handleAddDonation} className="mt-4">
          <input type="hidden" name="camp_id" value={campId} />
          <input type="hidden" name="donor_id" value={donor.id} />
          <input type="hidden" name="blood_type" value={donor.blood_type} />
          <SubmitButton
            formAction={handleAddDonation}
            pendingText={"Adding..."}
                      disabled={!donor.is_eligible}
                      className="w-full"
          >
            Add Donation
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
