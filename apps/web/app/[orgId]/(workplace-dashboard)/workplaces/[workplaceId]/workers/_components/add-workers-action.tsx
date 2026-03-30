"use client";
import React from "react";
import { IconSearch, IconUserPlus, IconUserSearch, IconX } from "@tabler/icons-react";
import { DialogWrapper } from "@/shared/components/dialog-wrapper";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from "@workspace/ui/components/item";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { getInitials } from "@/shared/utils";
import { OrgRole } from "@workspace/api-client/enums";
import { DialogFooter } from "@workspace/ui/components/dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Mock data ────────────────────────────────────────────────────────────────

interface OrgWorker {
  id: string;
  name: string;
  jobTitle: string;
  role: OrgRole;
}

const MOCK_ORG_WORKERS: OrgWorker[] = [
  { id: "1", name: "Jean Pierre Habimana", jobTitle: "Site Foreman", role: OrgRole.MANAGER },
  { id: "2", name: "Alice Uwimana", jobTitle: "Electrician", role: OrgRole.MEMBER },
  { id: "3", name: "Robert Mugisha", jobTitle: "Plumber", role: OrgRole.MEMBER },
  { id: "4", name: "Grace Ineza", jobTitle: "Civil Engineer", role: OrgRole.ADMIN },
  { id: "5", name: "Patrick Niyonkuru", jobTitle: "Machine Operator", role: OrgRole.MEMBER },
  { id: "6", name: "Diane Mukamana", jobTitle: "Safety Officer", role: OrgRole.MANAGER },
  { id: "7", name: "Eric Habimana", jobTitle: "Carpenter", role: OrgRole.MEMBER },
  { id: "8", name: "Marie Claire Uwase", jobTitle: "Surveyor", role: OrgRole.MEMBER },
  { id: "9", name: "Joseph Nzeyimana", jobTitle: "Driver", role: OrgRole.MEMBER },
  { id: "10", name: "Solange Kayitesi", jobTitle: "Administrative Staff", role: OrgRole.VIEWER },
  { id: "11", name: "Claude Bizimana", jobTitle: "Welder", role: OrgRole.MEMBER },
  { id: "12", name: "Immaculée Ndayishimiye", jobTitle: "Accountant", role: OrgRole.MANAGER },
  {
    id: "13",
    name: "Fabrice Nshimiyimana",
    jobTitle: "Procurement Officer",
    role: OrgRole.ADMIN
  },
  { id: "14", name: "Sandrine Mukarubuga", jobTitle: "HR Coordinator", role: OrgRole.VIEWER },
  { id: "15", name: "Emmanuel Niyigena", jobTitle: "IT Support", role: OrgRole.MEMBER },
  { id: "16", name: "Alice Uwimana", jobTitle: "Electrician", role: OrgRole.MEMBER },
  { id: "17", name: "Robert Mugisha", jobTitle: "Plumber", role: OrgRole.MEMBER },
  { id: "18", name: "Grace Ineza", jobTitle: "Civil Engineer", role: OrgRole.ADMIN },
  { id: "19", name: "Patrick Niyonkuru", jobTitle: "Machine Operator", role: OrgRole.MEMBER },
  { id: "20", name: "Diane Mukamana", jobTitle: "Safety Officer", role: OrgRole.MANAGER }
];

const ROLE_LABELS: Record<OrgRole, string> = {
  [OrgRole.OWNER]: "Owner",
  [OrgRole.ADMIN]: "Admin",
  [OrgRole.MANAGER]: "Manager",
  [OrgRole.MEMBER]: "Member",
  [OrgRole.VIEWER]: "Viewer"
};

// ─── Attach existing workers dialog ───────────────────────────────────────────

