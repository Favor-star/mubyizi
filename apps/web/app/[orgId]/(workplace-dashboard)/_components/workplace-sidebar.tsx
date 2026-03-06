"use client";
import {
  IconArrowLeft,
  IconCalendar,
  IconLayoutDashboard,
  IconMoneybag,
  IconPhoto,
  IconSelector,
  IconSettings,
  IconTools,
  IconUsers
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { NavMain } from "../../_components/nav-main";

export const WorkplaceSidebar = () => {
  const { isMobile } = useSidebar();
  const params = useParams<{ orgId?: string; workplaceId?: string }>();
  const workplaceId = params.workplaceId ?? "";

  const sidebarItems = [
    {
      label: "Overview",
      path: `/workplaces/${workplaceId}/overview`,
      icon: IconLayoutDashboard
    },
    {
      label: "Workers",
      path: `/workplaces/${workplaceId}/workers`,
      icon: IconUsers
    },
    {
      label: "Settings",
      path: `/workplaces/${workplaceId}/settings`,
      icon: IconSettings
    },
    {
      label: "Budget",
      path: `/workplaces/${workplaceId}/budget`,
      icon: IconMoneybag
    },
    {
      label: "Gallery",
      path: `/workplaces/${workplaceId}/gallery`,
      icon: IconPhoto
    },
    {
      label: "Timeline",
      path: `/workplaces/${workplaceId}/timeline`,
      icon: IconCalendar
    }
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-b border-border">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconTools className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{"Team alpha"}</span>
                <span className="truncate text-xs text-muted-foreground line-clamp-1">Big Corp LLC</span>
              </div>
              <IconSelector className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side={isMobile ? "bottom" : "right"} sideOffset={4}>
            <p className="px-3 py-2 text-sm ">Switch workplace</p>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <Button asChild>
          <Link href={".."}>
            <IconArrowLeft></IconArrowLeft>
            Go back to dashboard
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
