"use client";

import { usePathname } from "next/navigation";
import { IconSearch, IconBell, IconHelp, IconChevronRight } from "@tabler/icons-react";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

import { ProfileDropdown } from "@/shared/components/profile-dropdown";
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  workplaces: "Workplaces",
  workforce: "Workforce",
  financials: "Financials",
  reports: "Reports",
  settings: "Settings"
};

export function DashboardsHeader() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const label = SEGMENT_LABELS[segment] ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <span className="text-muted-foreground">Home</span>
        <IconChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium text-foreground">{label}</span>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <InputGroup className="max-w-xs hidden sm:flex">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">no results</InputGroupAddon>
        </InputGroup>

        <Button aria-label="Notifications" size={"icon"} variant={"ghost"} className="relative">
          <IconBell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-destructive" />
        </Button>

        <Button aria-label="Help" size={"icon"} variant={"ghost"}>
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
