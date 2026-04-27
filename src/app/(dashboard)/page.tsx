
"use client";

import { 
  Box, 
  Filter, 
  MoreHorizontal, 
  Navigation, 
  Layers, 
  Zap,
  ChevronRight,
  Globe,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, Tooltip } from "recharts";
import Link from "next/link";

const analyticsData = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 30 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 45 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 35 },
  { day: 'Sun', value: 50 },
];

export default function CommandCenter() {
  const firestore = getFirestore();
  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: opportunities, isLoading } = useCollection(opportunitiesRef);

  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'Live': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'In Review': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Approved': return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case 'Applied': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'Research': return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      case 'Rejected': return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case 'Onboarding': return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-slate-500/10 text-slate-300 border-slate-500/20";
    }
  };

  const stats = {
    leads: (opportunities || []).length,
    pipeline: (opportunities || []).filter(o => o.currentStage !== 'Live').length,
    onboarded: (opportunities || []).filter(o => o.currentStage === 'Live').length,
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-12 animate-in fade-in duration-700">
      
      {/* Dashboard Headline & Top Metrics */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05] text-tier-1">
            Growth <br /> Operations <br /> Command
          </h1>
          
          <div className="flex items-center gap-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 pr-8 max-w-fit shadow-2xl backdrop-blur-md">
            <div className="size-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Globe className="size-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-tier-1 leading-tight tracking-tight">Global Market Engine</span>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.2em] mt-2">Mission Active • Unit-01</span>
            </div>
          </div>
        </div>

        {/* Top Metric Boxes */}
        <div className="flex flex-wrap gap-5 lg:justify-end w-full lg:w-auto">
          <MetricBox label="Active Initiatives" value={stats.leads} trend="+2.5% ↗" trendUp={true} icon={Layers} />
          <MetricBox label="In Pipeline" value={stats.pipeline} trend="Steady" trendUp={true} icon={Navigation} />
          <MetricBox label="Live Units" value={stats.onboarded} trend="+5.45% ↗" trendUp={true} icon={Box} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-y border-white/[0.04]">
        <div className="flex items-center gap-3 text-accent font-semibold text-[13px] uppercase tracking-widest">
          <Zap className="size-4.5 animate-pulse" /> Command intelligence online
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-11 font-semibold border border-white/[0.06] bg-white/[0.01] rounded-xl px-6 text-[12px] text-tier-2 hover:text-tier-1 transition-all">
            <Filter className="size-4.5 mr-3 text-tier-3" /> System Filters
          </Button>
          <Button asChild className="h-11 font-bold bg-primary hover:bg-primary/90 text-white rounded-full px-10 text-[11px] uppercase tracking-[0.18em] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-primary/10">
            <Link href="/channels">Launch Initiative</Link>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Analytics */}
        <div className="lg:col-span-5 premium-panel rounded-2xl p-8 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[10px] uppercase tracking-[0.25em] text-tier-4">Market Velocity</h3>
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="text-primary border-b-2 border-primary pb-1">Week</span>
              <span className="text-tier-3 hover:text-tier-1 cursor-pointer transition-colors">Month</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col">
              <span className="text-4xl font-semibold text-tier-1 tracking-tight">97 <span className="text-[14px] text-emerald-500 font-bold">↗</span></span>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.2em] mt-3">Daily Cap</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-semibold text-tier-1 tracking-tight">120 <span className="text-[14px] text-emerald-500 font-bold">↗</span></span>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.2em] mt-3">Avg Flow</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-semibold text-tier-1 tracking-tight">259 <span className="text-[14px] text-emerald-500 font-bold">↗</span></span>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.2em] mt-3">Peak</span>
            </div>
          </div>

          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} barSize={36} opacity={0.7} />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.03 }}
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', fontSize: '12px', fontWeight: 600, backdropFilter: 'blur(12px)', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Path */}
        <div className="lg:col-span-4 premium-panel rounded-2xl p-8 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[10px] uppercase tracking-[0.25em] text-tier-4">Operational Status</h3>
            <Button variant="ghost" size="icon" className="size-10 rounded-xl border border-white/[0.04] text-tier-3 hover:text-tier-1 transition-colors"><MoreHorizontal className="size-5" /></Button>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.2em]">Latest Update</span>
                <span className="text-[16px] font-semibold text-tier-1 mt-1.5 tracking-tight">Platforms Sync Complete</span>
              </div>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-0.5 rounded-lg shadow-sm">Ready</Badge>
            </div>

            <div className="space-y-6">
              <TimelineItem status="complete" label="Cloud Provisioning" time="Active" />
              <TimelineItem status="active" label="Firestore Realtime" time="Active" />
              <TimelineItem status="active" label="RBAC Security" time="Active" />
            </div>

            <div className="mt-3 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-5">
                <div className="size-11 rounded-full overflow-hidden ring-2 ring-white/10 shadow-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="size-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.15em]">System Status</span>
                  <span className="text-[14px] font-semibold text-tier-1 mt-1 tracking-tight">Core Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-3 premium-panel rounded-2xl p-0 overflow-hidden relative group">
          <div className="absolute top-8 left-8 z-10 p-5 bg-background/70 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Strategic Map</h4>
            <p className="text-[16px] font-semibold mt-2 text-tier-1 tracking-tight">Global Expansion Zone</p>
          </div>
          <img 
            src="https://picsum.photos/seed/strategic-map/800/800" 
            className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000" 
            alt="Map" 
            data-ai-hint="world map"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
          <Button asChild variant="ghost" size="icon" className="absolute bottom-8 right-8 size-11 rounded-full bg-primary text-white shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-primary/30">
            <Link href="/channels">
              <ChevronRight className="size-6" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Platforms Registry */}
      <div className="flex flex-col gap-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-tier-4">Recent Platforms Updates</h2>
        <div className="premium-panel rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="size-8 text-primary animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-tier-3">Syncing Registry...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Platform</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Category</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Market</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Stage</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Status</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody>
                {(opportunities || []).map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <Link href={`/channels/${p.id}`} className="flex items-center gap-5">
                        <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-sm text-primary group-hover:bg-primary/10 transition-all">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-semibold tracking-tight text-[15px] text-primary group-hover:text-tier-1 transition-colors">{p.name}</span>
                      </Link>
                    </td>
                    <td className="p-6 text-[12px] font-semibold text-tier-2 uppercase tracking-[0.12em]">{p.type}</td>
                    <td className="p-6 text-[13px] font-medium text-tier-2">{p.market}</td>
                    <td className="p-6 text-[11px] font-bold text-tier-3 uppercase tracking-[0.15em]">{p.currentStage}</td>
                    <td className="p-6">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "font-medium uppercase tracking-[0.12em] text-[10px] px-3 py-0.5 rounded-lg border transition-all flex items-center gap-2 w-fit",
                          getStageStyles(p.currentStage)
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", p.currentStage === "Live" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-current")} />
                        {p.currentStage === "Live" ? "Active" : p.currentStage}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      <Button asChild variant="ghost" size="icon" className="size-9 rounded-xl opacity-0 group-hover:opacity-80 hover:opacity-100 transition-all text-tier-3 hover:text-tier-1">
                        <Link href={`/channels/${p.id}`}>
                          <ChevronRight className="size-5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!opportunities || opportunities.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center opacity-30 text-[11px] font-bold uppercase tracking-widest">
                      No initiatives registered in cloud registry
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, trend, trendUp, icon: Icon }: any) {
  return (
    <div className="premium-panel rounded-2xl p-7 flex items-center gap-7 min-w-[280px] group hover:border-primary/30 transition-all cursor-pointer shadow-xl active-glow">
      <div className="size-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center group-hover:bg-primary/15 transition-all p-3.5">
        <Icon className="size-7 text-tier-3 group-hover:text-primary transition-colors" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">{label}</span>
        <div className="flex items-baseline gap-4 mt-2">
          <span className="text-3xl font-bold leading-none text-tier-1 tracking-tight">{value}</span>
          <span className={cn("text-[11px] font-bold tracking-tight", trendUp ? "text-emerald-500" : "text-rose-500")}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ label, time, status }: any) {
  return (
    <div className="flex items-start gap-6">
      <div className={cn(
        "mt-2.5 size-2.5 rounded-full",
        status === 'complete' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
        status === 'active' ? "bg-primary animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-white/10"
      )} />
      <div className="flex flex-col">
        <span className={cn("text-[14px] font-semibold tracking-tight transition-colors", status === 'pending' ? "text-tier-3" : "text-tier-1")}>{label}</span>
        <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.2em] mt-2">{time}</span>
      </div>
    </div>
  );
}
