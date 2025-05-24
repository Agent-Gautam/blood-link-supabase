import InventoryDetails from "./inventory-details";

export default function BloodCollection({ donations }: { donations: any[] }) {
  if (donations.length == 0) {
    return (
      <div>
        Nothing to show
      </div>
    )
  }
  const inventoryDetails = donations.reduce((acc: any, donation: any) => {
    const existing = acc.find(
      (item: any) => item.blood_type === donation.blood_type
    );
    if (existing) {
      existing.total_units += donation.units_donated;
      existing.last_updated =
        donation.donation_date > existing.last_updated
          ? donation.donation_date
          : existing.last_updated;
    } else {
      acc.push({
        blood_type: donation.blood_type,
        total_units: donation.units_donated,
        last_updated: donation.donation_date,
      });
    }
    return acc;
  }, []);

  return (
    <div>
        <InventoryDetails inventoryDetails={inventoryDetails} />
    </div>
  );
}
