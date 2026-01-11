"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  ExternalLink,
  Navigation,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { checkCampRegistration, registerForCamp } from "./actions";
import { toast } from "sonner";

interface CampCardProps {
  camp: {
    id: string;
    name: string | null;
    location: string | null;
    start_date: string;
    end_date: string;
    organisation_name?: string;
    distance_km?: number;
  };
  caller?: string;
}

export default function CampCard({ camp, caller }: CampCardProps) {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const checkRegistration = async () => {
      setIsCheckingRegistration(true);
      const result = await checkCampRegistration(camp.id);
      if (result.success) {
        setIsRegistered(result.data ?? false);
      } else {
        console.error("Error checking registration:", result.error);
        setIsRegistered(false);
      }
      setIsCheckingRegistration(false);
    };

    checkRegistration();
  }, [camp.id]);

  const handleRegister = async () => {
    startTransition(async () => {
      const result = await registerForCamp(camp.id);
      if (result.success) {
        setIsRegistered(true);
        toast.success("Successfully registered for the camp!");
      } else {
        toast.error(result.error || "Failed to register for the camp");
      }
    });
  };

  return (
    <Card className="w-full h-full flex flex-col relative">
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
          {camp.name || "Unnamed Camp"}
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
            <span>{camp.location || "Location not specified"}</span>
          </div>
          {camp.distance_km !== undefined && camp.distance_km !== null && (
            <div className="flex items-center text-muted-foreground">
              <Navigation className="h-4 w-4 mr-1 text-blue-500" />
              <span>{camp.distance_km.toFixed(1)} km away</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        {isCheckingRegistration ? (
          <Button disabled className="w-full" variant="outline">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Checking...
          </Button>
        ) : (
          <Button
            onClick={handleRegister}
            disabled={isRegistered === true || isPending}
            className="w-full"
            variant={isRegistered ? "secondary" : "default"}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : isRegistered ? (
              "Registered"
            ) : (
              "Register"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
