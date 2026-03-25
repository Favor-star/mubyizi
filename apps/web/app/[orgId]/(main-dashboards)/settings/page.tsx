import { IconDeviceFloppy } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { SettingsNav } from "./_components/settings-nav";
import { SettingsForm } from "./_components/settings-form";
import { PageHeader } from "../_components/page-header";

export default function SettingsPage() {
  return (
    <section className="space-y-3 w-full">
      <PageHeader title="Settings" description="Configure your organization preferences and account details">
        <Button size="lg" variant="default">
          <IconDeviceFloppy />
          Save Settings
        </Button>
      </PageHeader>

      <section className="p-4">
        <article className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
          <SettingsNav />
          <SettingsForm />
        </article>
      </section>
    </section>
  );
}
