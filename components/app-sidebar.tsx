"use client";

import * as React from "react";

import { NavHeader } from "@/components/nav-header";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Icons } from "@/constants/icons";

const data = {
  navMain: [
    {
      title: "Products",
      url: "#",
      icon: Icons.ProductsIcon,
      isActive: true,
      items: [
        {
          title: "List",
          url: "/dashboard/products",
        },
        {
          title: "Details",
          url: "/dashboard/products/1",
        },
        {
          title: "Create",
          url: "/dashboard/products/new",
        },
        {
          title: "Edit",
          url: "/dashboard/products/1/edit",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
