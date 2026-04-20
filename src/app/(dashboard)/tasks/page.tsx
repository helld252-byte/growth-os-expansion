"use client";

import { 
  CheckSquare, 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  User as UserIcon,
  Layers,
  Flag,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight mb-2">Operational Tasks</h1>
          <p className="text-muted-foreground text-lg">Shared execution backlog for growth operations</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="size-5" /> Quick Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Filters */}
        <div className="flex flex-col gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10 h-10 bg-muted/30 border-none rounded-xl" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Filter By</h3>
            <Button variant="ghost" className="justify-start gap-3 h-10 px-3 bg-primary/10 text-primary rounded-xl font-bold">
              <CalendarIcon className="size-4" /> Today
              <Badge className="ml-auto bg-primary text-white text-[10px]">2</Badge>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-10 px-3 hover:bg-muted/50 rounded-xl font-bold text-muted-foreground">
              <Layers className="size-4" /> Upcoming
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-10 px-3 hover:bg-muted/50 rounded-xl font-bold text-muted-foreground">
              <CheckCircle2 className="size-4" /> Completed
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-10 px-3 hover:bg-muted/50 rounded-xl font-bold text-red-500">
              <Flag className="size-4" /> Overdue
              <Badge variant="destructive" className="ml-auto text-[10px] font-bold">1</Badge>
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-muted/20 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Tasks</span>
              <span className="text-xs font-bold text-muted-foreground">{tasks.length} total</span>
            </div>
            
            <div className="flex flex-col">
              {tasks.map((task) => (
                <div key={task.id} className="p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-all group border-b border-white/5 last:border-0">
                  <Checkbox className="mt-1 size-5 rounded-md border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <h4 className={cn(
                          "font-bold text-lg leading-tight transition-all",
                          task.status === "Overdue" ? "text-red-400" : "group-hover:text-primary"
                        )}>
                          {task.title}
                        </h4>
                        {task.linkedPlatformName && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Layers className="size-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-medium hover:text-primary cursor-pointer">
                              {task.linkedPlatformName}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge className={cn(
                        "font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider",
                        task.status === "Overdue" ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"
                      )}>
                        {task.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 mt-2 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {task.owner.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">{task.owner}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="size-3" />
                        <span className={cn(
                          "text-xs font-semibold",
                          task.status === "Overdue" ? "text-red-500" : ""
                        )}>
                          {task.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className={cn(
                          "size-3",
                          task.priority === "High" ? "text-red-500 fill-red-500" : 
                          task.priority === "Medium" ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                        )} />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{task.priority}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="size-5 text-muted-foreground" />
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