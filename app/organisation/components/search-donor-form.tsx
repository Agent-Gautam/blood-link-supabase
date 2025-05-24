import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchDonor } from "../camps/actions";

function SearchDonorForm({ onSearch }: { onSearch: (result: any) => void }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSearch = async (formData: FormData) => {
    const result = await searchDonor(formData);
    onSearch(result);
  };

  return (
    <form action={handleSearch} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter donor's email"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter donor's phone number"
        />
      </div>
      <Button type="submit" className="w-full">
        Search Donor
      </Button>
    </form>
  );
}

export default SearchDonorForm;
