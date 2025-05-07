"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactEventHandler, SetStateAction, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import OrganisationCard from "@/components/organisation-card";
import { fetchOrganisationsAction } from "../request/actions";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader } from "lucide-react";

const bloodTypes = [
  { key: "A_P", label: "A+" },
  { key: "A_N", label: "A-" },
  { key: "B_P", label: "B+" },
  { key: "B_N", label: "B-" },
  { key: "O_P", label: "O+" },
  { key: "O_N", label: "O-" },
  { key: "AB_P", label: "AB+" },
  { key: "AB_N", label: "AB-" },
];

type OrganisationSelectorProps = {
  selectedOrganisations: string[];
  setSelectedOrganisations: React.Dispatch<SetStateAction<string[]>>
}

export default function OrganisationSelector({selectedOrganisations, setSelectedOrganisations}: OrganisationSelectorProps) {

  const [fetchedOrganisations, setFetchedOrganisations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    orgName: "",
    inputLocation: "",
    status: "All",
    A_P: true,
    A_N: true,
    B_P: true,
    B_N: true,
    O_P: true,
    O_N: false,
    AB_P: false,
    AB_N: false,
  });
  async function fetchOrganisations() {
    setLoading(true);
    const allOrganisations = await fetchOrganisationsAction();
    setFetchedOrganisations(allOrganisations);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrganisations();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  }
  return (
    <div className="p-2 flex flex-col gap-3">
      <div className="flex flex-row gap-3">
        <Input
          name="orgName"
          value={searchParams.orgName}
          onChange={handleChange}
        />
        <Select
          name="status"
          onValueChange={(value) =>
            setSearchParams({ ...searchParams, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={"Status"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger>
            Blood Available
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-1 max-w-20">
            {bloodTypes.map((type) => (
              <div key={type.key} className="flex items-center gap-1">
                <Checkbox
                  checked={
                    searchParams[
                      type.key as keyof typeof searchParams
                    ] as boolean
                  }
                  onCheckedChange={(checked) =>
                    setSearchParams({
                      ...searchParams,
                      [type.key]: checked,
                    })
                  }
                />
                <Label>{type.label}</Label>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      {loading ? (
        <div className="size-full flex items-center justify-center">Loading <Loader className={"animate-spin"} /></div>
      ) : (
        <div className="flex flex-row gap-3">
          {fetchedOrganisations?.length > 0 &&
            fetchedOrganisations?.map((org) => {
              return (
                <OrganisationCard
                  key={org.id}
                  organisation={org}
                  selected={selectedOrganisations.includes(org.id)}
                  onSelect={(id) => {
                    selectedOrganisations.includes(id)
                      ? setSelectedOrganisations(
                          selectedOrganisations.filter((org_id) => org_id != id)
                        )
                      : setSelectedOrganisations([
                          ...selectedOrganisations,
                          id,
                        ]);
                  }}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
