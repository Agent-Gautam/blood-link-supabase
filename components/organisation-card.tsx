import {
  Building,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Droplet,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type organisationDataProps = {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contact_number: string;
  is_verified: boolean;
  blood_inventory: { blood_type: string, total_units: number }[];
};

type OrganisationCardProps = {
  organisation: organisationDataProps;
  selected: boolean;
  onSelect: (id: string) => void;
};

export default function OrganisationCard({
  organisation,
  selected,
  onSelect,
}: OrganisationCardProps) {
  // Format the location
  const formatLocation = () => {
    const parts = [
      organisation.city,
      organisation.state,
      organisation.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };
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
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-1.5 shrink-0" />
            <div className="line-clamp-2">
              <span className="text-muted-foreground">
                {organisation.address}
              </span>
              {(organisation.city ||
                organisation.state ||
                organisation.country) && (
                <div className="text-muted-foreground">{formatLocation()}</div>
              )}
            </div>
          </div>

          {organisation.contact_number && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-1.5 shrink-0" />
              <span className="text-muted-foreground">
                {organisation.contact_number}
              </span>
            </div>
          )}
          <RenderBloodInventory inventory={organisation.blood_inventory} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className={"w-full"}
          onClick={() => onSelect(organisation.id)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {selected ? "Unselect" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}

  const RenderBloodInventory = ({
    inventory,
  }: {
    inventory: { blood_type: string; total_units: number }[];
  }) => {

    return (
      <div className="mt-3">
        <div className="flex items-center mb-1.5">
          <Droplet className="h-4 w-4 text-red-500 mr-1.5" />
          <span className="text-sm font-medium">Blood Inventory</span>
        </div>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-1.5">
            {inventory?.map((item, ind) => (
              <Tooltip key={ind}>
                <TooltipTrigger asChild>
                  <div
                    className={`text-center py-1 px-1.5 rounded-md text-xs font-medium ${item.total_units > 0 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {item.blood_type}: {item.total_units}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {item.total_units} units of {item.blood_type} blood
                    available
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    );
  };
