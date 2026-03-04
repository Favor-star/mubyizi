"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
} from "@workspace/ui/components/sidebar";
import {
  IconLayoutDashboard,
  IconBuildingCommunity,
  IconUsers,
  IconWallet,
  IconChartBar,
  IconSettings,
  IconPlus,
  IconBriefcase2,
  IconHelp,
  IconClockCheck,
} from "@tabler/icons-react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Button } from "@workspace/ui/components/button";
import { OrgSwitcher } from "./org-switcher";
import { MOCK_ORGS } from "@/data/mock";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { path: "/attendance", label: "Attendance", icon: IconClockCheck },
  { path: "/workplaces", label: "Workplaces", icon: IconBuildingCommunity },
  { path: "/workforce", label: "Workforce", icon: IconUsers },
  { path: "/financials", label: "Financials", icon: IconWallet },
  { path: "/reports", label: "Reports", icon: IconChartBar },
] as const;

const NAV_SECONDARY_ITEMS = [
  { title: "Settings", url: "#", icon: IconSettings },
  { title: "Support & Community", url: "#", icon: IconUsers },
  { title: "Get help", url: "#", icon: IconHelp },
] as const;

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <div className="flex h-14 items-center gap-3 px-4 border-b border-sidebar-border pb-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-sidebar-primary">
            <IconBriefcase2 className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Mubyizi
            </span>
            <span className="text-[10px] text-muted-foreground">
              Owner Admin
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <OrgSwitcher orgs={MOCK_ORGS} />
        </SidebarGroup>
        <SidebarSeparator />
        <NavMain items={NAV_ITEMS} />
        <NavSecondary items={NAV_SECONDARY_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-sidebar-border p-3">
          <Button variant="default" className="w-full">
            <IconPlus />
            New Site
          </Button>
        </div>
        <NavUser
          user={{
            name: "Charlie Nguyen",
            email: "favour@gmail.com",
            avatar: "https://github.com/shadcn.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
