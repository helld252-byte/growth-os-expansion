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
          <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Flag className="size-5 text-accent" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-tier-1">Operational Tasks</h1>
            <p className="text-[14px] text-tier-2 font-medium leading-relaxed max-w-2xl">
              Shared execution backlog for market onboarding, strategic maintenance, and tactical mission tracking.
            </p>
          </div>
        </div>
        <Button className="bg-primary/20 hover:bg-primary text-tier-1 font-semibold gap-2.5 rounded-xl h-10 px-6 shadow-lg text-[11px] uppercase tracking-wider transition-all border border-primary/20">
          <Plus className="size-4" /> Quick Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar: Filters */}
        <div className="flex flex-col gap-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Filter tasks..." 
              className="pl-11 h-11 bg-white/[0.02] border-white/[0.06] rounded-xl text-[13px] font-medium placeholder:text-tier-4 text-tier-1 focus-visible:ring-primary/20" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 mb-3 ml-3">Timeline Filter</h3>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 bg-primary/10 text-primary rounded-lg font-medium text-[13px] transition-all">
              <CalendarIcon className="size-4.5" /> Today
              <span className="ml-auto bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">2</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 text-tier-2 hover:bg-white/[0.03] hover:text-tier-1 rounded-lg font-medium text-[13px] transition-all">
              <Layers className="size-4.5 text-tier-3" /> Upcoming
            </Button>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium text-[13px] transition-all">
              <Flag className="size-4.5 text-rose-500/60" /> Overdue
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="premium-panel rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl">
            <div className="px-8 py-5 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-3">Execution Backlog</span>
              <span className="text-[12px] font-medium text-tier-2">{tasks.length} active missions</span>
            </div>
            
            <div className="flex flex-col">
              {tasks.map((task) => (
                <div key={task.id} className="px-8 py-6 flex items-start gap-6 hover:bg-white/[0.015] transition-all group border-b border-white/[0.03] last:border-0">
                  <Checkbox className="mt-1 size-5 rounded-md border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" />
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <h4 className={cn(
                          "font-semibold text-base leading-tight tracking-tight transition-colors",
                          task.status === "Overdue" ? "text-rose-400" : "text-tier-1 group-hover:text-primary"
                        )}>
                          {task.title}
                        </h4>
                        {task.linkedPlatformName && (
                          <div className="flex items-center gap-2.5">
                            <Layers className="size-3.5 text-tier-3" />
                            <span className="text-[11px] text-tier-2 font-medium uppercase tracking-[0.05em] hover:text-primary cursor-pointer transition-colors">
                              {task.linkedPlatformName}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "font-medium px-3 py-0.5 h-auto text-[10px] uppercase tracking-wider rounded-lg border transition-all",
                          task.status === "Overdue" 
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                            : "bg-white/[0.03] text-tier-1 border-white/[0.12]"
                        )}
                      >
                        {task.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <div className="size-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-[10px] font-bold text-primary">
                          {task.owner.charAt(0)}
                        </div>
                        <span className="text-[13px] font-medium text-tier-2">{task.owner}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-tier-2">
                        <CalendarIcon className="size-4 text-tier-3" />
                        <span className={cn(
                          "text-[13px] font-medium tracking-tight",
                          task.status === "Overdue" ? "text-rose-400" : ""
                        )}>
                          {task.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Flag className={cn(
                          "size-4",
                          task.priority === "High" ? "text-accent" : "text-tier-3"
                        )} />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-tier-2">{task.priority}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="size-10 shrink-0 opacity-0 group-hover:opacity-100 transition-all text-tier-3 hover:text-tier-1 hover:bg-white/[0.05]">
                    <MoreVertical className="size-5" />
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
