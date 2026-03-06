"use client";

import { ProfileDropdown } from "@/shared/components/profile-dropdown";
import { IconDotsVertical } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@workspace/ui/components/sidebar";

export function NavUser({
  user
}: Readonly<{
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}>) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ProfileDropdown user={user} side={isMobile ? "bottom" : "right"}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar className="h-8 w-8 ">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        </ProfileDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
