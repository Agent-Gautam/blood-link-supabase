import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CampAction } from "../camp/actions";
import { createClient } from "@/utils/supabase/server";

export default async function CampForm({
  camp_id,
}: {
  camp_id: string|null;
}) {
  let campData = {
    name: "", 
    location: "", 
    longitude: "", 
    latitude: undefined, 
    start_date: undefined,
    end_date: undefined
  }
  if (camp_id) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("donation_camps")
      .select("name, location, latitude, longitude, start_date, end_date")
      .eq("id", camp_id)
      .single();
    campData = data;
    if (error) {
      console.log("No camp found with the id: ", camp_id, "error: ", error);
      return (
        <div>camp not found</div>
      )
    }
  }
  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
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
        <Input name="location" placeholder="Location" defaultValue={campData?.location} required />

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
        <Input name="start_date" type="date" defaultValue={campData?.start_date} required />

        <Label htmlFor="end_date">End Date</Label>
        <Input name="end_date" type="date" defaultValue={campData?.end_date} required />

        <SubmitButton formAction={CampAction} pendingText="Creating...">
          Create Camp
        </SubmitButton>
      </div>
    </form>
  );
}
