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
import { CalendarIcon, MapPinIcon } from "lucide-react";

interface CampCardProps {
  camp: {
    id: string;
    name: string;
    location: string;
    start_date: string;
    end_date: string;
    organisations?: { name: string } | null;
  };
  register: (id: string) => void;
  isRegistered: boolean;
}

export default function CampCard({ camp, register, isRegistered }: CampCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold line-clamp-1">
          {camp.name}
        </CardTitle>
        <CardDescription>
          {camp.organisations?.name && (
            <span className="font-medium">
              Organised by: {camp.organisations.name}
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
