import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CampCardProps {
  camp: {
    id: string;
    name: string;
    location: string;
    start_date: string;
    end_date: string;
    organisation_name: string;
  };
  register: (id: string) => void;
  isRegistered: boolean;
  caller?: string;
}

export default function CampCard({
  camp,
  register,
  isRegistered,
  caller,
}: CampCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto mb-4 relative">
      <div className="absolute top-4 right-4">
        <Link
          href={`/info/camp/${camp.id}?backTo=${caller}`}
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="icon">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold line-clamp-1">
          {camp.name}
        </CardTitle>
        <CardDescription>
          {camp.organisation_name && (
            <span className="font-medium">
              Organised by: {camp.organisation_name}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>
              {new Date(camp.start_date).toLocaleDateString()} -{" "}
              {new Date(camp.end_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{camp.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form>
          <SubmitButton
            disabled={isRegistered}
            formAction={register.bind(null, camp.id)}
            pendingText={"Registering"}
          >
            {isRegistered ? "Registered" : "Register"}
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  );
}
