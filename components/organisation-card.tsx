import {
  Building,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Droplet,
  Navigation,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { OrganisationsWithBlood } from "@/app/donor/types";

type OrganisationCardProps = {
  organisation: OrganisationsWithBlood;
  selected: boolean;
  onSelect: (id: string) => void;
  showInventory: boolean;
};

export default function OrganisationCard({
  organisation,
  selected,
  onSelect,
  showInventory = true,
}: OrganisationCardProps) {
  // Format the location
  return (
    <Card className="h-full max-w-[300px] min-w-[300px] transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-base line-clamp-1">
                {organisation.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            {/* {getTypeIcon(organisation.type)} */}
            <span className="ml-1">{organisation.type}</span>
          </div>
          <Badge
            variant={organisation.is_verified ? "default" : "outline"}
            className="ml-2"
          >
            {organisation.is_verified ? "Verified" : "Pending"}
          </Badge>
        </div>
        {showInventory && (
          <div className="mt-3 space-y-2">
            {/* Blood Units Available */}
            <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  Blood Units
                </span>
              </div>
              <span className="text-sm font-bold text-red-700 dark:text-red-400">
                {organisation.total_units ?? 0} units
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-1.5 shrink-0" />
                <div className="line-clamp-2 text-muted-foreground">
                  {organisation.address}
                </div>
              </div>

              {organisation.distance_km !== null && (
                <div className="flex items-center">
                  <Navigation className="h-4 w-4 text-blue-500 mr-1.5 shrink-0" />
                  <span className="text-muted-foreground">
                    {organisation.distance_km?.toFixed(1)} km away
                  </span>
                </div>
              )}

              {organisation.contact_number && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-1.5 shrink-0" />
                  <span className="text-muted-foreground">
                    {organisation.contact_number}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant={selected ? "default" : "outline"}
          size="sm"
          className={`w-full ${selected ? "bg-green-600 hover:bg-green-700" : ""}`}
          onClick={() => onSelect(organisation.organisation_id)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {selected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
