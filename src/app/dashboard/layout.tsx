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
          so the content sits next to the sidebar, not under it. */}
      <SidebarInset className="overflow-x-hidden">
        <div className="w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger />
          </header>
        </div>

        <main className="flex-1 w-full min-w-0 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </SidebarInset>
    </ReduxSidebarProvider>
  );
}
