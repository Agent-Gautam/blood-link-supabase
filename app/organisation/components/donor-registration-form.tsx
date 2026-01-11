import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { registerDonor } from "../camps/actions";
import { SubmitButton } from "@/components/submit-button";

export function DonorRegistrationForm({
  onRegister,
}: {
  onRegister: (donor: any) => void;
}) {
  const handleRegister = async (formData: FormData) => {
    const result = await registerDonor(formData);
    if (!result.success || !result.data) {
      console.log(result.error);
      return;
    }
    onRegister(result.data);
  };

  return (
    <form action={handleRegister} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" name="first_name" required />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" name="last_name" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="blood_type">Blood Type</Label>
          <Select name="blood_type" required>
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input id="date_of_birth" name="date_of_birth" type="date" required />
        </div>
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select name="gender" required>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" required />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" required />
        </div>
      </div>
      <SubmitButton formAction={handleRegister} pendingText="Registering">
        Register Donor
      </SubmitButton>
    </form>
  );
}

export default DonorRegistrationForm;
