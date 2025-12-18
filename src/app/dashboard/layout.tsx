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
        <div className="w-full max-w-6xl mx-auto">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-sidebar-border" />
            <span>Dashboard</span>
          </header>
        </div>

        <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </ReduxSidebarProvider>
  );
}
