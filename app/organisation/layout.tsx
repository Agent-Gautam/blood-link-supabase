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
  LayoutDashboard,
  List,
} from "lucide-react";
import React from "react";
import type { SidebarItem } from "@/components/app-sidebar";

export default function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sideBarItems: SidebarItem[] = [
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
      subItems: [
        {
          title: "Dashboard",
          url: "/organisation/inventory",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          title: "All Inventory",
          url: "/organisation/inventory/all",
          icon: <List className="h-4 w-4" />,
        },
      ],
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