function AttachExistingDialog() {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return MOCK_ORG_WORKERS;
    return MOCK_ORG_WORKERS.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.jobTitle.toLowerCase().includes(q) ||
        ROLE_LABELS[w.role].toLowerCase().includes(q)
    );
  }, [search]);

  const selectedWorkers = MOCK_ORG_WORKERS.filter((w) => selected.has(w.id));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deselect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <DialogWrapper
      title="Attach existing workers"
      description="Select one or more workers from your organisation to assign to this workplace."
      trigger={
        <Item variant="outline" asChild>
          <Button className="h-fit" variant="outline">
            <ItemMedia variant="image">
              <IconUserSearch size={40} strokeWidth={1} className="w-full size-10 text-primary" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Attach existing worker</ItemTitle>
              <ItemDescription className="text-wrap">
                Assign an existing worker profile to this workplace.
              </ItemDescription>
            </ItemContent>
          </Button>
        </Item>
      }>
      {/* Two-panel grid */}
      <div className=" sticky top-0 scrollbar_styles max-h-[calc(100vh-300px)] overflow-y-auto  grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden min-h-80 ">
        {/* ── Left: selected workers ── */}
        <section className="flex flex-col border-b sm:border-b-0 sm:border-r border-border ">
          <hgroup className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-muted/30">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Selected</h2>
            <div className="flex gap-2 items-center">
              {selected.size > 0 && (
                <Badge variant="secondary" className="text-xs h-5">
                  {selected.size}
                </Badge>
              )}
              <Button
                variant={"ghost"}
                size={"xs"}
                onClick={() => setSelected(new Set())}
                disabled={selected.size === 0}>
                Clear all
              </Button>
            </div>
          </hgroup>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {selectedWorkers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <IconUserSearch size={28} className="text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">No workers selected yet.</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pick from the list on the right.</p>
              </div>
            ) : (
              selectedWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center gap-2 p-2 rounded-md border border-border bg-background hover:bg-muted/30 transition-colors group">
                  <Avatar className="h-7 w-7 shrink-0 rounded-full">
                    <AvatarFallback className="text-[10px]">{getInitials(worker.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">{worker.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate leading-tight">
                      {worker.jobTitle}
                      <span className="text-muted-foreground/60"> - </span>
                      {ROLE_LABELS[worker.role]}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-xs" onClick={() => deselect(worker.id)}>
                    <IconX size={12} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Right: worker list with search ── */}
        <div className="flex flex-col">
          <div className="px-2 py-2 border-b border-border bg-muted/30">
            <div className="relative">
              <IconSearch
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                className="pl-8 h-8 text-xs"
                placeholder="Search by name, title or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <p className="text-xs text-muted-foreground">No workers match &ldquo;{search}&rdquo;</p>
              </div>
            ) : (
              filtered.map((worker, i) => {
                const isSelected = selected.has(worker.id);
                return (
                  <React.Fragment key={worker.id}>
                    <button
                      onClick={() => toggle(worker.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/40 ${
                        isSelected ? "bg-primary/5" : ""
                      }`}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggle(worker.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0"
                      />
                      <Avatar className="h-7 w-7 shrink-0 rounded-full">
                        <AvatarFallback className="text-[10px]">{getInitials(worker.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate leading-tight">{worker.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate leading-tight">
                          {worker.jobTitle}
                          <span className="text-muted-foreground/60"> — </span>
                          {ROLE_LABELS[worker.role]}
                        </p>
                      </div>
                    </button>
                    {i < filtered.length - 1 && <Separator />}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <DialogFooter className="items-center">
        <p className="text-sm text-muted-foreground">
          {selected.size === 0 ? (
            "No workers selected"
          ) : (
            <>
              <span className="font-medium text-foreground">{selected.size}</span> worker
              {selected.size !== 1 ? "s" : ""} selected
            </>
          )}
        </p>
        <Button disabled={selected.size === 0}>
          Assign {selected.size > 0 ? `${selected.size} worker${selected.size !== 1 ? "s" : ""}` : "workers"}
        </Button>
      </DialogFooter>
    </DialogWrapper>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export const AddWorkersModal = () => {
  const path = usePathname();
  return (
    <DialogWrapper
      trigger={
        <Button variant="default" size="lg">
          <IconUserPlus />
          Add Worker
        </Button>
      }
      title="Add worker to this workplace"
      description="Create a new worker profile or assign an existing organisation member.">
      <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Item variant="outline" asChild>
          <Button className="h-fit" variant="outline" asChild>
            <Link href={path + "/create"}>
              <ItemMedia variant="image" className=" p-1">
                <IconUserPlus size={40} strokeWidth={1.5} className="w-full size-10 text-primary" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Add new worker</ItemTitle>
                <ItemDescription className="text-wrap">
                  Create a new worker profile and assign them to this workplace.
                </ItemDescription>
              </ItemContent>
            </Link>
          </Button>
        </Item>

        <AttachExistingDialog />
      </ItemGroup>
    </DialogWrapper>
  );
};
