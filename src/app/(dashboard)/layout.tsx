"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Search, Bell, Command, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Channels", path: "/channels" },
  { label: "Operations", path: "/tasks" },
  { label: "Hub", path: "/hub" },
  { label: "Analytics", path: "/reports" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
        <AppSidebar className="hidden lg:flex" />
        <SidebarInset className="flex flex-col overflow-hidden bg-transparent">
          {/* Centralized Mission Control Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-background/40 backdrop-blur-2xl sticky top-0 z-40 border-b border-white/[0.03]">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-2">
                <span className="font-headline font-black text-lg tracking-tighter">GrowthOS</span>
              </div>
            </div>

            {/* Centered Pill Navigation */}
            <nav className="hidden md:flex items-center bg-white/[0.03] border border-white/[0.05] rounded-full p-1 gap-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    pathname === item.path 
                      ? "bg-white/10 text-white shadow-lg" 
                      : "text-muted-foreground hover:text-white"
                  )}>
                    {pathname === item.path && <span className="mr-1.5 text-accent">●</span>}
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Search className="size-4 cursor-pointer hover:text-white transition-colors" />
                <div className="relative">
                  <Bell className="size-4 cursor-pointer hover:text-white transition-colors" />
                  <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-accent rounded-full" />
                </div>
              </div>
              
              <div className="h-6 w-px bg-white/[0.1]" />
              
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="size-8 rounded-full overflow-hidden border border-accent/20 group-hover:border-accent transition-all">
                  <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-[11px] font-bold text-white leading-none">James Sterling</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">Growth Executive</span>
                </div>
                <ChevronDown className="size-3 text-muted-foreground group-hover:text-white" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
