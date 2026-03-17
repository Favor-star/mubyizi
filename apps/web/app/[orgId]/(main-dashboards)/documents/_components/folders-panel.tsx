import { IconPlus } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

const GENERAL_FOLDERS = [
  { name: "All Documents", count: 148, active: true },
  { name: "Contracts", count: 38 },
  { name: "Certifications", count: 29 },
  { name: "HR Policies", count: 15 },
  { name: "Safety & Compliance", count: 21 },
  { name: "Payslips & Finance", count: 45 },
];

const SITE_FOLDERS = [
  { name: "Site A — Nairobi CBD", count: 34 },
  { name: "Site B — Westlands", count: 22 },
  { name: "Site C — Mombasa Port", count: 28 },
  { name: "Site D — Kisumu Plant", count: 18 },
  { name: "Site E — Nakuru Farm", count: 26 },
];

export function FoldersPanel() {
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Folders</CardTitle>
        <Button size="sm" variant="outline">
          <IconPlus className="h-3.5 w-3.5 mr-1" />
          New Folder
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {/* General folders */}
        <ul>
          {GENERAL_FOLDERS.map((folder) => (
            <li key={folder.name}>
              <div
                className={`flex items-center justify-between px-4 py-2 text-sm ${
                  folder.active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span className="truncate">{folder.name}</span>
                <span
                  className={`ml-2 shrink-0 text-xs ${
                    folder.active ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {folder.count}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* By Site section */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            By Site
          </p>
        </div>
        <ul>
          {SITE_FOLDERS.map((folder) => (
            <li key={folder.name}>
              <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted">
                <span className="truncate">{folder.name}</span>
                <span className="ml-2 shrink-0 text-xs text-muted-foreground">{folder.count}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Expiring Soon section */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Expiring Soon
          </p>
        </div>
        <ul className="pb-2">
          <li>
            <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted">
              <span className="text-amber-600 dark:text-amber-400">Expires in 30 days</span>
              <span className="ml-2 shrink-0 text-xs text-amber-600 dark:text-amber-400">14</span>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted">
              <span className="text-destructive">Expired</span>
              <span className="ml-2 shrink-0 text-xs text-destructive">22</span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
