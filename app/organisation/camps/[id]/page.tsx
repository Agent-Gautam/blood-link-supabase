import { fetchCampData } from "../actions";
import { formatDate } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "@/components/submit-button";
import CampTabs from "../../components/camp-tabs";
import EmptyState from "@/components/empty-state";

export default async function CampDashboard({
  params,
}: {
  params: Promise<{id:string}>;
}) {
  const parameters = await params;
  const campId = parameters.id;
  const { camp, registrations, donations, donors, error } =
    await fetchCampData(campId);
  if (!camp) {
    return <EmptyState title="Camp doesn't exist" description="Camp not found or has been removed." />;
  }

  // if (error) {
  //   redirect("/not-found");
  // }
  async function refreshData(campId: string) {
    "use server";
    revalidatePath(`/camp/${campId}`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{camp.name}</h1>
          <p className="text-muted-foreground">{camp.location}</p>
          <p className="text-sm">
            {formatDate(camp.start_date).date} -{" "}
            {formatDate(camp.end_date).date}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <form>
            <SubmitButton
              pendingText=""
              formAction={refreshData.bind(null, campId)}
              variant="outline"
              size="icon"
            >
              <RefreshCcw className="h-4 w-4" />
            </SubmitButton>
          </form>
        </div>
      </div>
      <CampTabs
        campId={campId}
        donations={donations || []}
        donors={donors || []}
      />
    </div>
  );
}
