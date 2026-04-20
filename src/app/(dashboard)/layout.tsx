"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Search, Bell, Sparkles } from "lucide-react";
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
        <SidebarInset className="flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <SidebarTrigger className="md:hidden" />
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  placeholder="Search opportunities, tasks, docs..." 
                  className="pl-10 h-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 w-full transition-all" 
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors relative">
                <Bell className="size-5" />
                <span className="absolute top-2.5 right-2.5 size-2 bg-accent rounded-full border-2 border-background" />
              </Button>
              <div className="h-6 w-px bg-white/5 mx-2" />
              <Button variant="default" className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 gap-2 h-9 px-4 font-semibold shadow-none">
                <Sparkles className="size-4 fill-primary/20" />
                <span>AI Assistant</span>
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}