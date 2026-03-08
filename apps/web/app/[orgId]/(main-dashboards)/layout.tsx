import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { AppSidebar } from "./_components/app-sidebar";
import { DashboardsHeader } from "./_components/dashboard-header";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full">
        <DashboardsHeader />
        <section className="">{children}</section>
      </main>
    </SidebarProvider>
  );
}
