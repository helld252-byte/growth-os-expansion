"use client";

import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Layers,
  Flag,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export default function TasksPage() {
  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
      {/* Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center">
            <Flag className="size-5 text-accent/60" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Operational Tasks</h1>
            <p className="text-[10px] text-muted-foreground/40 font-semibold uppercase tracking-widest mt-0.5">
              Shared execution backlog for market onboarding and maintenance.
            </p>
          </div>
        </div>
        <Button className="bg-primary/20 hover:bg-primary/30 text-white font-semibold gap-2 rounded-lg h-9 px-5 shadow-lg text-[10px] uppercase tracking-wider transition-all">
          <Plus className="size-3.5" /> Quick Add
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Filters */}
        <div className="flex flex-col gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Filter tasks..." 
              className="pl-9 h-9 bg-white/[0.015] border-white/[0.05] rounded-lg text-[12px] font-medium" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/20 mb-1.5 ml-1">Timeline Filter</h3>
            <Button variant="ghost" className="justify-start gap-3 h-9 px-3 bg-primary/10 text-white rounded-lg font-medium text-[12px]">
              <CalendarIcon className="size-3.5 text-primary" /> Today
              <span className="ml-auto bg-primary/20 text-primary text-[8px] font-semibold px-1.5 py-0.5 rounded">2</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-9 px-3 hover:bg-white/[0.02] rounded-lg font-medium text-secondary text-[12px] group">
              <Layers className="size-3.5 text-muted-foreground/20 group-hover:text-primary" /> Upcoming
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-9 px-3 hover:bg-white/[0.02] rounded-lg font-medium text-red-500/60 text-[12px] group">
              <Flag className="size-3.5 text-red-500/30 group-hover:text-red-500" /> Overdue
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="premium-panel rounded-xl border border-white/[0.04] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/20">Execution Backlog</span>
              <span className="text-[10px] font-medium text-muted-foreground/20">{tasks.length} active missions</span>
            </div>
            
            <div className="flex flex-col">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-white/[0.01] transition-all group border-b border-white/[0.03] last:border-0">
                  <Checkbox className="mt-1 size-3.5 rounded border-white/10 data-[state=checked]:bg-primary/40" />
                  
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <h4 className={cn(
                          "font-semibold text-[14px] leading-tight tracking-tight transition-colors",
                          task.status === "Overdue" ? "text-red-500/80" : "text-white/90 group-hover:text-primary"
                        )}>
                          {task.title}
                        </h4>
                        {task.linkedPlatformName && (
                          <div className="flex items-center gap-1.5">
                            <Layers className="size-2.5 text-muted-foreground/20" />
                            <span className="text-[9px] text-muted-foreground/40 font-medium uppercase tracking-tight hover:text-primary cursor-pointer transition-colors">
                              {task.linkedPlatformName}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "font-medium px-2 py-0 h-5 text-[8px] uppercase tracking-wider rounded border transition-all",
                          task.status === "Overdue" ? "bg-red-500/5 text-red-500/80 border-red-500/20" : "bg-white/[0.02] text-muted-foreground/40 border-white/[0.04]"
                        )}
                      >
                        {task.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[7px] font-bold text-primary">
                          {task.owner.charAt(0)}
                        </div>
                        <span className="text-[10px] font-medium text-secondary">{task.owner}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground/20">
                        <CalendarIcon className="size-3" />
                        <span className={cn(
                          "text-[10px] font-medium tracking-tight",
                          task.status === "Overdue" ? "text-red-500/60" : ""
                        )}>
                          {task.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flag className={cn(
                          "size-3",
                          task.priority === "High" ? "text-accent/60 fill-accent/10" : "text-muted-foreground/10"
                        )} />
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/20">{task.priority}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="size-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/20 hover:text-white">
                    <MoreVertical className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
