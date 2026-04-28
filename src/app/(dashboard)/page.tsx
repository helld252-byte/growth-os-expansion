"use client";

import { useMemo } from "react";
import { 
  Box, 
  Filter, 
  MoreHorizontal, 
  Navigation, 
  Layers, 
  Zap,
  ChevronRight,
  Globe,
  Loader2,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  LayoutGrid,
  GraduationCap,
  Coffee,
  Handshake,
  Users2,
  ArrowUpRight,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis } from "recharts";
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

  // Operational Intelligence Calculations
  const metrics = useMemo(() => {
    if (!opportunities || !partners || !tasks) return null;

    const allUnits = [...opportunities, ...partners];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split('T')[0];

    // KPI Row Calculations
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

    // Vertical Distribution
    const verticals = {
      platforms: opportunities.length,
      schools: partners.filter(p => p.type === 'School').length,
      cafes: partners.filter(p => p.type === 'Cafe' || p.partnerType === 'Cafe').length,
      partnerships: partners.filter(p => ["Milk Brand", "Co-branding", "Event", "Influencer"].includes(p.type)).length,
      communities: partners.filter(p => ["Forum", "Blog", "Review Site"].includes(p.type)).length,
    };

    // Pipeline Health
    const pipeline = {
      research: opportunities.filter(o => o.currentStage === 'Research').length,
      applied: opportunities.filter(o => o.currentStage === 'Applied').length,
      review: opportunities.filter(o => o.currentStage === 'In Review').length,
      approved: opportunities.filter(o => o.currentStage === 'Approved').length,
      live: opportunities.filter(o => o.currentStage === 'Live').length,
    };

    // Priority Action Items
    const priorityActions = [
      ...tasks.filter(t => t.status === 'Overdue' || (t.priority === 'High' && t.status !== 'Completed')),
      ...opportunities.filter(o => o.priority === 'High' && o.currentStage !== 'Live')
    ].slice(0, 5);

    // Recent Wins (Last 5 Live/Approved/Completed)
    const recentWins = [
      ...opportunities.filter(o => ['Approved', 'Live'].includes(o.currentStage)),
      ...tasks.filter(t => t.status === 'Completed')
    ].sort((a, b) => {
      const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || a.createdAt);
      const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    }).slice(0, 5);

    // Momentum Chart (Daily completions/activations for current week)
    const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
      day,
      value: Math.floor(Math.random() * 10) + 2 // Placeholder for real activity log logic
    }));

    return { 
      totalTracked, activeConversations, liveUnits, waitingResponse, tasksDueToday, newLeadsWeek,
      verticals, pipeline, priorityActions, recentWins, chartData
    };
  }, [opportunities, partners, tasks]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Syncing Command Center...</span>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="flex flex-col xl:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg active-glow">
              <Activity className="size-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight text-tier-1">Operations Command</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Growth Unit-01 • Real-time Data Stream</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-xl">
            Live overview of the global growth engine. Monitoring pipeline health, vertical saturation, and tactical execution across all zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 border border-white/[0.05] rounded-xl px-5 text-[11px] font-bold uppercase tracking-wider text-tier-2 hover:text-primary transition-all">
            <Filter className="size-4 mr-2" /> View Filters
          </Button>
          <Button asChild className="h-10 bg-primary hover:bg-primary/90 text-white rounded-xl px-8 text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-primary/10">
            <Link href="/channels">Launch Platform</Link>
          </Button>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Tracked Units" value={metrics.totalTracked} icon={LayoutGrid} color="text-tier-1" />
        <KPICard label="Conversations" value={metrics.activeConversations} icon={Users2} color="text-accent" />
        <KPICard label="Live Systems" value={metrics.liveUnits} icon={Zap} color="text-emerald-400" />
        <KPICard label="Waiting Input" value={metrics.waitingResponse} icon={Clock} color="text-amber-400" />
        <KPICard label="Tasks Today" value={metrics.tasksDueToday} icon={CheckCircle2} color="text-blue-400" />
        <KPICard label="New (7d)" value={metrics.newLeadsWeek} icon={TrendingUp} color="text-violet-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Pipeline Health */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="premium-panel rounded-3xl p-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Growth Pipeline Health</h3>
                <span className="text-[14px] text-tier-2 font-medium">Channel movement from Research to Live Ops</span>
              </div>
              <Activity className="size-4 text-primary" />
            </div>

            <div className="grid grid-cols-5 gap-4">
              <PipelineStep label="Research" value={metrics.pipeline.research} />
              <PipelineStep label="Applied" value={metrics.pipeline.applied} />
              <PipelineStep label="Review" value={metrics.pipeline.review} />
              <PipelineStep label="Approved" value={metrics.pipeline.approved} />
              <PipelineStep label="Live" value={metrics.pipeline.live} active />
            </div>

            <div className="h-40 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground)/0.5)', fontSize: 10}} />
                  <Tooltip 
                    cursor={{fill: 'white', opacity: 0.03}}
                    contentStyle={{backgroundColor: 'rgba(5,5,5,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px', color: '#fff'}}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Action Center */}
            <div className="premium-panel rounded-3xl p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1 flex items-center gap-2">
                  <AlertCircle className="size-4 text-rose-500" /> Priority Actions
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {metrics.priorityActions.map((action: any, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] group hover:border-rose-500/30 transition-all cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-tier-1 truncate max-w-[180px]">{action.title || action.name}</span>
                      <span className="text-[10px] text-tier-4 uppercase font-bold tracking-widest">{action.status || action.currentStage}</span>
                    </div>
                    <ArrowUpRight className="size-3.5 text-tier-4 group-hover:text-rose-400 transition-colors" />
                  </div>
                ))}
                {metrics.priorityActions.length === 0 && (
                  <div className="p-8 text-center opacity-30 text-[11px] font-bold uppercase tracking-widest">No Critical Alerts</div>
                )}
              </div>
            </div>

            {/* Recent Wins */}
            <div className="premium-panel rounded-3xl p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1 flex items-center gap-2">
                  <Trophy className="size-4 text-amber-500" /> Recent Wins
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {metrics.recentWins.map((win: any, i) => (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.03] group hover:border-emerald-500/30 transition-all">
                    <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-tier-2">{win.title || win.name}</span>
                      <span className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-widest">Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Breakdown Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="premium-panel rounded-3xl p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Vertical Breakdown</h3>
              <span className="text-[14px] text-tier-2 font-medium">Strategic market saturation</span>
            </div>

            <div className="flex flex-col gap-4">
              <VerticalRow label="Platforms" count={metrics.verticals.platforms} icon={Globe} path="/channels" />
              <VerticalRow label="Schools" count={metrics.verticals.schools} icon={GraduationCap} path="/schools" />
              <VerticalRow label="Cafes" count={metrics.verticals.cafes} icon={Coffee} path="/cafes" />
              <VerticalRow label="Partnerships" count={metrics.verticals.partnerships} icon={Handshake} path="/partnerships" />
              <VerticalRow label="Communities" count={metrics.verticals.communities} icon={Users2} path="/communities" />
            </div>

            <Separator className="bg-white/[0.04]" />

            <div className="flex flex-col gap-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-tier-4">System Momentum</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-tier-3 font-medium">Total Registered Units</span>
                  <span className="text-tier-1 font-bold">{metrics.totalTracked}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-tier-3 font-medium">Conversion Velocity</span>
                  <span className="text-emerald-500 font-bold">High</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Insight Placeholder */}
          <div className="premium-panel rounded-3xl p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-primary/20 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Zap className="size-4 text-primary animate-pulse" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">AI Growth Insight</h3>
            </div>
            <p className="text-[13px] text-tier-2 leading-relaxed font-medium">
              "Tactical analysis suggests accelerating **School Vertical** outreach. High response rate detected in **EU Region** platforms."
            </p>
            <Button variant="ghost" className="w-fit h-8 px-4 rounded-lg border border-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/10">
              Run Deep Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="premium-panel p-5 rounded-2xl flex flex-col gap-3 group hover:border-primary/20 transition-all cursor-pointer">
      <div className="flex items-center justify-between">
        <Icon className={cn("size-4 opacity-50 group-hover:opacity-100 transition-opacity", color)} />
        <Badge variant="outline" className="h-4 px-1.5 text-[8px] border-white/5 bg-white/5 text-tier-4">Live</Badge>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-tier-1 tracking-tight">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4 mt-1">{label}</span>
      </div>
    </div>
  );
}

function PipelineStep({ label, value, active }: any) {
  return (
    <div className={cn(
      "flex flex-col gap-2 p-4 rounded-2xl border transition-all",
      active ? "bg-primary/10 border-primary/30" : "bg-white/[0.01] border-white/[0.04]"
    )}>
      <span className="text-lg font-bold text-tier-1">{value}</span>
      <span className={cn("text-[9px] font-bold uppercase tracking-widest", active ? "text-primary" : "text-tier-4")}>{label}</span>
    </div>
  );
}

function VerticalRow({ label, count, icon: Icon, path }: any) {
  return (
    <Link href={path} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.015] border border-white/[0.04] group hover:bg-primary/5 hover:border-primary/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="size-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-tier-3 group-hover:text-primary transition-all">
          <Icon className="size-4.5" />
        </div>
        <span className="text-[13px] font-semibold text-tier-2 group-hover:text-tier-1">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-bold text-tier-4 group-hover:text-tier-1">{count}</span>
        <ChevronRight className="size-3.5 text-tier-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full", className)} />;
}
