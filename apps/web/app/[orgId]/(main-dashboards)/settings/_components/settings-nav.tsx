import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";

const MENU_ITEMS = [
  "Organization Profile",
  "Payroll & Billing",
  "Attendance Rules",
  "Leave Policy",
  "Notification Prefs",
  "Users & Permissions",
  "Localization",
  "Integrations"
];

const PLAN_LIMITS = [
  { label: "Workers", used: 320, total: 500 },
  { label: "Sites", used: 12, total: 20 },
  { label: "Storage", used: "4.2 GB", total: "10 GB", progress: 42 }
];

export function SettingsNav() {
  return (
    <aside className="space-y-4">
      {/* Settings Menu */}
      <Card>
        <CardContent className="p-2 space-y-0.5">
          <p className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Settings Menu
          </p>
          {MENU_ITEMS.map((item, i) => (
            <Button
              key={item}
              variant={i === 0 ? "outline" : "ghost"}
              size="sm"
              className="w-full justify-start font-normal">
              {item}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start font-normal text-destructive hover:text-destructive">
            Danger Zone
          </Button>
        </CardContent>
      </Card>

      {/* Current Plan */}
      <Card className="border-violet-500/20 bg-violet-500/5">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Plan</p>
          <div className="rounded-md border border-violet-500/30 bg-violet-500/10 px-3 py-2">
            <p className="font-bold text-violet-700 dark:text-violet-300">Pro Plan</p>
            <p className="text-xs text-muted-foreground">Renews Apr 1, 2026</p>
          </div>
          <Button variant="default" size="sm" className="w-full bg-violet-600 hover:bg-violet-700">
            Upgrade to Enterprise
          </Button>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Plan Limits</p>
            {PLAN_LIMITS.map((limit) => (
              <div key={limit.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{limit.label}:</span>
                  <span>
                    {limit.used} / {limit.total}
                  </span>
                </div>
                {"progress" in limit && <Progress value={limit.progress} className="h-1.5" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardContent className="p-4 space-y-2">
          <p className="text-destructive uppercase font-bold">Danger Zone</p>
          <Button
            variant="outline"
            className="w-full border-destructive dark:border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20
            ">
            Deactivate Organization
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Organization
          </Button>
          <p className="text-xs text-destructive">This action is irreversible.</p>
        </CardContent>
      </Card>
    </aside>
  );
}
