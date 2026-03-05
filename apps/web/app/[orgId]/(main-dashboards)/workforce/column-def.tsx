"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";

import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";

import { IconTrash, IconUserEdit } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/shared/components/data-table-column-header";
import { getInitials } from "@/shared/utils";

export type WorkerItem = {
  // From Users model
  id: string;
  name: string;
  occupation: string | null;
  occupationCategory: string;
  skillLevel: string;
  systemRole: string;
  phoneNumber: string | null;
  email: string | null;
  profileImage: string | null;
  accountStatus: "ACTIVE" | "PROVISIONAL";
  authUserId: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  // From OrgMembership
  role: "OWNER" | "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER";
  isActive: boolean;
  invitedBy: string | null;
  invitedAt: string | null;
  joinedAt: string;
  updatedAt: string;
  lastSeenAt: string | null;
};

const roleColors: Record<
  WorkerItem["role"],
  "link" | "destructive" | "default" | "secondary" | "outline" | "ghost" | null | undefined
> = {
  OWNER: "destructive",
  ADMIN: "default",
  MANAGER: "secondary",
  MEMBER: "outline",
  VIEWER: "ghost"
};

export const workersColumns: ColumnDef<WorkerItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Worker" />;
    },
    cell: ({ row }) => (
      <section className="flex gap-2">
        <Avatar className={"rounded-none after:rounded-none"}>
          <AvatarImage src={row.original.profileImage ?? undefined} className={"rounded-none "} />
          <AvatarFallback className={"rounded-none"}>{getInitials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-end   ">
          <span>{row.getValue("name")}</span>
          <Button variant={"link"} size={"sm"} className={"p-0 h-fit align-start justify-start text-muted-foreground"}>
            <Link href={"tel:" + (row.original.phoneNumber ?? "#")} className="text-[10px]">
              Tel: {row.original.phoneNumber ?? "N/A"}
            </Link>
          </Button>
        </div>
      </section>
    )
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant={roleColors[row.original.role]}>{row.original.role}</Badge>
  },
  {
    accessorKey: "accountStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.accountStatus === "ACTIVE" ? "default" : "outline"}>
        {row.original.accountStatus}
      </Badge>
    )
  },
  {
    accessorKey: "occupation",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Occupation" />
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined At" />,
    cell: ({ row }) => <span>{new Date(row.original.joinedAt).toLocaleDateString("en-RW")}</span>
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions id={row.original.id} />
  }
];

const Actions = ({ id }: { id: string }) => {
  return (
    <article className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"outline"} size={"icon-sm"}>
            <IconUserEdit strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit Worker</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"destructive"} size={"icon-sm"}>
            <IconTrash strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete worker</TooltipContent>
      </Tooltip>
    </article>
  );
};
