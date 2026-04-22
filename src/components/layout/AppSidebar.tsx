
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
  Briefcase,
  Megaphone,
  Handshake,
  ShieldAlert
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

const commandItems = [
  { icon: LayoutDashboard, label: "Command Center", path: "/" },
];

const growthItems = [
  { icon: Layers, label: "Expansion Pipeline", path: "/channels" },
  { icon: Megaphone, label: "Campaign Engine", path: "/campaigns" },
  { icon: Handshake, label: "Strategic Partnerships", path: "/partnerships" },
];

const operationsItems = [
  { icon: CheckSquare, label: "Operational Tasks", path: "/tasks" },
  { icon: Library, label: "Intelligence Hub", path: "/hub" },
];

const analyticsItems = [
  { icon: BarChart3, label: "Performance Intel", path: "/reports" },
];

interface AppSidebarProps {
  isAdmin?: boolean;
}

export function AppSidebar({ isAdmin }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="border-r border-white/[0.02] bg-sidebar/40 backdrop-blur-2xl">
      <SidebarHeader className="py-10 px-6">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg ring-1 ring-white/10">
            <Zap className="size-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xl leading-none tracking-tight text-tier-1">Growth OS</span>
            <span className="text-[10px] text-tier-3 font-semibold uppercase tracking-[0.15em] mt-2">Ops Unit-01</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-5">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-tier-4 mb-3">Main Command</SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            {commandItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-11 rounded-xl transition-all duration-300 px-3.5",
                    pathname === item.path 
                      ? "bg-primary/10 text-tier-1 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold" 
                      : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1 font-medium"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-4.5", pathname === item.path ? "text-primary" : "text-tier-3/60")} />
                    <span className="tracking-tight ml-3.5 text-[14px]">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-tier-4 mb-3">Growth Units</SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            {growthItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-11 rounded-xl transition-all duration-300 px-3.5",
                    pathname === item.path 
                      ? "bg-primary/10 text-tier-1 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold" 
                      : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1 font-medium"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-4.5", pathname === item.path ? "text-primary" : "text-tier-3/60")} />
                    <span className="tracking-tight ml-3.5 text-[14px]">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-tier-4 mb-3">Operations</SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            {operationsItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-11 rounded-xl transition-all duration-300 px-3.5",
                    pathname === item.path 
                      ? "bg-primary/10 text-tier-1 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold" 
                      : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1 font-medium"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-4.5", pathname === item.path ? "text-primary" : "text-tier-3/60")} />
                    <span className="tracking-tight ml-3.5 text-[14px]">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-primary mb-3">System Control</SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton className="h-11 rounded-xl text-primary/80 hover:bg-primary/10 hover:text-primary px-3.5 font-semibold border border-primary/10">
                  <ShieldAlert className="size-4.5" />
                  <span className="tracking-tight ml-3.5 text-[14px]">Admin Console</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-tier-4 mb-3">Analysis</SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            {analyticsItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-11 rounded-xl transition-all duration-300 px-3.5",
                    pathname === item.path 
                      ? "bg-primary/10 text-tier-1 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold" 
                      : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1 font-medium"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-4.5", pathname === item.path ? "text-primary" : "text-tier-3/60")} />
                    <span className="tracking-tight ml-3.5 text-[14px]">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-7">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-11 rounded-xl hover:bg-white/[0.03] transition-colors px-3.5 group">
              <Link href="/settings">
                <Settings className="size-4.5 text-tier-3/40 group-hover:text-tier-1 transition-transform duration-700 group-hover:rotate-90" />
                <span className="font-medium tracking-tight ml-3.5 text-[14px] text-tier-2 group-hover:text-tier-1">System Config</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="mt-6 flex flex-col gap-2.5 px-3.5">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.25em] text-tier-4">
            <span>Version</span>
            <span>2.5.0-A</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-primary/40 rounded-full" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
