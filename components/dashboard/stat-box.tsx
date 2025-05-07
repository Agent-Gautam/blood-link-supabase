import { DropletIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
type StatBoxProps = {
  heading: string;
  data: number | string;
  icon: any;
  additional?: any;
};

export default async function StatBox({
  heading,
  data,
  icon,
  additional,
}: StatBoxProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{heading}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data}</div>
        <div className="text-xs text-muted-foreground">{additional}</div>
      </CardContent>
    </Card>
  );
}
