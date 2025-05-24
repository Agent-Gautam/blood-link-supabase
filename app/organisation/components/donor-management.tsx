import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  UsersIcon,
  AlertCircleIcon,
  ClockIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import DonorDialog from "./donor-checkin";

export default function DonorsManagement({ donorList, campId }: { donorList: any[], campId: string}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Donor List</CardTitle>
            <CardDescription>
              All registered donors for this camp
            </CardDescription>
          </div>
          <div className="mt-2 sm:mt-0 flex justify-between items-center gap-2">
            <DonorDialog campId={campId} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Time Slot</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donorList.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell className="font-medium">{donor.user.first_name + " " + donor.user.last_name}</TableCell>
                  <TableCell>{donor.blood_type}</TableCell>
                  <TableCell>{formatDate(donor.donation_date).time}</TableCell>
                  {/* <TableCell>{getStatusBadge(donor.status)}</TableCell> */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Donor Status Summary</CardTitle>
          <CardDescription>Overview of donor processing status</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Completed</span>
            </div>
            <Badge variant="outline">3</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center">
              <AlertCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <span>Processing</span>
            </div>
            <Badge variant="outline">2</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span>Registered</span>
            </div>
            <Badge variant="outline">5</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
