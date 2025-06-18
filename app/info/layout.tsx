import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";
import BackTo from "./components/back-to";
import { ReactNode } from "react";

interface InfoLayoutProps {
  children: ReactNode;
}

export default async function InfoLayout({ children }: InfoLayoutProps) {
  return (
    <div>
      <BackTo />
      {children}
    </div>
  );
}