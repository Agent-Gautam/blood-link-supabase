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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItem = {
  title: string;
  url: string;
  icon: React.JSX.Element;
  subItems?: SidebarItem[];
};

type AppSideBarProps = {
  items: SidebarItem[];
};

export default function AppSideBar({ items }: AppSideBarProps) {
  const pathname = usePathname();
  return (
    <Sidebar
      className="border-r border-border top-[63px] z-40"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items &&
                items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isActive =
                    pathname === item.url ||
                    (hasSubItems &&
                      item.subItems?.some(
                        (subItem) => pathname === subItem.url
                      )) ||
                    false;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive && !hasSubItems}
                      >
                        <Link
                          href={item.url}
                          className={`flex items-center space-x-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-md ${
                            isActive && !hasSubItems
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }`}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {hasSubItems && item.subItems && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => {
                            const isSubActive = pathname === subItem.url;
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                >
                                  <Link href={subItem.url}>
                                    {subItem.icon && (
                                      <span>{subItem.icon}</span>
                                    )}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
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
