"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Search, Bell, Sparkles, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
        <AppSidebar />
        <SidebarInset className="flex flex-col overflow-hidden bg-transparent">
          {/* Header */}
          <header className="h-20 flex items-center justify-between px-8 bg-background/20 backdrop-blur-2xl sticky top-0 z-40 border-b border-white/[0.03]">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <SidebarTrigger className="md:hidden" />
              <div className="relative w-full max-w-md group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <Search className="size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  placeholder="Command search..." 
                  className="pl-10 h-11 bg-white/[0.03] border-white/[0.05] focus-visible:ring-primary/40 focus-visible:bg-white/[0.05] rounded-xl transition-all font-medium placeholder:text-muted-foreground/50" 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 border border-white/10 px-1.5 py-0.5 rounded-md bg-white/[0.02] text-[10px] text-muted-foreground font-bold">
                  <Command className="size-2.5" /> K
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                <span className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Live Ops</span>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5 transition-all relative rounded-xl h-11 w-11">
                <Bell className="size-5" />
                <span className="absolute top-3 right-3 size-2 bg-accent rounded-full border-2 border-background shadow-lg" />
              </Button>
              <div className="h-6 w-px bg-white/[0.05] mx-2" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-white leading-none">James Sterling</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Chief of Operations</span>
                </div>
                <div className="size-11 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                  JS
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
