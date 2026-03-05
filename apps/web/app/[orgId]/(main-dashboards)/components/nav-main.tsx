"use client";

import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export function NavMain({
  items,
}: Readonly<{
  items: readonly {
    label: string;
    path: string;
    icon?: Icon;
  }[];
}>) {
  const pathname = usePathname();
  const params = useParams<{ orgId?: string }>();
  const orgId = params.orgId ?? "";

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const href = `/${orgId}${item.path}`;
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  className="py-2 h-auto"
                  asChild
                  isActive={pathname === href}
                >
                  <Link href={href}>
                    {item.icon && <item.icon strokeWidth={1.8} />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
