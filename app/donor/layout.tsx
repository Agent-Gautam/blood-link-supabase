import AppSideBar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Circle, HeartPlus, History, Home, MessageSquareDiff, Search } from "lucide-react";
import React from "react";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sideBarItems = [
    {
      title: "Home",
      url: "/donor",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Find Donation Camp",
      url: "/donor/donation-camps",
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: "Request Blood",
      url: "/donor/request",
      icon: <HeartPlus className="h-5 w-5" />,
    },
    {
      title: "Requests",
      url: "/donor/request/history",
      icon: <MessageSquareDiff className="h-5 w-5" />,
    },
    {
      title: "Donation History",
      url: "/donor/donation-history",
      icon: <History />
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
