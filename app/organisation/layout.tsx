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
  Plus,
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
      title: "Create camp",
      url: "/organisation/camps/update",
      icon: <Plus className="h-5 w-5" />,
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
        <AppSideBar items={sideBarItems} />
      <div className="w-full flex min-h-screen p-5 relative">
        {/* Sidebar */}
        <SidebarTrigger className="absolute top-0 left-0" />
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
