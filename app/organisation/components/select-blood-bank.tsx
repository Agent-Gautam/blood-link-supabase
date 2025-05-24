"use client";

import OrganisationCard from "@/components/organisation-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [fetchedBloodBanks, setFetchedBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: "",
    inputLocation: "",
    status: "All",
  });
  const supabase = createClient();
  async function fetchBloodBanks() {
    setLoading(true);
    const { data: bloodBanks, error } = await supabase
      .from("organisations")
      .select("*")
      .eq("inventory_on", "TRUE")
      .neq("id", org_id);
    console.log(bloodBanks);
    if (error) {
      toast.error(`Error fetching blood banks : ${error.message}`);
      console.log(error);
    }
    setFetchedBloodBanks(bloodBanks);
    setLoading(false);
  }
  useEffect(() => {
    fetchBloodBanks();
  }, []);
  return (
    <div>
      {loading ? (
        <div className="size-full flex items-center justify-center">
          Loading <Loader className={"animate-spin"} />
        </div>
      ) : (
        <div className="flex flex-row gap-3">
          {fetchedBloodBanks?.length > 0 &&
            fetchedBloodBanks?.map((org) => {
              return (
                <OrganisationCard
                  key={org.id}
                  organisation={org}
                  selected={selectedBloodBank == org.id}
                  onSelect={(id) =>
                    selectedBloodBank === id
                      ? selectBloodBank(null)
                      : selectBloodBank(id)
                  }
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
