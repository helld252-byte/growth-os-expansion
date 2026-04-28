"use client";

import { useMemo } from "react";
import { 
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutGrid,
  GraduationCap,
  Coffee,
  Handshake,
  Users2,
  ArrowUpRight,
  Trophy,
  Zap,
  TrendingUp,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, Cell } from "recharts";
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

  const metrics = useMemo(() => {
    if (!opportunities || !partners || !tasks) return null;

    const allUnits = [...opportunities, ...partners];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split('T')[0];

    const totalTracked = allUnits.length;
    const activeConversations = opportunities.filter(o => 
      ['Contacted', 'In discussion', 'Waiting reply'].includes(o.commStatus || '')
    ).length;
    const liveUnits = opportunities.filter(o => o.currentStage === 'Live').length + 
                     partners.filter(p => p.status === 'Active').length;
    const waitingResponse = opportunities.filter(o => 
      (o.commStatus === 'Waiting reply' || o.currentStage === 'In Review')
    ).length;
    const tasksDueToday = tasks.filter(t => t.dueDate === todayStr && t.status !== 'Completed').length;
    const newLeadsWeek = allUnits.filter(u => {
      const created = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
      return created >= weekAgo;
    }).length;

    const verticals = {
      platforms: opportunities.length,
      schools: partners.filter(p => p.type === 'School').length,
      cafes: partners.filter(p => p.type === 'Cafe' || p.partnerType === 'Cafe').length,
      partnerships: partners.filter(p => ["Milk Brand", "Co-branding", "Event", "Influencer"].includes(p.type)).length,
      communities: partners.filter(p => ["Forum", "Blog", "Review Site"].includes(p.type)).length,
    };

    const pipeline = [
      { label: 'Research', value: opportunities.filter(o => o.currentStage === 'Research').length },
      { label: 'Applied', value: opportunities.filter(o => o.currentStage === 'Applied').length },
      { label: 'Review', value: opportunities.filter(o => o.currentStage === 'In Review').length },
      { label: 'Approved', value: opportunities.filter(o => o.currentStage === 'Approved').length },
      { label: 'Live', value: opportunities.filter(o => o.currentStage === 'Live').length },
    ];

    const priorityActions = [
      ...tasks.filter(t => t.status === 'Overdue' || (t.priority === 'High' && t.status !== 'Completed')),
      ...opportunities.filter(o => o.priority === 'High' && o.currentStage !== 'Live')
    ].slice(0, 4);

    const recentWins = [
      ...opportunities.filter(o => ['Approved', 'Live'].includes(o.currentStage)),
      ...tasks.filter(t => t.status === 'Completed')
    ].sort((a, b) => {
      const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || a.createdAt);
      const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    }).slice(0, 4);

    const chartData = pipeline.map((p, i) => ({
      name: p.label,
      value: p.value
    }));

    return { 
      totalTracked, activeConversations, liveUnits, waitingResponse, tasksDueToday, newLeadsWeek,
      verticals, pipeline, priorityActions, recentWins, chartData
    };
  }, [opportunities, partners, tasks]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-tier-4 animate-pulse">Synchronizing Data</span>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="max-w-[1500px] mx-auto flex flex-col gap-12 animate-in fade-in slide-in-from-top-2 duration-1000">
      
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              Operational Stream
            </span>
            <div className="h-px w-8 bg-white/10" />
            <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em]">Unit-01 Status: Optimal</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tighter text-tier-1">Command Center</h1>
            <p className="text-tier-3 text-[15px] font-medium leading-relaxed max-w-xl">
              Live intelligence feed for the global growth engine. Monitoring vertical saturation and expansion velocity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.05] rounded-xl px-6 text-[11px] font-bold uppercase tracking-wider text-tier-2 transition-all">
            System Log
          </Button>
          <Button asChild className="h-11 bg-primary hover:bg-primary/90 text-white rounded-xl px-10 text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl active-glow">
            <Link href="/channels">Launch Platform</Link>
          </Button>
        </div>
      </header>

      {/* High-Luminance KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <KPICard label="Tracked Units" value={metrics.totalTracked} icon={LayoutGrid} color="text-tier-1" />
        <KPICard label="Active Conversations" value={metrics.activeConversations} icon={Users2} color="text-accent" />
        <KPICard label="Live Systems" value={metrics.liveUnits} icon={Zap} color="text-emerald-400" />
        <KPICard label="Waiting Input" value={metrics.waitingResponse} icon={Clock} color="text-amber-400" />
        <KPICard label="Tasks Today" value={metrics.tasksDueToday} icon={CheckCircle2} color="text-blue-400" />
        <KPICard label="New Leads" value={metrics.newLeadsWeek} icon={TrendingUp} color="text-violet-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Main Intelligence Sector */}
        <div className="xl:col-span-8 flex flex-col gap-10">
          
          {/* Growth Velocity Sector */}
          <div className="premium-panel rounded-3xl p-10 flex flex-col gap-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
              <Activity className="size-32 text-white" />
            </div>
            
            <div className="flex flex-col gap-1 relative z-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-tier-4">Expansion Velocity</h3>
              <p className="text-xl font-bold text-tier-1">Pipeline Distribution</p>
            </div>

            <div className="grid grid-cols-5 gap-6 relative z-10">
              {metrics.pipeline.map((step, i) => (
                <div key={i} className="flex flex-col gap-3 group cursor-default">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-tier-1 group-hover:text-primary transition-colors">{step.value}</span>
                    <span className="text-[10px] font-bold text-tier-4 uppercase tracking-widest">{step.label}</span>
                  </div>
                  <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        step.label === 'Live' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-primary/40"
                      )} 
                      style={{ width: step.value > 0 ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-44 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground)/0.4)', fontSize: 10, fontWeight: 700}} 
                    dy={15}
                  />
                  <Tooltip 
                    cursor={{fill: 'white', opacity: 0.02}}
                    contentStyle={{backgroundColor: 'rgba(10,10,12,0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '11px', color: '#fff', backdropFilter: 'blur(10px)'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                    {metrics.chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Live' ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.03)'} 
                        className="hover:fill-primary transition-colors duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Priority Actions */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <AlertCircle className="size-4 text-rose-500" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Tactical Priorities</h3>
                </div>
                <Link href="/tasks" className="text-[10px] font-bold text-primary hover:underline">View Backlog</Link>
              </div>
              <div className="flex flex-col gap-3">
                {metrics.priorityActions.map((action: any, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.015] border border-white/[0.04] group hover:bg-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-semibold text-tier-2 group-hover:text-tier-1 transition-colors">{action.title || action.name}</span>
                      <span className="text-[9px] text-tier-4 font-bold uppercase tracking-widest">{action.status || action.currentStage}</span>
                    </div>
                    <div className="size-8 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowUpRight className="size-3.5 text-tier-3" />
                    </div>
                  </div>
                ))}
                {metrics.priorityActions.length === 0 && (
                  <div className="p-10 text-center border border-dashed border-white/5 rounded-2xl opacity-30 text-[11px] font-bold uppercase tracking-widest">Clear Deck</div>
                )}
              </div>
            </div>

            {/* Recent Progress */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 px-2">
                <Trophy className="size-4 text-amber-500" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Mission Milestones</h3>
              </div>
              <div className="flex flex-col gap-3">
                {metrics.recentWins.map((win: any, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.015] border border-white/[0.04] group hover:border-emerald-500/20 transition-all">
                    <div className="size-9 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-tier-2 group-hover:text-tier-1 transition-colors">{win.title || win.name}</span>
                      <span className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Support Sector */}
        <div className="xl:col-span-4 flex flex-col gap-10">
          
          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-tier-4 ml-4">Vertical Map</h3>
            <div className="flex flex-col gap-3">
              <VerticalTile label="Platforms" count={metrics.verticals.platforms} icon={LayoutGrid} path="/channels" />
              <VerticalTile label="Schools" count={metrics.verticals.schools} icon={GraduationCap} path="/schools" />
              <VerticalTile label="Cafes" count={metrics.verticals.cafes} icon={Coffee} path="/cafes" />
              <VerticalTile label="Partnerships" count={metrics.verticals.partnerships} icon={Handshake} path="/partnerships" />
              <VerticalTile label="Communities" count={metrics.verticals.communities} icon={Users2} path="/communities" />
            </div>
          </div>

          {/* AI Intelligence Block */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/[0.08] to-transparent border border-primary/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Zap className="size-40 text-primary" />
            </div>
            
            <div className="flex items-center gap-3 mb-5">
              <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="size-4 text-primary animate-pulse" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Strategic AI</h4>
            </div>
            
            <p className="text-[14px] text-tier-2 leading-relaxed font-medium mb-6">
              "System analysis suggests prioritizing the **School Vertical** in **EU Regions**. High-impact conversion potential detected."
            </p>
            
            <Button variant="ghost" className="w-full h-11 rounded-xl border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">
              Run Mission Simulation
            </Button>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.015] border border-white/[0.04] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">System Momentum</span>
              <span className="text-[11px] font-bold text-emerald-500">Accelerating</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
              </div>
              <span className="text-[10px] text-tier-4 font-semibold text-right">80% Objective Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="group flex flex-col gap-4 p-6 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] transition-all cursor-default">
      <div className="flex items-center justify-between">
        <div className={cn("size-9 rounded-xl flex items-center justify-center bg-white/[0.03] transition-all group-hover:scale-110", color)}>
          <Icon className="size-4.5" />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-tier-4 group-hover:text-primary transition-colors">Active</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-tier-1 tracking-tighter group-hover:translate-x-1 transition-transform">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-tier-4">{label}</span>
      </div>
    </div>
  );
}

function VerticalTile({ label, count, icon: Icon, path }: any) {
  return (
    <Link href={path} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] group hover:bg-white/[0.03] hover:border-primary/30 transition-all">
      <div className="flex items-center gap-4">
        <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-tier-4 group-hover:text-primary transition-all">
          <Icon className="size-4" />
        </div>
        <span className="text-[13px] font-semibold text-tier-2 group-hover:text-tier-1 transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-bold text-tier-4 group-hover:text-primary transition-colors">{count}</span>
        <ChevronRight className="size-3.5 text-tier-4 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
