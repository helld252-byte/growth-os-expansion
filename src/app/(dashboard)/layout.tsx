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
          <header className="h-14 flex items-center justify-between px-6 bg-background/20 backdrop-blur-xl sticky top-0 z-40 border-b border-white/[0.02]">
            <div className="flex items-center gap-5">
              <SidebarTrigger className="text-tertiary hover:text-primary transition-colors" />
              <div className="h-4 w-px bg-white/5 hidden sm:block" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">Unit-01</span>
                <span className="text-tertiary/20 text-xs">/</span>
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
                  {getSectionLabel(pathname)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center bg-white/[0.01] border border-white/[0.03] rounded-lg px-3 py-1.5 gap-3 cursor-pointer hover:bg-white/[0.03] transition-colors group">
                  <Search className="size-3.5 text-tertiary/60 group-hover:text-primary transition-colors" />
                  <span className="text-[11px] font-medium tracking-tight text-secondary pr-6">Search Strategic Assets</span>
                  <span className="text-[9px] font-medium text-tertiary/30 tracking-widest">⌘K</span>
                </div>
                <div className="relative cursor-pointer text-tertiary hover:text-primary transition-colors p-1.5">
                  <Bell className="size-4" />
                  <span className="absolute top-1.5 right-1.5 size-1.5 bg-accent rounded-full shadow-[0_0_8px_hsl(var(--accent)/0.5)]" />
                </div>
              </div>
              
              <div className="h-4 w-px bg-white/[0.05]" />
              
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="size-7 rounded-full overflow-hidden border border-white/[0.05] group-hover:border-accent/40 transition-all opacity-90 group-hover:opacity-100">
                  <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <ChevronDown className="size-3 text-tertiary group-hover:text-primary transition-colors" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}