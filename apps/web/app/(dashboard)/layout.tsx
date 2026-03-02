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
      {/* <div className="flex h-screen overflow-hidden bg-background"> */}
      {/* <Sidebar /> */}

      {/* <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 ">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div> */}
    </SidebarProvider>
  );
}
