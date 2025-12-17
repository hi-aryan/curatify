import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ReduxSidebarProvider } from "@/components/redux-sidebar-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The Sidebar logic lives ONLY here
    <ReduxSidebarProvider>
      <AppSidebar />

      {/* SidebarInset is crucial here: it handles the layout shift 
          so your content sits next to the sidebar, not under it. */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <span>Dashboard</span>
        </header>

        <div className="p-4">{children}</div>
      </SidebarInset>
    </ReduxSidebarProvider>
  );
}
