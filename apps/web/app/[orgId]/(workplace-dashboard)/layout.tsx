import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { WorkplaceSidebar } from "./components/workplace-sidebar";

export default function WorkPlaceDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <WorkplaceSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
