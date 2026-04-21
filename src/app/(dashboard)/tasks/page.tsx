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
          <div>
            <h1 className="text-2xl font-headline font-extrabold tracking-tight">Operational Tasks</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
              Shared execution backlog for market onboarding and maintenance.
            </p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 rounded-lg h-8 px-4 shadow-lg text-[9px] uppercase tracking-wider">
          <Plus className="size-3.5" /> Quick Add
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground group-focus-within:text-primary" />
            <Input 
              placeholder="Filter tasks..." 
              className="pl-7 h-8 bg-muted/30 border-none rounded-lg text-[10px]" 
            />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1 ml-1">Filter Range</h3>
            <Button variant="ghost" className="justify-start gap-2 h-8 px-2.5 bg-primary/10 text-primary rounded-lg font-bold text-[11px]">
              <CalendarIcon className="size-3" /> Today
              <Badge className="ml-auto bg-primary text-white text-[7px] px-1 min-w-[14px]">2</Badge>
            </Button>
            <Button variant="ghost" className="justify-start gap-2 h-8 px-2.5 hover:bg-muted/50 rounded-lg font-bold text-muted-foreground text-[11px]">
              <Layers className="size-3" /> Upcoming
            </Button>
            <Button variant="ghost" className="justify-start gap-2 h-8 px-2.5 hover:bg-muted/50 rounded-lg font-bold text-red-500 text-[11px]">
              <Flag className="size-3" /> Overdue
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="premium-panel rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-2 border-b border-white/5 bg-muted/20 flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Execution Backlog</span>
              <span className="text-[9px] font-bold text-muted-foreground/40">{tasks.length} total</span>
            </div>
            
            <div className="flex flex-col">
              {tasks.map((task) => (
                <div key={task.id} className="p-3.5 flex items-start gap-3 hover:bg-white/[0.01] transition-all group border-b border-white/5 last:border-0">
                  <Checkbox className="mt-0.5 size-3.5 rounded border-white/20" />
                  
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <h4 className={cn(
                          "font-bold text-[13px] leading-tight transition-all tracking-tight",
                          task.status === "Overdue" ? "text-red-400" : "group-hover:text-primary"
                        )}>
                          {task.title}
                        </h4>
                        {task.linkedPlatformName && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Layers className="size-2.5 text-muted-foreground/40" />
                            <span className="text-[8px] text-muted-foreground/60 font-bold uppercase tracking-tighter hover:text-primary cursor-pointer transition-colors">
                              {task.linkedPlatformName}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge className={cn(
                        "font-black px-1.5 py-0 text-[7px] uppercase tracking-wider rounded border",
                        task.status === "Overdue" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-muted text-muted-foreground border-white/5"
                      )}>
                        {task.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="size-3.5 rounded-full bg-primary/10 flex items-center justify-center text-[7px] font-black text-primary">
                          {task.owner.charAt(0)}
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground/60">{task.owner}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground/40">
                        <CalendarIcon className="size-2.5" />
                        <span className={cn(
                          "text-[9px] font-bold",
                          task.status === "Overdue" ? "text-red-500" : ""
                        )}>
                          {task.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flag className={cn(
                          "size-2.5",
                          task.priority === "High" ? "text-red-500 fill-red-500" : "text-muted-foreground/30"
                        )} />
                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{task.priority}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="size-3 text-muted-foreground/40" />
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
