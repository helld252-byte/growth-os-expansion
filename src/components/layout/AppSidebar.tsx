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
  { icon: Layers, label: "Expansion Pipeline", path: "/channels" },
  { icon: CheckSquare, label: "Operational Tasks", path: "/tasks" },
  { icon: Library, label: "Intelligence Hub", path: "/hub" },
  { icon: BarChart3, label: "Performance Intel", path: "/reports" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="border-r border-white/[0.02] bg-sidebar/40 backdrop-blur-2xl">
      <SidebarHeader className="py-8 px-6">
        <div className="flex items-center gap-4">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg ring-1 ring-white/5">
            <Zap className="size-4 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg leading-none tracking-tight text-foreground">Growth OS</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.12em] mt-1.5">Ops Unit-01</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[9px] uppercase font-semibold tracking-[0.15em] text-muted-foreground mb-2">Nav Command</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-10 rounded-lg transition-all duration-300 px-3",
                    pathname === item.path 
                      ? "bg-primary/10 text-foreground shadow-[0_0_15px_rgba(139,92,246,0.1)] font-semibold" 
                      : "text-sidebar-foreground hover:bg-white/[0.02] hover:text-foreground font-medium"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-4", pathname === item.path ? "text-primary" : "text-muted-foreground/50")} />
                    <span className="tracking-tight ml-3 text-[13px]">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-[9px] uppercase font-semibold tracking-[0.15em] text-muted-foreground mb-2">Strategic</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-lg text-sidebar-foreground hover:bg-white/[0.02] hover:text-foreground px-3 font-medium">
                <Briefcase className="size-4 text-muted-foreground/40" />
                <span className="tracking-tight ml-3 text-[13px]">Market Intel</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-lg text-sidebar-foreground hover:bg-white/[0.02] hover:text-foreground px-3 font-medium">
                <ShieldCheck className="size-4 text-muted-foreground/40" />
                <span className="tracking-tight ml-3 text-[13px]">Compliance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 rounded-lg hover:bg-white/[0.02] transition-colors px-3 group">
              <Link href="/settings">
                <Settings className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-transform duration-500 group-hover:rotate-45" />
                <span className="font-medium tracking-tight ml-3 text-[13px] text-sidebar-foreground group-hover:text-foreground">System Config</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="mt-5 flex flex-col gap-2 px-3">
          <div className="flex items-center justify-between text-[8px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/40">
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