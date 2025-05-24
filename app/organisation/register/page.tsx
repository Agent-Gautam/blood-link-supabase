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
import { RegisterOrganisation } from "./actions";
import { FormMessage, Message } from "@/components/form-message";

export default async function OrganisationRegistration(props: {
  searchParams: Promise<Message>;
}) {
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
            <CardTitle>Organisation Registration</CardTitle>
            <CardDescription>
              Please provide your your information.
            </CardDescription>
          </CardHeader>
          <form>
            <CardContent className="space-y-6">
              {/* organisation type */}
              <div className="space-y-2">
                <label htmlFor="orgType" className="text-sm font-medium">
                  Organisation Type
                </label>
                <Select name="orgType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOOD_BANK">Blood Bank</SelectItem>
                    <SelectItem value="HOSPITAL">Hospital</SelectItem>
                    <SelectItem value="INSTITUTE">Institute</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* organisation name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Organisation Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your organisation name"
                  required
                />
              </div>
              {/* contact_number */}
              <div>
                <label htmlFor="contact_number" className="text-sm font-medium">
                  Contact Number
                </label>
                <Input
                  type="text"
                  name="contact_number"
                  id="contact_number"
                  placeholder="Enter your organisation contact number"
                  required
                />
              </div>
              {/* Unique id by which org is verified */}
              <div className="space-y-2">
                <label htmlFor="unique_id" className="text-sm font-medium">
                  Unique ID
                </label>
                <Input
                  type="text"
                  name="unique_id"
                  id="unique_id"
                  placeholder="Enter the unique ID for verification"
                  required
                />
              </div>
              {/* address */}
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter your organisation address"
                  required
                />
              </div>
              {/* city */}
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Enter your organisation city"
                  required
                />
              </div>
              {/* state */}
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  type="text"
                  name="state"
                  id="state"
                  placeholder="Enter your organisation state"
                  required
                />
              </div>
              {/* country */}
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  type="text"
                  name="country"
                  id="country"
                  placeholder="Enter your organisation country"
                  required
                />
              </div>
              {/* do you want to keep inventory checkbox */}
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  name="inventory_on"
                  id="inventory_on"
                  className="h-4 w-4"
                />
                <label htmlFor="inventory_on" className="text-sm font-medium">
                  Do you want to keep an inventory?
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton
                formAction={RegisterOrganisation}
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
}
