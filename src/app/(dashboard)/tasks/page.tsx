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
            <h1 className="text-2xl font-bold tracking-tight text-tier-1">Operational Tasks</h1>
            <p className="text-[12px] text-tier-2 font-medium leading-relaxed mt-1 max-w-2xl">
              Shared execution backlog for market onboarding, strategic maintenance, and tactical mission tracking.
            </p>
          </div>
        </div>
        <Button className="bg-primary/20 hover:bg-primary text-tier-1 font-semibold gap-2 rounded-xl h-9 px-5 shadow-lg text-[10px] uppercase tracking-wider transition-all border border-primary/20">
          <Plus className="size-3.5" /> Quick Add
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Filters */}
        <div className="flex flex-col gap-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Filter tasks..." 
              className="pl-9 h-10 bg-white/[0.015] border-white/[0.05] rounded-xl text-[12px] font-medium placeholder:text-tier-4 text-tier-1 focus-visible:ring-primary/20" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-tier-4 mb-2 ml-1">Timeline Filter</h3>
            <Button variant="ghost" className="justify-start gap-3.5 h-10 px-3 bg-primary/10 text-tier-1 rounded-lg font-medium text-[13px] group">
              <CalendarIcon className="size-4 text-primary" /> Today
              <span className="ml-auto bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">2</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-3.5 h-10 px-3 text-tier-2 hover:bg-white/[0.03] hover:text-tier-1 rounded-lg font-medium text-[13px] group">
              <Layers className="size-4 text-tier-3 group-hover:text-primary transition-colors" /> Upcoming
            </Button>
            <Button variant="ghost" className="justify-start gap-3.5 h-10 px-3 text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg font-medium text-[13px] group">
              <Flag className="size-4 text-rose-500/40 group-hover:text-rose-500 transition-colors" /> Overdue
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="premium-panel rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4">Execution Backlog</span>
              <span className="text-[11px] font-medium text-tier-3">{tasks.length} active missions</span>
            </div>
            
            <div className="flex flex-col">
              {tasks.map((task) => (
                <div key={task.id} className="px-6 py-5 flex items-start gap-5 hover:bg-white/[0.015] transition-all group border-b border-white/[0.03] last:border-0">
                  <Checkbox className="mt-1 size-4 rounded border-white/10 data-[state=checked]:bg-primary/50 data-[state=checked]:border-primary" />
                  
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <h4 className={cn(
                          "font-semibold text-[15px] leading-tight tracking-tight transition-colors",
                          task.status === "Overdue" ? "text-rose-400" : "text-tier-1 group-hover:text-primary"
                        )}>
                          {task.title}
                        </h4>
                        {task.linkedPlatformName && (
                          <div className="flex items-center gap-2">
                            <Layers className="size-3 text-tier-4" />
                            <span className="text-[11px] text-tier-3 font-medium uppercase tracking-tight hover:text-primary cursor-pointer transition-colors">
                              {task.linkedPlatformName}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "font-medium px-2.5 py-0.5 h-auto text-[9px] uppercase tracking-wider rounded-lg border transition-all",
                          task.status === "Overdue" 
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                            : "bg-white/[0.03] text-tier-2 border-white/[0.08]"
                        )}
                      >
                        {task.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2.5">
                        <div className="size-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                          {task.owner.charAt(0)}
                        </div>
                        <span className="text-[12px] font-medium text-tier-2">{task.owner}</span>
                      </div>
                      <div className="flex items-center gap-2 text-tier-3">
                        <CalendarIcon className="size-3.5" />
                        <span className={cn(
                          "text-[12px] font-medium tracking-tight",
                          task.status === "Overdue" ? "text-rose-400/80" : ""
                        )}>
                          {task.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className={cn(
                          "size-3.5",
                          task.priority === "High" ? "text-accent/60 fill-accent/10" : "text-tier-4"
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-tier-3">{task.priority}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-tier-3 hover:text-tier-1 hover:bg-white/[0.05]">
                    <MoreVertical className="size-4" />
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
