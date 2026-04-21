"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  Library, 
  BarChart3, 
  Settings,
  Zap,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarFooter
} from "@/components/ui/sidebar";

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", path: "/" },
  { icon: Layers, label: "Growth Channels", path: "/channels" },
  { icon: CheckSquare, label: "Operations", path: "/tasks" },
  { icon: Library, label: "Intelligence Hub", path: "/hub" },
  { icon: BarChart3, label: "Analytics", path: "/reports" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="border-r border-white/[0.03] bg-sidebar/50 backdrop-blur-3xl">
      <SidebarHeader className="py-6 px-5">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
            <Zap className="size-4 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-extrabold text-lg leading-none tracking-tight">Growth OS</span>
            <span className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1 opacity-60">Ops Unit</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mb-2">Nav Command</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-10 rounded-lg transition-all duration-300 px-3",
                    pathname === item.path 
                      ? "bg-primary/10 text-primary active-glow" 
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-4", pathname === item.path ? "text-primary" : "text-muted-foreground/60 group-hover:text-white")} />
                    <span className="font-bold tracking-tight ml-2 text-xs">{item.label}</span>
                    {pathname === item.path && <div className="ml-auto size-1 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mb-2">Strategic</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-lg text-muted-foreground hover:bg-white/[0.03] hover:text-white px-3">
                <Briefcase className="size-4 text-muted-foreground/60" />
                <span className="font-bold tracking-tight ml-2 text-xs">Market Intel</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-lg text-muted-foreground hover:bg-white/[0.03] hover:text-white px-3">
                <ShieldCheck className="size-4 text-muted-foreground/60" />
                <span className="font-bold tracking-tight ml-2 text-xs">Compliance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 rounded-lg hover:bg-white/[0.03] transition-colors px-3 group">
              <Link href="/settings">
                <Settings className="size-4 text-muted-foreground/60 group-hover:text-white group-hover:rotate-45 transition-transform" />
                <span className="font-bold tracking-tight ml-2 text-xs">System Config</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="mt-4 flex flex-col gap-1 px-3">
          <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-tighter text-muted-foreground/40">
            <span>Version</span>
            <span>2.5.0-A</span>
          </div>
          <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-primary/40 rounded-full" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
