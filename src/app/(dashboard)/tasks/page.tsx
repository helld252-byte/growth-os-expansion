"use client";

import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Layers,
  Flag,
  MoreVertical,
  CheckCircle2,
  History,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState } from "react";

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.linkedPlatformName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeTasks = filteredTasks.filter(t => t.status !== 'Completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Overdue': return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case 'In Progress': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Completed': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-white/[0.03] text-tier-1 border-white/[0.12]";
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-10 animate-in slide-in-from-right-4 duration-500">
      {/* Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/[0.03]">
        <div className="flex items-center gap-5">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg active-glow">
            <Flag className="size-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Operational Tasks</h1>
            <p className="text-[14px] text-tier-2 font-medium leading-relaxed max-w-2xl">
              Shared execution backlog for market onboarding and tactical mission tracking.
            </p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2.5 rounded-xl h-11 px-6 shadow-xl shadow-primary/20 text-[11px] uppercase tracking-wider transition-all">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 bg-white/[0.02] border-white/[0.06] rounded-xl text-[13px] font-medium placeholder:text-tier-3 text-tier-1 focus-visible:ring-primary/20" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-tier-4 mb-3 ml-3">Timeline Filter</h3>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 bg-primary/10 text-primary rounded-lg font-medium text-[13px] transition-all relative">
              <Clock className="size-4.5" /> Active Missions
              <span className="ml-auto bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">{activeTasks.length}</span>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 text-tier-2 hover:bg-white/[0.03] hover:text-tier-1 rounded-lg font-medium text-[13px] transition-all">
              <Layers className="size-4.5 text-tier-3" /> Upcoming
            </Button>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium text-[13px] transition-all">
              <Flag className="size-4.5 text-rose-500/60" /> Overdue
              <span className="ml-auto bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {activeTasks.filter(t => t.status === 'Overdue').length}
              </span>
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3 flex flex-col gap-12">
          {/* ACTIVE MISSIONS */}
          <div className="premium-panel rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl">
            <div className="px-8 py-5 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Active Missions</span>
              <span className="text-[12px] font-medium text-tier-3">{activeTasks.length} pending execution</span>
            </div>
            
            <div className="flex flex-col">
              {activeTasks.length > 0 ? activeTasks.map((task) => (
                <TaskRow key={task.id} task={task} getStatusStyles={getStatusStyles} />
              )) : (
                <div className="p-12 text-center opacity-40">
                  <Layers className="size-8 mx-auto mb-3 text-tier-4" />
                  <span className="text-[11px] font-medium uppercase tracking-widest text-tier-4">No active missions found</span>
                </div>
              )}
            </div>
          </div>

          {/* COMPLETED HISTORY */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-3">
              <History className="size-4 text-tier-3" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Completed History</h2>
            </div>
            
            <div className="premium-panel rounded-2xl border border-white/[0.06] overflow-hidden shadow-xl opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex flex-col">
                {completedTasks.length > 0 ? completedTasks.map((task) => (
                  <TaskRow key={task.id} task={task} getStatusStyles={getStatusStyles} />
                )) : (
                  <div className="p-12 text-center opacity-30">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-tier-4">No history recorded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task, getStatusStyles }: { task: any, getStatusStyles: (s: string) => string }) {
  return (
    <div className="px-8 py-6 flex items-start gap-6 hover:bg-white/[0.015] transition-all group border-b border-white/[0.03] last:border-0">
      <Checkbox 
        checked={task.status === 'Completed'}
        className="mt-1 size-5 rounded-md border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" 
      />
      
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <h4 className={cn(
              "font-semibold text-[15px] leading-tight tracking-tight transition-colors",
              task.status === "Overdue" ? "text-rose-400" : 
              task.status === "Completed" ? "text-tier-3 line-through" : "text-tier-1 group-hover:text-primary"
            )}>
              {task.title}
            </h4>
            {task.linkedPlatformName && (
              <div className="flex items-center gap-2.5">
                <Layers className="size-3.5 text-tier-3" />
                <span className="text-[11px] text-tier-2 font-semibold uppercase tracking-wider hover:text-primary cursor-pointer transition-colors">
                  {task.linkedPlatformName}
                </span>
              </div>
            )}
          </div>
          <Badge 
            variant="outline"
            className={cn(
              "font-medium px-3 py-0.5 h-auto text-[9px] uppercase tracking-widest rounded-lg border transition-all",
              getStatusStyles(task.status)
            )}
          >
            {task.status}
          </Badge>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-tier-2 group-hover:text-primary transition-colors">
              {task.owner.charAt(0)}
            </div>
            <span className="text-[13px] font-medium text-tier-2">{task.owner}</span>
          </div>
          <div className="flex items-center gap-2.5 text-tier-3">
            <CalendarIcon className="size-4" />
            <span className={cn(
              "text-[12px] font-semibold tracking-tight",
              task.status === "Overdue" ? "text-rose-400" : ""
            )}>
              {task.dueDate}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Flag className={cn(
              "size-4",
              task.priority === "High" ? "text-accent" : "text-tier-4"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-tier-3">{task.priority} Priority</span>
          </div>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="size-9 shrink-0 opacity-0 group-hover:opacity-100 transition-all text-tier-3 hover:text-tier-1 hover:bg-white/[0.05]">
        <MoreVertical className="size-5" />
      </Button>
    </div>
  );
}