import AppSideBar from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Boxes,
  Circle,
  HeartPlus,
  History,
  Home,
  MessageSquareDiff,
  Search,
  Tent,
} from "lucide-react";
import React from "react";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const sideBarItems = [
    {
        title: "Home",
        url: "/organisation",
        icon: <Home className="h-5 w-5" />,
    },
    {
        title: "Camps",
        url: "/organisation/camps",
        icon: <Tent className="h-5 w-5" />,
    },
    {
        title: "Requests",
        url: "/organisation/requests",
        icon: <HeartPlus className="h-5 w-5" />, // HeartPlus fits for donation/requests
    },
    {
        title: "Inventory",
        url: "/organisation/inventory",
        icon: <Boxes className="h-5 w-5" />, // Boxes is suitable for inventory
    },
];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSideBar items={sideBarItems} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center">
            <SidebarTrigger className="mr-2" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
