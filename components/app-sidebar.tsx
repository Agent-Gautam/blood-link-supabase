"use client";

import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

type sidebarItem = {
  title: string;
  url: string;
  icon: React.JSX.Element;
};

type AppSideBarProps = {
  items: sidebarItem[];
};

export default function AppSideBar({ items }: AppSideBarProps) {
  const pathname = usePathname();
  return (
    <Sidebar className="border-r border-border top-[63px] z-40" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items &&
                items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          className={`flex items-center space-x-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-md ${
                            isActive ? "bg-accent text-accent-foreground" : ""
                          }`}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
