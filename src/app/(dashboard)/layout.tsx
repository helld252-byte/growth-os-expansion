"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Search, Bell, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Map path to section label for the top breadcrumb/context
  const getSectionLabel = (path: string) => {
    if (path === "/") return "Command Center";
    if (path.startsWith("/channels")) return "Expansion Pipeline";
    if (path.startsWith("/tasks")) return "Operational Tasks";
    if (path.startsWith("/hub")) return "Intelligence Hub";
    if (path.startsWith("/reports")) return "Performance Intel";
    return "Operations";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
        <AppSidebar />
        <SidebarInset className="flex flex-col overflow-hidden bg-transparent">
          {/* Streamlined Context Header */}
          <header className="h-14 flex items-center justify-between px-6 bg-background/20 backdrop-blur-xl sticky top-0 z-40 border-b border-white/[0.03]">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-white transition-colors" />
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Unit-01</span>
                <span className="text-muted-foreground/30 text-xs">/</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                  {getSectionLabel(pathname)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-muted-foreground/60">
                <div className="hidden sm:flex items-center bg-white/[0.03] border border-white/[0.05] rounded-lg px-2 py-1 gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                  <Search className="size-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider pr-4">Global Search</span>
                  <span className="text-[8px] font-black opacity-30">⌘K</span>
                </div>
                <div className="relative cursor-pointer hover:text-white transition-colors p-1">
                  <Bell className="size-3.5" />
                  <span className="absolute top-1 right-1 size-1 bg-accent rounded-full shadow-[0_0_5px_hsl(var(--accent))]" />
                </div>
              </div>
              
              <div className="h-5 w-px bg-white/[0.05]" />
              
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="size-7 rounded-full overflow-hidden border border-white/10 group-hover:border-accent/40 transition-all">
                  <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <ChevronDown className="size-3 text-muted-foreground/40 group-hover:text-white" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
