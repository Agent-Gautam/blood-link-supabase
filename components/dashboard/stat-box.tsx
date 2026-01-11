import { DropletIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type StatBoxProps = {
  heading: string;
  data: number | string;
  icon: any;
  additional?: any;
  className?: string;
  isLoading?: boolean;
};

export default function StatBox({
  heading,
  data,
  icon,
  additional,
  className = "",
  isLoading = false,
}: StatBoxProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{heading}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{data}</div>
            <div className="text-xs text-muted-foreground">{additional}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
