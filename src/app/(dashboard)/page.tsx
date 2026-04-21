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
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { platforms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, Tooltip } from "recharts";

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
  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'Live':
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case 'In Review':
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case 'Approved':
        return "bg-violet-500/15 text-violet-400 border-violet-500/20";
      case 'Applied':
        return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      case 'Research':
        return "bg-slate-500/25 text-slate-100 border-slate-500/40";
      case 'Rejected':
        return "bg-rose-500/15 text-rose-400 border-rose-500/20";
      case 'Onboarding':
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-12 animate-in fade-in duration-700">
      
      {/* Dashboard Headline & Top Metrics */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-[1.05] text-primary">
            Growth <br /> Operations <br /> Command
          </h1>
          
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 pr-6 max-w-fit shadow-xl backdrop-blur-md">
            <div className="size-11 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe className="size-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-primary leading-tight tracking-tight">Global Market Engine</span>
              <span className="text-[10px] font-medium text-tertiary uppercase tracking-[0.15em] mt-1.5">Mission Active • Mar 2024</span>
            </div>
          </div>
        </div>

        {/* Top Metric Boxes */}
        <div className="flex flex-wrap gap-4 lg:justify-end w-full lg:w-auto">
          <MetricBox label="Leads" value="789" trend="+5.45% ↗" trendUp={true} icon={Layers} />
          <MetricBox label="Pipeline" value="120" trend="-0.45% ↘" trendUp={false} icon={Navigation} />
          <MetricBox label="Onboarded" value="98" trend="+5.45% ↗" trendUp={true} icon={Box} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 py-6 border-y border-white/[0.03]">
        <div className="flex items-center gap-2.5 text-accent font-medium text-[12px] uppercase tracking-widest">
          <Zap className="size-4 animate-pulse" /> 5 tactical actions pending
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 font-medium border border-white/[0.05] bg-white/[0.01] rounded-xl px-5 text-[12px] text-secondary hover:text-primary transition-all">
            <Filter className="size-4 mr-2.5 text-tertiary/60" /> Filters
          </Button>
          <Button className="h-10 font-medium bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 text-[11px] uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/10">
            Create Initiative
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics */}
        <div className="lg:col-span-5 premium-panel rounded-2xl p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[10px] uppercase tracking-[0.2em] text-tertiary">Market Velocity</h3>
            <div className="flex items-center gap-5 text-[10px] font-medium uppercase tracking-widest">
              <span className="text-primary border-b border-primary pb-1">Week</span>
              <span className="text-tertiary hover:text-primary cursor-pointer transition-colors">Month</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-3xl font-medium text-primary tracking-tight">97 <span className="text-[12px] text-green-500 font-medium">↗</span></span>
              <span className="text-[10px] font-medium text-tertiary uppercase tracking-[0.15em] mt-2">Daily Cap</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-medium text-primary tracking-tight">120 <span className="text-[12px] text-green-500 font-medium">↗</span></span>
              <span className="text-[10px] font-medium text-tertiary uppercase tracking-[0.15em] mt-2">Avg Flow</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-medium text-primary tracking-tight">259 <span className="text-[12px] text-green-500 font-medium">↗</span></span>
              <span className="text-[10px] font-medium text-tertiary uppercase tracking-[0.15em] mt-2">Peak</span>
            </div>
          </div>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[3, 3, 3, 3]} barSize={32} opacity={0.6} />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.03 }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px', fontWeight: 500, backdropFilter: 'blur(8px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Path */}
        <div className="lg:col-span-4 premium-panel rounded-2xl p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[10px] uppercase tracking-[0.2em] text-tertiary">Critical Path</h3>
            <Button variant="ghost" size="icon" className="size-9 rounded-xl border border-white/[0.03] text-tertiary hover:text-primary transition-colors"><MoreHorizontal className="size-4" /></Button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-tertiary uppercase tracking-[0.15em]">Mission ID</span>
                <span className="text-[15px] font-medium text-primary mt-1 tracking-tight">#17986-WAY</span>
              </div>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] font-medium tracking-widest uppercase px-2.5 py-0.5 rounded-lg shadow-sm">In Review</Badge>
            </div>

            <div className="space-y-5">
              <TimelineItem status="complete" label="Initial Research" time="Mar 10" />
              <TimelineItem status="active" label="Compliance" time="Mar 22" />
              <TimelineItem status="pending" label="Catalog" time="Est. Mar 28" />
            </div>

            <div className="mt-2 p-4 bg-white/[0.015] border border-white/[0.04] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full overflow-hidden ring-1 ring-white/10 shadow-lg">
                  <img src="https://picsum.photos/seed/sarah/100/100" alt="Owner" className="opacity-90" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-medium text-tertiary uppercase tracking-[0.12em]">Operational Lead</span>
                  <span className="text-[13px] font-medium text-primary tracking-tight">Sarah Chen</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-white/[0.02] text-tertiary hover:text-primary transition-all"><Globe className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-white/[0.02] text-tertiary hover:text-primary transition-all"><Star className="size-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-3 premium-panel rounded-2xl p-0 overflow-hidden relative group">
          <div className="absolute top-6 left-6 z-10 p-4 bg-background/60 backdrop-blur-xl rounded-2xl border border-white/[0.05] shadow-2xl">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent/90">Deployment Map</h4>
            <p className="text-[14px] font-medium mt-1.5 text-primary tracking-tight">EU Strategic Zone</p>
          </div>
          <img src="https://picsum.photos/seed/map/800/800" className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000" alt="Map" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
          <Button variant="ghost" size="icon" className="absolute bottom-6 right-6 size-10 rounded-full bg-accent text-accent-foreground shadow-xl hover:scale-110 active:scale-95 transition-all shadow-accent/20">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Expansion Registry */}
      <div className="flex flex-col gap-6">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-tertiary">Expansion Registry</h2>
        <div className="premium-panel rounded-2xl overflow-hidden border border-white/[0.05] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.015] border-b border-white/[0.04]">
                <th className="p-5 text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">Target Lead</th>
                <th className="p-5 text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">Category</th>
                <th className="p-5 text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">Est. Value</th>
                <th className="p-5 text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">Stage</th>
                <th className="p-5 text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">Status</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="size-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-medium text-sm text-primary group-hover:bg-primary/5 transition-all">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-medium tracking-tight text-[14px] text-primary group-hover:text-primary transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-[11px] font-medium text-secondary uppercase tracking-widest">{p.type}</td>
                  <td className="p-5 text-[14px] font-medium text-primary/90">${(p.estimatedValue / 1000).toFixed(0)}k</td>
                  <td className="p-5 text-[11px] font-medium text-tertiary uppercase tracking-widest">{p.currentStage}</td>
                  <td className="p-5">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-medium uppercase tracking-[0.1em] text-[9px] px-2.5 py-0.5 rounded-full border transition-all flex items-center gap-1.5 w-fit",
                        getStageStyles(p.currentStage)
                      )}
                    >
                      <span className={cn("size-1 rounded-full", p.currentStage === "Live" ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" : "bg-current")} />
                      {p.currentStage === "Live" ? "Active" : p.currentStage}
                    </Badge>
                  </td>
                  <td className="p-5 text-right">
                    <Button variant="ghost" size="icon" className="size-8 rounded-xl opacity-0 group-hover:opacity-60 hover:opacity-100 transition-all text-tertiary hover:text-primary"><MoreHorizontal className="size-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, trend, trendUp, icon: Icon }: any) {
  return (
    <div className="premium-panel rounded-2xl p-6 flex items-center gap-6 min-w-[260px] group hover:border-accent/20 transition-all cursor-pointer shadow-lg active-glow">
      <div className="size-13 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:bg-accent/10 transition-all p-3">
        <Icon className="size-6 text-tertiary group-hover:text-accent transition-colors" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">{label}</span>
        <div className="flex items-baseline gap-3 mt-1.5">
          <span className="text-3xl font-medium leading-none text-primary tracking-tight">{value}</span>
          <span className={cn("text-[10px] font-medium tracking-tight", trendUp ? "text-green-500" : "text-red-500")}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ label, time, status }: any) {
  return (
    <div className="flex items-start gap-5">
      <div className={cn(
        "mt-2 size-2 rounded-full",
        status === 'complete' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
        status === 'active' ? "bg-accent animate-pulse shadow-[0_0_10px_rgba(255,0,255,0.4)]" : "bg-white/10"
      )} />
      <div className="flex flex-col">
        <span className={cn("text-[13px] font-medium tracking-tight transition-colors", status === 'pending' ? "text-tertiary" : "text-primary")}>{label}</span>
        <span className="text-[10px] font-medium text-tertiary uppercase tracking-widest mt-1.5">{time}</span>
      </div>
    </div>
  );
}