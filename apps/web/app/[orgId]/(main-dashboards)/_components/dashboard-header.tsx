"use client";

import { usePathname } from "next/navigation";
import { IconBell, IconHelp, IconChevronRight } from "@tabler/icons-react";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

import { ProfileDropdown } from "@/shared/components/profile-dropdown";
import { SearchDialog } from "./search-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@workspace/ui/components/breadcrumb";
import React from "react";
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  workplaces: "Workplaces",
  workforce: "Workforce",
  financials: "Financials",
  reports: "Reports",
  settings: "Settings",
  documents: "Documents",
  payroll: "Payroll",
  create: "Create",
  edit: "Edit",
  overview: "Overview",
  workers: "Workers",
  attendance: "Attendance",
  budget: "Budget",
  gallery: "Gallery",
  timeline: "Timeline"
};

export function DashboardsHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  console.log("Segments:", segments);
  const orgId = segments[0];
  const pathSegments = segments.slice(1);
  console.log("Path segments after orgId:", pathSegments);
  const crumbs = pathSegments.map((seg, i) => ({
    label: SEGMENT_LABELS[seg] ?? seg,
    href: `/${orgId}/${pathSegments.slice(0, i + 1).join("/")}`,
    isCurrent: i === pathSegments.length - 1
  }));

  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-sidebar px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <Breadcrumb className="text-muted-foreground">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/${orgId}/dashboard`}
                className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((crumb) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem key={crumb.href}>
                  {crumb.isCurrent ? (
                    <BreadcrumbPage className="font-medium text-foreground">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <SearchDialog />

        <Button aria-label="Notifications" size={"icon"} variant={"ghost"} className="relative">
          <IconBell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-destructive" />
        </Button>

        <Button aria-label="Help" size={"icon"} variant={"ghost"} className="hidden sm:flex">
          <IconHelp className="h-4 w-4" />
        </Button>

        <ModeToggle />
        <ProfileDropdown
          user={{
            name: "Charlie Nguyen",
            email: "charlie@company.com",
            avatar: "https://github.com/shadcn.png"
          }}>
          <Avatar className="h-6 w-6 border border-border">
            <AvatarImage src={"https://github.com/shadcn.png"} alt={"Charlie Nguyen"} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
        </ProfileDropdown>
      </div>
    </header>
  );
}
