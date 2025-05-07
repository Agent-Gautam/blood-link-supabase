import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { RegisterDonor } from "./actions";

const SimpleRegistration = async (props: {
  searchParams: Promise<Message>;
}) => {
  const searchParams = await props.searchParams;
    if ("message" in searchParams) {
      return (
        <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
          <FormMessage message={searchParams} />
        </div>
      );
    }
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Donor Registration</CardTitle>
            <CardDescription>
              Please provide your blood donation information.
            </CardDescription>
          </CardHeader>
          <form>
            <CardContent className="space-y-6">
              {/* Blood Type */}
              <div className="space-y-2">
                <label htmlFor="bloodType" className="text-sm font-medium">
                  Blood Type*
                </label>
                <Select name="bloodType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of Birth*
                </label>
                <Input name="dateOfBirth" type="date" required></Input>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* address */}
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  name="address"
                  placeholder="Your address"
                  required
                ></Input>
              </div>

              {/* city */}
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input name="city" placeholder="Your city" required></Input>
              </div>

              {/* country */}
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  name="country"
                  placeholder="Your country"
                  required
                ></Input>
              </div>

              {/* id anonymous */}
              <div>
                <label htmlFor="anonymous" className="text-sm font-medium">
                  keep me Anonymous
                </label>
                <Input name="anonymous" type="checkbox" />
              </div>

              {/* health conditions */}
              <div className="space-y-2">
                <label
                  htmlFor="healthConditions"
                  className="text-sm font-medium"
                >
                  Health Conditions
                </label>
                <Input
                  name="healthConditions"
                  placeholder="List any health conditions (if any)"
                ></Input>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton
                formAction={RegisterDonor}
                pendingText="Registering..."
              >
                Register
              </SubmitButton>
              <FormMessage message={searchParams} />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SimpleRegistration;
