import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowLeft } from "lucide-react";
import SearchDonorForm from "./search-donor-form";
import { DonorDetails } from "./donor-details";
import DonorRegistrationForm from "./donor-registration-form";

export default function DonorDialog({ campId }: { campId: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<
    "search" | "details" | "not-found" | "register"
  >("search");
  const [donor, setDonor] = useState<any>(null);

  const handleSearchResult = (result: any) => {
    if (result.error) {
      setState("not-found");
    } else {
      setDonor(result.donor);
      setState("details");
    }
  };

  const handleRegister = (newDonor: any) => {
    setDonor(newDonor);
    setState("details");
  };

  const handleAddDonation = () => {
    setOpen(false);
    setState("search");
    setDonor(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Donor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {state !== "search" && (
            <Button
                          variant="ghost"
                          size={"icon"}
              className="flex items-center gap-2"
              onClick={() => {
                if (state === "details" && donor) setState("search");
                else if (state === "not-found") setState("search");
                else if (state === "register") setState("not-found");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle>
            {state === "search" && "Search Donor"}
            {state === "details" && "Donor Details"}
            {state === "not-found" && "Donor Not Found"}
            {state === "register" && "Register New Donor"}
          </DialogTitle>
        </DialogHeader>
        {/* Back button for all states except 'search' */}

        {state === "search" && (
          <SearchDonorForm onSearch={handleSearchResult} />
        )}
        {state === "details" && donor && (
          <DonorDetails
            donor={donor}
            campId={campId}
            onAddDonation={handleAddDonation}
          />
        )}
        {state === "not-found" && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              No donor found with the provided details.
            </p>
            <Button onClick={() => setState("register")} className="w-full">
              Add Donor
            </Button>
          </div>
        )}
        {state === "register" && (
          <DonorRegistrationForm onRegister={handleRegister} />
        )}
      </DialogContent>
    </Dialog>
  );
}
