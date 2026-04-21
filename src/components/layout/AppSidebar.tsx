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
      <SidebarHeader className="py-8 px-6">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
            <Zap className="size-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-extrabold text-xl leading-none tracking-tight">Growth OS</span>
            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1.5 opacity-60">Ops Unit</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mb-3">Nav Command</SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-11 rounded-lg transition-all duration-300 px-3.5",
                    pathname === item.path 
                      ? "bg-primary/10 text-primary active-glow" 
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-4.5", pathname === item.path ? "text-primary" : "text-muted-foreground/60 group-hover:text-white")} />
                    <span className="font-bold tracking-tight ml-3 text-sm">{item.label}</span>
                    {pathname === item.path && <div className="ml-auto size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mb-3">Strategic</SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-11 rounded-lg text-muted-foreground hover:bg-white/[0.03] hover:text-white px-3.5">
                <Briefcase className="size-4.5 text-muted-foreground/60" />
                <span className="font-bold tracking-tight ml-3 text-sm">Market Intel</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-11 rounded-lg text-muted-foreground hover:bg-white/[0.03] hover:text-white px-3.5">
                <ShieldCheck className="size-4.5 text-muted-foreground/60" />
                <span className="font-bold tracking-tight ml-3 text-sm">Compliance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-11 rounded-lg hover:bg-white/[0.03] transition-colors px-3.5 group">
              <Link href="/settings">
                <Settings className="size-4.5 text-muted-foreground/60 group-hover:text-white group-hover:rotate-45 transition-transform" />
                <span className="font-bold tracking-tight ml-3 text-sm">System Config</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="mt-5 flex flex-col gap-1.5 px-3.5">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter text-muted-foreground/40">
            <span>Version</span>
            <span>2.5.0-A</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-primary/40 rounded-full" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
