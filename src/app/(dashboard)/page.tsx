"use client";

import { useMemo } from "react";
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Target,
  LayoutGrid,
  Loader2,
  Calendar,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CommandCenter() {
  const firestore = getFirestore();
  
  // Real-time Data Subscriptions
  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: opportunities, isLoading: opLoading } = useCollection(opportunitiesRef);

  const partnersRef = useMemoFirebase(() => collection(firestore, 'partners'), [firestore]);
  const { data: partners, isLoading: pLoading } = useCollection(partnersRef);

  const tasksRef = useMemoFirebase(() => collection(firestore, 'tasks'), [firestore]);
  const { data: tasks, isLoading: tLoading } = useCollection(tasksRef);

  const isLoading = opLoading || pLoading || tLoading;

  const data = useMemo(() => {
    if (!opportunities || !partners || !tasks) return null;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Slim KPIs
    const trackedUnits = opportunities.length + partners.length;
    const waitingResponse = opportunities.filter(o => o.commStatus === 'Waiting reply' || o.commStatus === 'Contacted').length;
    const inReview = opportunities.filter(o => o.currentStage === 'In Review').length;
    const liveUnits = opportunities.filter(o => o.currentStage === 'Live').length + 
                     partners.filter(p => p.status === 'Live' || p.status === 'Active').length;
    const tasksToday = tasks.filter(t => t.dueDate === todayStr && t.status !== 'Completed').length;

    // Pipeline Snapshot
    const stages = ['Research', 'Applied', 'In Review', 'Approved', 'Live'];
    const pipelineSnapshot = stages.map(stage => ({
      label: stage,
      count: opportunities.filter(o => o.currentStage === stage).length
    }));

    // Priority Actions (Urgent & High Priority)
    const priorityActions = [
      ...tasks.filter(t => t.status === 'Overdue' || (t.priority === 'High' && t.status !== 'Completed')),
      ...opportunities.filter(o => o.priority === 'High' && o.currentStage !== 'Live')
    ].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    }).slice(0, 6);

    // Recent Activity
    const recentActivity = [
      ...opportunities,
      ...partners,
      ...tasks
    ].sort((a, b) => {
      const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || a.createdAt || 0);
      const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    }).slice(0, 8);

    // Weekly Wins
    const weeklyWins = opportunities.filter(o => {
      const date = o.updatedAt?.toDate ? o.updatedAt.toDate() : new Date(o.updatedAt || o.createdAt || 0);
      return ['Approved', 'Live', 'Onboarding'].includes(o.currentStage) && date >= sevenDaysAgo;
    }).concat(tasks.filter(t => {
      const date = t.updatedAt?.toDate ? t.updatedAt.toDate() : new Date(t.updatedAt || t.createdAt || 0);
      return t.status === 'Completed' && date >= sevenDaysAgo;
    })).slice(0, 5);

    return { 
      kpis: { trackedUnits, waitingResponse, inReview, liveUnits, tasksToday },
      pipelineSnapshot,
      priorityActions,
      recentActivity,
      weeklyWins
    };
  }, [opportunities, partners, tasks]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-tier-4">Synchronizing Data</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-12 animate-in fade-in duration-700">
      
      {/* 1. Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Zap className="size-5 text-primary fill-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-tier-1">Command Center</h1>
        </div>
        <p className="text-tier-3 text-[14px] font-medium tracking-tight">Today's growth priorities and tactical expansion logs.</p>
      </header>

      {/* 2. Slim KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SlimKPICard label="Tracked Units" value={data.kpis.trackedUnits} icon={LayoutGrid} />
        <SlimKPICard label="Waiting Response" value={data.kpis.waitingResponse} icon={Clock} color="text-amber-400" />
        <SlimKPICard label="In Review" value={data.kpis.inReview} icon={Layers} color="text-blue-400" />
        <SlimKPICard label="Live Ops" value={data.kpis.liveUnits} icon={Zap} color="text-emerald-400" />
        <SlimKPICard label="Tasks Today" value={data.kpis.tasksToday} icon={CheckCircle2} color="text-primary" />
      </div>

      {/* 3. Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Priority Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Priority Actions</h3>
            <Link href="/tasks" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View Backlog</Link>
          </div>
          <div className="flex flex-col gap-3">
            {data.priorityActions.length > 0 ? (
              data.priorityActions.map((action: any) => (
                <ActionRow key={action.id} item={action} />
              ))
            ) : (
              <div className="h-32 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-tier-4 text-[11px] font-medium uppercase tracking-widest">
                Deck is clear. No urgent actions detected.
              </div>
            )}
          </div>

          {/* 4. Recent Activity Feed */}
          <div className="mt-6 flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Tactical Log</h3>
            <div className="flex flex-col gap-px bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden">
              {data.recentActivity.map((activity: any) => (
                <ActivityRow key={activity.id} item={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pipeline & Wins */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Pipeline Snapshot */}
          <section className="flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 ml-1">Pipeline Snapshot</h3>
            <div className="premium-panel p-6 rounded-2xl flex flex-col gap-4">
              {data.pipelineSnapshot.map((stage) => (
                <div key={stage.label} className="flex items-center justify-between group">
                  <span className="text-[13px] font-medium text-tier-3 group-hover:text-tier-1 transition-colors">{stage.label}</span>
                  <div className="flex items-center gap-4 flex-1 justify-end ml-8">
                    <div className="h-1 flex-1 bg-white/[0.03] rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className={cn("h-full transition-all duration-1000", stage.label === 'Live' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-primary/40')} 
                        style={{ width: stage.count > 0 ? `${Math.min(stage.count * 10, 100)}%` : '0%' }}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-tier-2 w-4 text-right">{stage.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Weekly Wins summary */}
          <section className="flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 ml-1">Weekly Wins</h3>
            <div className="flex flex-col gap-3">
              {data.weeklyWins.length > 0 ? (
                data.weeklyWins.map((win: any) => (
                  <WinTile key={win.id} item={win} />
                ))
              ) : (
                <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">
                  Scanning for achievements...
                </div>
              )}
            </div>
          </section>

          {/* Quick Stats Summary */}
          <div className="premium-panel p-6 rounded-2xl bg-primary/5 border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="size-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">System Momentum</span>
            </div>
            <p className="text-[13px] text-tier-2 leading-relaxed font-medium">
              Vertical penetration is up <span className="text-emerald-400 font-bold">12%</span> this week. Focus on <span className="text-white">Applied</span> follow-ups to maintain velocity.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function SlimKPICard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="premium-panel p-4 rounded-xl flex items-center gap-4 hover:border-white/10 transition-all cursor-default">
      <div className={cn("size-9 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center", color || "text-tier-3")}>
        <Icon className="size-4.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-tier-1 leading-none">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4 mt-1.5">{label}</span>
      </div>
    </div>
  );
}

function ActionRow({ item }: { item: any }) {
  const isTask = !!item.title;
  return (
    <div className="premium-panel p-5 rounded-xl flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
      <div className="flex items-center gap-5">
        <div className={cn(
          "size-10 rounded-lg flex items-center justify-center border",
          item.priority === 'High' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-white/[0.02] border-white/[0.05] text-tier-3"
        )}>
          {isTask ? <CheckCircle2 className="size-4.5" /> : <AlertCircle className="size-4.5" />}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold text-tier-1 group-hover:text-primary transition-colors">
            {item.title || item.name}
          </span>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-4 px-1.5 text-[8px] uppercase tracking-widest font-bold border-white/5 bg-white/[0.02] text-tier-4">
              {isTask ? "Task" : "Opportunity"}
            </Badge>
            <span className="text-[10px] font-bold text-tier-3 uppercase tracking-tighter">
              {item.status || item.currentStage}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {item.dueDate && (
          <div className="flex items-center gap-2 text-tier-4">
            <Calendar className="size-3" />
            <span className="text-[11px] font-medium">{new Date(item.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
        <div className="size-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-primary/10 text-primary">
          <ChevronRight className="size-4" />
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: any }) {
  const isTask = !!item.title;
  const date = item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date(item.updatedAt || item.createdAt || 0);
  
  return (
    <div className="px-6 py-4 bg-background/40 flex items-center justify-between hover:bg-white/[0.015] transition-colors border-b border-white/[0.03] last:border-0 group">
      <div className="flex items-center gap-4">
        <div className="size-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-tier-2 group-hover:text-tier-1 transition-colors">{item.title || item.name}</span>
          <span className="text-[10px] text-tier-4 font-medium uppercase tracking-tighter">
            {isTask ? "Execution parameter updated" : `Platform transitioned to ${item.currentStage || item.status}`}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-tier-4 uppercase">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  );
}

function WinTile({ item }: { item: any }) {
  const isTask = !!item.title;
  return (
    <div className="premium-panel p-4 rounded-xl border-emerald-500/10 bg-emerald-500/[0.02] flex items-center gap-4 group hover:border-emerald-500/30 transition-all">
      <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
        <Star className="size-4 fill-emerald-400" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-[13px] font-bold text-tier-1 truncate">{item.title || item.name}</span>
        <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest leading-none mt-1">
          {isTask ? "Task Verified" : "Phase Approved"}
        </span>
      </div>
    </div>
  );
}
