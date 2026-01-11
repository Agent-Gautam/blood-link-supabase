import { fetchAllCamps } from "./actions";
import { DonationCamp } from "../types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CampDetailsShow from "../components/camp-details";
import { redirect } from "next/navigation";
import EmptyState from "@/components/empty-state";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

const sortOptions = [
  { label: "Start Date (Asc)", value: "start_date-asc" },
  { label: "Start Date (Desc)", value: "start_date-desc" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

async function handleSearch(formData: FormData) {
  "use server";
  const search = formData.get("search") as string;
  const location = formData.get("location") as string;
  const sort = formData.get("sort") as string;
  console.log(search, location, sort);

  const params = new URLSearchParams();
  if (search && search.trim()) params.append("search", search);
  if (location && location.trim()) params.append("location", location);
  if (sort && sort.trim()) params.append("sort", sort);

  const queryString = params.toString();
  const url = queryString
    ? `/organisation/camps?${queryString}`
    : `/organisation/camps`;

  redirect(url);
}

export default async function OrganisationCampsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = (params.search as string) ?? "";
  const location = params.location ?? "";
  const sort = (params.sort as string) ?? "";

  // Only include location in filters if it has a value
  const filters: { location?: string } = {};
  if (location && location.trim()) {
    filters.location = location;
  }

  const res = await fetchAllCamps(filters, sort, search);

  if (!res.success) {
    console.error("Error fetching camps:", res.error || res.message);
  }

  const camps = res.data ?? ([] as DonationCamp[]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        My Organisation's Donation Camps
      </h1>
      <div className="container mx-auto py-8 px-4">
        <form
          className="flex flex-col md:flex-row gap-4 mb-6"
          action={handleSearch}
        >
          <Input
            id="search"
            name="search"
            placeholder="Search by camp name..."
            className="max-w-xs"
            defaultValue={search}
          />
          <Input
            id="location"
            name="location"
            placeholder="Filter by location..."
            className="max-w-xs"
            defaultValue={location}
          />
          <Select name="sort" defaultValue={sort}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Search</Button>
        </form>
        <div className="flex flex-col gap-3">
          {camps.length === 0 ? (
            <EmptyState
              title="No Donation Camps Yet"
              description="Start organizing donation camps to collect blood from donors in your community. Create your first camp to begin."
              icon={Calendar}
              showAddButton={false}
              footer={
                <Link href="/organisation/camps/update">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create First Camp
                  </Button>
                </Link>
              }
            />
          ) : (
            camps.map((camp) => (
              <CampDetailsShow campData={camp} key={camp.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
