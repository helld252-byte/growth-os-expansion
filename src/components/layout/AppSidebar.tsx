
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  Library, 
  Settings,
  Zap,
  ShieldAlert,
  BarChart3
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
  { icon: Layers, label: "Platforms", path: "/channels" },
];

const intelligenceItems = [
  { icon: BarChart3, label: "Financial Intelligence", path: "/finance" },
];

const operationsItems = [
  { icon: CheckSquare, label: "Operational Tasks", path: "/tasks" },
  { icon: Library, label: "Intelligence Hub", path: "/hub" },
];

interface AppSidebarProps {
  isAdmin?: boolean;
}

export function AppSidebar({ isAdmin }: AppSidebarProps) {
  const pathname = usePathname();

  const renderMenuItem = (item: { icon: any, label: string, path: string }) => {
    const isActive = pathname === item.path;
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton 
          asChild 
          isActive={isActive}
          className={cn(
            "h-10 rounded-lg transition-all duration-200 px-3 relative group overflow-hidden",
            isActive 
              ? "bg-primary/10 text-primary font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]" 
              : "text-tier-3 hover:bg-white/[0.03] hover:text-tier-1 font-medium"
          )}
        >
          <Link href={item.path}>
            <item.icon className={cn("size-4.5 transition-colors", isActive ? "text-primary" : "text-tier-3 group-hover:text-tier-2")} />
            <span className="tracking-tight ml-3.5 text-[13px]">{item.label}</span>
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="inset" className="border-r border-white/[0.02] bg-sidebar/40 backdrop-blur-2xl">
      <SidebarHeader className="py-10 px-6">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center shadow-lg ring-1 ring-white/10">
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
          <SidebarMenu className="gap-1">
            {commandItems.map(renderMenuItem)}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-tier-4 mb-3">Growth Verticals</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {growthItems.map(renderMenuItem)}
          </SidebarMenu>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-tier-4 mb-3">Intelligence</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {intelligenceItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-tier-4 mb-3">Operations</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {operationsItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-primary mb-3">System Control</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {renderMenuItem({ icon: ShieldAlert, label: "Admin Console", path: "/admin" })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-7">
        {isAdmin && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-10 rounded-lg hover:bg-white/[0.03] transition-colors px-3 group">
                <Link href="/settings">
                  <Settings className="size-4.5 text-tier-3/40 group-hover:text-tier-1 transition-transform duration-700 group-hover:rotate-90" />
                  <span className="font-medium tracking-tight ml-3.5 text-[13px] text-tier-2 group-hover:text-tier-1">System Config</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        
        <div className="mt-6 flex flex-col gap-2.5 px-3">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.25em] text-tier-4">
            <span>Version</span>
            <span>2.7.0-B</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-primary/40 rounded-full" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
