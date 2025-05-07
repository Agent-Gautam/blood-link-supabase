import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DonationHistoryProps = {
  id: string;
  donation_date: string;
  donation_camps: { location: string };
  units_donated: number;
  status: string;
  organisations: { name: string };
};

export default async function DonationHistory({
  donationData,
}: {
  donationData: DonationHistoryProps[] | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>Your recent blood donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donationData?.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{donation.donation_date}</TableCell>
                <TableCell>{donation.donation_camps.location}</TableCell>
                <TableCell>{donation.units_donated}</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">{donation.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
