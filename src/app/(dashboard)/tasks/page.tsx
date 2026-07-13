
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
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase, useUser, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore, serverTimestamp, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

export default function TasksPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const firestore = getFirestore();

  const tasksRef = useMemoFirebase(() => collection(firestore, 'tasks'), [firestore]);
  const { data: tasks, isLoading } = useCollection(tasksRef);

  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: platforms } = useCollection(opportunitiesRef);

  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium",
    dueDate: new Date().toISOString().split('T')[0],
    growthOpportunityId: "none",
  });

  const handleAddTask = () => {
    if (!user || !newTask.title) return;

    const docData = {
      title: newTask.title,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      growthOpportunityId: newTask.growthOpportunityId === "none" ? null : newTask.growthOpportunityId,
      ownerId: user.uid,
      status: "In Progress",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDocumentNonBlocking(tasksRef, docData);
    setIsAddOpen(false);
    setNewTask({
      title: "",
      priority: "Medium",
      dueDate: new Date().toISOString().split('T')[0],
      growthOpportunityId: "none",
    });

    toast({
      title: "Tactical Task Added",
      description: `"${docData.title}" has been recorded in the execution backlog.`,
    });
  };

  const handleToggleComplete = (task: any) => {
    const taskRef = doc(firestore, 'tasks', task.id);
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    updateDocumentNonBlocking(taskRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    toast({
      title: newStatus === 'Completed' ? "Task Verified" : "Task Reopened",
      description: `Mission parameter updated for "${task.title}".`,
    });
  };

  const filteredTasks = useMemo(() => {
    return (tasks || []).filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const activeTasks = filteredTasks.filter(t => t.status !== 'Completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Overdue': return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case 'In Progress': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Completed': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-secondary text-tier-1 border-border";
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-10 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/50">
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
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2.5 rounded-xl h-11 px-6 shadow-xl shadow-primary/20 text-[11px] uppercase tracking-wider transition-all">
              <Plus className="size-4" /> Quick Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-2xl border-border rounded-2xl sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">New Tactical Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label className="text-[10px] uppercase tracking-widest text-tier-3">Task Title</Label>
                <Input 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g. Upload VAT ID to Amazon EU" 
                  className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({...newTask, priority: v})}>
                    <SelectTrigger className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Due Date</Label>
                  <DatePicker value={newTask.dueDate} onChange={(v) => setNewTask({...newTask, dueDate: v})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] uppercase tracking-widest text-tier-3">Linked Platform (Optional)</Label>
                <Select value={newTask.growthOpportunityId} onValueChange={(v) => setNewTask({...newTask, growthOpportunityId: v})}>
                  <SelectTrigger className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1">
                    <SelectValue placeholder="Select platform..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Internal / General</SelectItem>
                    {platforms?.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddTask}
                disabled={!newTask.title}
                className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest"
              >
                Launch Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Filter tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 bg-white/[0.02] border-border rounded-xl text-[13px] font-medium placeholder:text-tier-3 text-tier-1 focus-visible:ring-primary/20" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-tier-4 mb-3 ml-3">Timeline Filter</h3>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 bg-secondary text-tier-1 rounded-lg font-medium text-[13px] transition-all relative border border-border/50 hover:bg-secondary">
              <Clock className="size-4.5 text-primary" /> Active Missions
              <span className="ml-auto bg-secondary text-tier-3 text-[10px] font-bold px-2 py-0.5 rounded-md border border-border">{activeTasks.length}</span>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 text-tier-2 hover:bg-secondary/50 hover:text-tier-1 rounded-lg font-medium text-[13px] transition-all">
              <Layers className="size-4.5 text-tier-3" /> Upcoming
            </Button>
            <Button variant="ghost" className="justify-start gap-4 h-10 px-4 text-rose-400 hover:bg-rose-500/5 rounded-lg font-medium text-[13px] transition-all">
              <Flag className="size-4.5 text-rose-500/60" /> Overdue
              <span className="ml-auto bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {activeTasks.filter(t => t.status === 'Overdue').length}
              </span>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-12">
          <div className="premium-panel rounded-2xl border-border overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-border bg-secondary/20 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Active Missions</span>
              <span className="text-[12px] font-medium text-tier-3">{activeTasks.length} pending execution</span>
            </div>
            
            <div className="flex flex-col">
              {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="size-6 text-primary animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tier-3">Syncing Backlog...</span>
                </div>
              ) : activeTasks.length > 0 ? (
                activeTasks.map((task) => (
                  <TaskRow key={task.id} task={task} getStatusStyles={getStatusStyles} onToggle={() => handleToggleComplete(task)} />
                ))
              ) : (
                <div className="p-12 text-center opacity-40">
                  <Layers className="size-8 mx-auto mb-3 text-tier-4" />
                  <span className="text-[11px] font-medium uppercase tracking-widest text-tier-4">No active missions found</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-3">
              <History className="size-4 text-tier-3" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Completed History</h2>
            </div>
            
            <div className="premium-panel rounded-2xl border-border overflow-hidden shadow-sm opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex flex-col">
                {!isLoading && completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <TaskRow key={task.id} task={task} getStatusStyles={getStatusStyles} onToggle={() => handleToggleComplete(task)} />
                  ))
                ) : (
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

function TaskRow({ task, getStatusStyles, onToggle }: { task: any, getStatusStyles: (s: string) => string, onToggle: () => void }) {
  return (
    <div className="px-8 py-6 flex items-start gap-6 hover:bg-secondary/30 transition-all group border-b border-border/50 last:border-0">
      <Checkbox 
        checked={task.status === 'Completed'}
        onClick={onToggle}
        className="mt-1 size-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" 
      />
      
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <h4 className={cn(
              "font-semibold text-[15px] leading-tight tracking-tight transition-colors",
              task.status === "Overdue" ? "text-rose-400" : 
              task.status === "Completed" ? "text-tier-3 line-through" : "text-tier-1 group-hover:text-tier-1"
            )}>
              {task.title}
            </h4>
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
          <div className="flex items-center gap-3 text-tier-3">
            <CalendarIcon className="size-4" />
            <span className={cn(
              "text-[12px] font-semibold tracking-tight",
              task.status === "Overdue" ? "text-rose-400" : ""
            )}>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
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

      <Button variant="ghost" size="icon" className="size-9 shrink-0 opacity-0 group-hover:opacity-100 transition-all text-tier-3 hover:text-tier-1 hover:bg-secondary">
        <MoreVertical className="size-5" />
      </Button>
    </div>
  );
}
