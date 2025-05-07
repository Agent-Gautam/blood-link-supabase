import { getUser } from "@/utils/supabase/server";
import CampForm from "../components/camp-form";

export default async function CreateCamp({
  searchParams,
}: {
  searchParams: { [key: string]: string };
  }) {
  const params = await searchParams;
  const camp_id = params.id;
  console.log(camp_id);
  return (
    <div>
      <CampForm camp_id={camp_id} />
    </div>
  );
}
