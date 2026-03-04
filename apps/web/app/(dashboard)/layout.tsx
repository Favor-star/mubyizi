import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { AppSidebar } from "./components/app-sidebar";
import { DashboardsHeader } from "./components/dashboard-header";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full">
        <DashboardsHeader />
        <section className="p-4">{children}</section>
      </main>
    </SidebarProvider>
  );
}
