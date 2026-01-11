"use client";

import OrganisationCard from "@/components/organisation-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrganisationDetails } from "../types";
import { OrganisationsWithBlood } from "@/app/donor/types";

type ComponentProps = {
  org_id: string;
  selectedBloodBank: string | null;
  selectBloodBank: (bloodBankId: string | null) => void;
};

export default function SelectBloodBanks({
  org_id,
  selectedBloodBank,
  selectBloodBank,
}: ComponentProps) {
  const [fetchedBloodBanks, setFetchedBloodBanks] = useState<
    OrganisationsWithBlood[]
  >([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function fetchBloodBanks() {
    setLoading(true);
    try {
      const { data: bloodBanks, error } = await supabase
        .from("organisations")
        .select("*")
        .eq("inventory_on", true)
        .neq("id", org_id);

      if (error) {
        throw error;
      }

      // Map OrganisationDetails to OrganisationsWithBlood format
      const mappedBloodBanks: OrganisationsWithBlood[] =
        (bloodBanks as any[]).map((org) => ({
          organisation_id: org.id,
          name: org.name,
          type: org.type,
          is_verified: org.is_verified || false,
          address: org.address,
          contact_number: org.contact_number,
          blood_type: "", // Not available in this context
          total_units: 0, // Not available in this context
          distance_km: 0, // Not available in this context
        })) || [];

      setFetchedBloodBanks(mappedBloodBanks);
    } catch (error: any) {
      toast.error(`Error fetching blood banks: ${error.message}`);
      console.error("Error fetching blood banks:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchBloodBanks();
  }, []);
  return (
    <div className="w-full">
      {loading ? (
        <div className="size-full flex items-center justify-center">
          Loading <Loader className={"animate-spin"} />
        </div>
      ) : (
        <div className="flex flex-row gap-3 flex-wrap items-center justify-center w-full overflow-x-auto pb-2">
          {fetchedBloodBanks.length > 0 ? (
            fetchedBloodBanks.map((org) => (
              <OrganisationCard
                key={org.organisation_id}
                organisation={org}
                selected={selectedBloodBank === org.organisation_id}
                onSelect={(id) =>
                  selectedBloodBank === id
                    ? selectBloodBank(null)
                    : selectBloodBank(id)
                }
                showInventory={false}
              />
            ))
          ) : (
            <div className="w-full py-8 text-center text-sm text-muted-foreground">
              No blood banks available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
