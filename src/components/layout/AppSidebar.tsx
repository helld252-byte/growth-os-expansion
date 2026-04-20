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
  ChevronRight
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", path: "/" },
  { icon: Layers, label: "Channels", path: "/channels" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Library, label: "Company Hub", path: "/hub" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="border-r border-border/10">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-3 px-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="size-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg leading-none">Growth OS</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Mission Control</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">Navigator</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={cn(
                    "h-11 transition-all duration-200",
                    pathname === item.path 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "hover:bg-sidebar-accent/50"
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className={cn("size-5", pathname === item.path ? "text-primary" : "text-muted-foreground")} />
                    <span className="font-medium">{item.label}</span>
                    {pathname === item.path && <ChevronRight className="ml-auto size-4" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-11 hover:bg-sidebar-accent/50 transition-colors">
              <Link href="/settings">
                <Settings className="size-5 text-muted-foreground" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-white/5 flex items-center gap-3">
          <Avatar className="size-8 border border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user/32/32" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">JS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">James Sterling</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Admin</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}