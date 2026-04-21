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
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* Dashboard Headline & Top Metrics */}
      <div className="flex flex-col xl:flex-row justify-between gap-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-bold tracking-tighter leading-[1.1] text-white">
            Growth <br /> Operations <br /> Command
          </h1>
          
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 max-w-fit">
            <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <Globe className="size-4 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-white/90 leading-tight">Global Market Engine</span>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">March 25, 2024</span>
            </div>
          </div>
        </div>

        {/* Top Metric Boxes */}
        <div className="flex flex-wrap gap-4">
          <MetricBox label="Leads" value="789" trend="+5.45% ↗" trendUp={true} icon={Layers} />
          <MetricBox label="Pipeline" value="120" trend="-0.45% ↘" trendUp={false} icon={Navigation} />
          <MetricBox label="Onboarded" value="98" trend="+5.45% ↗" trendUp={true} icon={Box} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 py-4 border-y border-white/[0.03]">
        <div className="flex items-center gap-2 text-accent font-medium text-[11px] uppercase tracking-wider">
          <Zap className="size-3.5" /> 5 tactical actions pending
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-9 font-medium border border-white/5 bg-white/[0.02] rounded-lg px-4 text-[11px] text-muted-foreground/80 hover:text-white">
            <Filter className="size-3.5 mr-2" /> Filters
          </Button>
          <Button className="h-9 font-semibold bg-accent hover:bg-accent/80 text-accent-foreground rounded-full px-6 text-[11px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            Create Initiative
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics */}
        <div className="lg:col-span-5 premium-panel rounded-2xl p-7 flex flex-col gap-7">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground/50">Market Velocity</h3>
            <div className="flex items-center gap-4 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
              <span className="text-white">Week</span>
              <span className="hover:text-white/60 cursor-pointer">Month</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">97 <span className="text-[10px] text-green-500 font-medium">↗</span></span>
              <span className="text-[9px] font-semibold text-muted-foreground/40 uppercase tracking-widest mt-1.5">Daily Cap</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">120 <span className="text-[10px] text-green-500 font-medium">↗</span></span>
              <span className="text-[9px] font-semibold text-muted-foreground/40 uppercase tracking-widest mt-1.5">Avg Flow</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">259 <span className="text-[10px] text-green-500 font-medium">↗</span></span>
              <span className="text-[9px] font-semibold text-muted-foreground/40 uppercase tracking-widest mt-1.5">Peak</span>
            </div>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[2, 2, 2, 2]} barSize={28} opacity={0.6} />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.02 }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '10px', backdropFilter: 'blur(4px)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Path */}
        <div className="lg:col-span-4 premium-panel rounded-2xl p-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground/50">Critical Path</h3>
            <Button variant="ghost" size="icon" className="size-8 rounded-lg border border-white/[0.03] text-muted-foreground/40 hover:text-white"><MoreHorizontal className="size-3.5" /></Button>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-[0.12em]">Active Mission ID</span>
                <span className="text-[13px] font-semibold text-white mt-1">#17986-WAY</span>
              </div>
              <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-md">In Review</Badge>
            </div>

            <div className="space-y-4">
              <TimelineItem status="complete" label="Initial Research" time="Mar 10" />
              <TimelineItem status="active" label="Compliance" time="Mar 22" />
              <TimelineItem status="pending" label="Catalog" time="Est. Mar 28" />
            </div>

            <div className="mt-2 p-3.5 bg-white/[0.015] border border-white/[0.03] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full overflow-hidden ring-1 ring-white/5 shadow-inner">
                  <img src="https://picsum.photos/seed/sarah/100/100" alt="Owner" className="opacity-80" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-semibold text-muted-foreground/40 uppercase">Operational Lead</span>
                  <span className="text-[11px] font-medium text-white/90">Sarah Chen</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="icon" className="size-7 rounded-lg bg-white/[0.02] text-muted-foreground/30 hover:text-white"><Globe className="size-3" /></Button>
                <Button variant="ghost" size="icon" className="size-7 rounded-lg bg-white/[0.02] text-muted-foreground/30 hover:text-white"><Star className="size-3" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-3 premium-panel rounded-2xl p-0 overflow-hidden relative group">
          <div className="absolute top-5 left-5 z-10 p-3 bg-background/60 backdrop-blur-xl rounded-xl border border-white/5">
            <h4 className="text-[9px] font-semibold uppercase tracking-widest text-accent/80">Deployment Map</h4>
            <p className="text-[11px] font-medium mt-1 text-white">EU Strategic Zone</p>
          </div>
          <img src="https://picsum.photos/seed/map/800/800" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000" alt="Map" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          <Button variant="ghost" size="icon" className="absolute bottom-5 right-5 size-9 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-110 active:scale-95 transition-all">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Expansion Registry */}
      <div className="flex flex-col gap-5">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/30">Expansion Registry</h2>
        <div className="premium-panel rounded-2xl overflow-hidden border border-white/[0.04]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.015] border-b border-white/[0.04]">
                <th className="p-4 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">Target Lead</th>
                <th className="p-4 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">Category</th>
                <th className="p-4 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">Est. Value</th>
                <th className="p-4 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">Stage</th>
                <th className="p-4 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3.5">
                      <div className="size-8 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center font-medium text-xs text-primary/60 group-hover:text-primary transition-colors">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-semibold tracking-tight text-[13px] text-white/90 group-hover:text-primary transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{p.type}</td>
                  <td className="p-4 text-[13px] font-bold text-white/80">${(p.estimatedValue / 1000).toFixed(0)}k</td>
                  <td className="p-4 text-[10px] font-medium text-muted-foreground/80 uppercase tracking-widest">{p.currentStage}</td>
                  <td className="p-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
                      p.currentStage === "Live" ? "text-green-500/80" : "text-accent/80"
                    )}>
                      <span className={cn("size-1 rounded-full", p.currentStage === "Live" ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" : "bg-accent shadow-[0_0_6px_rgba(255,0,255,0.4)]")} />
                      {p.currentStage === "Live" ? "Active" : "Processing"}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="size-7 rounded-lg opacity-0 group-hover:opacity-40 hover:opacity-100 transition-all text-muted-foreground"><MoreHorizontal className="size-3.5" /></Button>
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
    <div className="premium-panel rounded-2xl p-5 flex items-center gap-5 min-w-[240px] group hover:border-accent/20 transition-all cursor-pointer">
      <div className="size-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:bg-accent/10 transition-all">
        <Icon className="size-5 text-muted-foreground/40 group-hover:text-accent transition-colors" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/30">{label}</span>
        <div className="flex items-baseline gap-2.5 mt-1">
          <span className="text-2xl font-bold leading-none text-white">{value}</span>
          <span className={cn("text-[9px] font-semibold tracking-tighter", trendUp ? "text-green-500/80" : "text-red-500/80")}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ label, time, status }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={cn(
        "mt-1.5 size-1.5 rounded-full",
        status === 'complete' ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.3)]" : 
        status === 'active' ? "bg-accent animate-pulse shadow-[0_0_8px_rgba(255,0,255,0.3)]" : "bg-white/10"
      )} />
      <div className="flex flex-col">
        <span className={cn("text-[11px] font-medium tracking-tight", status === 'pending' ? "text-muted-foreground/40" : "text-white/90")}>{label}</span>
        <span className="text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-widest mt-1">{time}</span>
      </div>
    </div>
  );
}