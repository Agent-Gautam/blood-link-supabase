"use client";
//task : make table to sort rows according to columns
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Droplet, Loader, Plus } from "lucide-react";
import {
  addNewInventoryRecord,
  fetchAllInventory,
  updateInventoryRecord,
} from "../inventory/actions";
import { formatDate } from "@/lib/utils";
import TableSkeleton from "@/components/table-skeleton";
import { toast } from "sonner";
import { InventoryRecord } from "../types";
import EmptyState from "@/components/empty-state";

export default function InventoryTable({ org_id }: { org_id: string }) {
  const [allInventory, setAllInventory] = useState<InventoryRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fetchInventory = async () => {
    setLoading(true);
    const result = await fetchAllInventory(org_id);
    if (!result.success)
      toast.error(`Error fetching innvetory ${result.error}`);
    const inventories = result.data;
    setAllInventory(inventories);
    setLoading(false);
  };
  useEffect(() => {
    fetchInventory();
  }, [org_id]);

  const handleEditClick = (id: string, currentQuantity: number) => {
    setEditingId(id);
    setEditingQuantity(currentQuantity);
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingQuantity(undefined);
  };
  const handleSaveEdit = async () => {
    setLoading(true);
    if (editingId) {
      const result = await updateInventoryRecord(editingId, editingQuantity);
      setEditingId(null);
      setEditingQuantity(undefined);
      await fetchInventory();
      if (result.success) toast.success("Inventory Updated");
      else toast.error(`Eror updating inventoroy ${result.error}`);
    }
    setLoading(false);
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Update and manage your blood bank inventory.
          </p>
        </div>
        <AddInventory
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          org_id={org_id}
          fetchInventory={fetchInventory}
        />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : allInventory.length === 0 ? (
        <EmptyState
          title="No Inventory Yet"
          description="Your blood bank inventory is empty. Start by adding your first blood units to begin tracking and managing your stock effectively."
          icon={Droplet}
          buttonText="Add First Inventory"
          buttonIcon={Plus}
          onAdd={() => setDialogOpen(true)}
          footer={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["A+", "B+", "AB+", "O+"].map((type) => (
                <div
                  key={type}
                  className="flex flex-col items-center p-4 rounded-lg border border-dashed border-border bg-muted/30"
                >
                  <Droplet className="h-6 w-6 text-muted-foreground/50 mb-2" />
                  <span className="text-sm font-medium text-muted-foreground/70">
                    {type}
                  </span>
                  <span className="text-xs text-muted-foreground/50">
                    0 units
                  </span>
                </div>
              ))}
            </div>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Blood Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Droplet
                      className={`h-4 w-4 text-bloodRed ${item.blood_type.includes("-") ? "opacity-70" : ""}`}
                    />
                    {item.blood_type}
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      value={editingQuantity}
                      onChange={(e) =>
                        setEditingQuantity(parseInt(e.target.value))
                      }
                      className="w-24"
                      min="0"
                    />
                  ) : (
                    `${item.units} units`
                  )}
                </TableCell>
                <TableCell>
                  {item.last_updated
                    ? formatDate(item.last_updated).date
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {item.expiry_date ? formatDate(item.expiry_date).date : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === item.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        {editingId == item.id && loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(item.id, item.units)}
                    >
                      Update
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
type AddInventoryProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  org_id: string;
  fetchInventory: () => void;
};
function AddInventory({
  dialogOpen,
  setDialogOpen,
  org_id,
  fetchInventory,
}: AddInventoryProps) {
  const [newBloodType, setNewBloodType] = useState("A+");
  const [newQuantity, setNewQuantity] = useState<string>("");
  const [newExpiryDate, setNewExpiryDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  async function handleAddInventory() {
    setLoading(true);
    if (newBloodType && newQuantity && newExpiryDate) {
      const result = await addNewInventoryRecord(
        org_id,
        newBloodType,
        parseInt(newQuantity) || 0,
        newExpiryDate
      );
      if (result.success) toast.success("Inventory added");
      else toast.error(`Error adding inventory ${result.error}`);

      // Reset form fields
      setNewBloodType("A+");
      setNewQuantity("");
      setNewExpiryDate("");
      setDialogOpen(false);
    } else toast.error("Invalid inputs");
    setLoading(false);
    await fetchInventory();
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Blood Inventory</DialogTitle>
          <DialogDescription>
            Enter the details for the new blood units to add to inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bloodType" className="text-right">
              Blood Type
            </label>
            <Select
              value={newBloodType}
              onValueChange={(value) => setNewBloodType(value)}
            >
              <SelectTrigger id="bloodType" className="col-span-3">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="quantity" className="text-right">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              className="col-span-3"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              min="0"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="expiryDate" className="text-right">
              Expiry Date
            </label>
            <Input
              id="expiryDate"
              type="date"
              className="col-span-3"
              value={newExpiryDate}
              onChange={(e) => setNewExpiryDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddInventory} disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : "Add Inventory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
