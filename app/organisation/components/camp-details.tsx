import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, MapPinIcon, Edit } from "lucide-react";
import Link from "next/link";

type OngoingCampProps = {
  campData: {
    id: string;
    name: string;
    location: string;
    start_date: string;
    end_date: string;
  };
};

export default function CampDetailsShow({ campData }: OngoingCampProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-2xl font-bold">{campData.name}</h2>
            <div className="flex items-center mt-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>
                {formatDate(campData.start_date).date} •{" "}
                {formatDate(campData.start_date).time}
              </span>
            </div>
            <div className="flex items-center mt-1 text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{campData.location}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Link href={`/organisation/camps/update?id=${campData.id}`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Update Camp
              </Button>
            </Link>
            <Link href={`/info/camp/${campData.id}`}>
              <Button>Go to camp dashboard</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
