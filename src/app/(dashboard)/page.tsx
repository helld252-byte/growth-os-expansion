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
    <div className="max-w-[1440px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* Dashboard Headline & Top Metrics */}
      <div className="flex flex-col xl:flex-row justify-between gap-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-black tracking-tighter leading-none">
            Growth <br /> Operations <br /> Command
          </h1>
          
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 max-w-fit">
            <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Globe className="size-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight">Global Market Engine</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">MAR 25, 2024</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 py-5 border-y border-white/[0.03]">
        <div className="flex items-center gap-2.5 text-accent font-bold text-[11px] uppercase tracking-widest">
          <Zap className="size-4" /> 5 pending actions
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-9 font-bold border border-white/5 bg-white/5 rounded-lg px-4 text-[11px]">
            <Filter className="size-4 mr-2" /> Filters
          </Button>
          <Button className="h-9 font-bold bg-accent hover:bg-accent/80 text-accent-foreground rounded-full px-6 text-[11px] uppercase tracking-widest">
            Create Initiative
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics */}
        <div className="lg:col-span-5 premium-panel rounded-2xl p-7 flex flex-col gap-7">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/90">Market Velocity</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <span className="text-white">Week</span>
              <span>Month</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col">
              <span className="text-2xl font-black">97 <span className="text-xs text-muted-foreground font-normal">↗</span></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Daily Cap</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black">120 <span className="text-xs text-muted-foreground font-normal">↗</span></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Avg Flow</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black">259 <span className="text-xs text-muted-foreground font-normal">↗</span></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Peak</span>
            </div>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[3, 3, 3, 3]} barSize={32} opacity={0.8} />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '10px', fontSize: '10px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Path */}
        <div className="lg:col-span-4 premium-panel rounded-2xl p-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/90">Critical Path</h3>
            <Button variant="ghost" size="icon" className="size-8 rounded-full border border-white/10"><MoreHorizontal className="size-4" /></Button>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active ID</span>
                <span className="text-sm font-black mt-1">#17986-WAY</span>
              </div>
              <Badge className="bg-accent/10 text-accent border-none text-[9px] font-black tracking-widest uppercase px-2.5 py-1">In Review</Badge>
            </div>

            <div className="space-y-4">
              <TimelineItem status="complete" label="Initial Research" time="Mar 10" />
              <TimelineItem status="active" label="Compliance" time="Mar 22" />
              <TimelineItem status="pending" label="Catalog" time="Est. Mar 28" />
            </div>

            <div className="mt-2 p-4 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full overflow-hidden">
                  <img src="https://picsum.photos/seed/sarah/100/100" alt="Owner" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Contact</span>
                  <span className="text-[11px] font-bold">Sarah Chen</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-white/5"><Globe className="size-3.5" /></Button>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-white/5"><Star className="size-3.5" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-3 premium-panel rounded-2xl p-0 overflow-hidden relative group">
          <div className="absolute top-5 left-5 z-10 p-3 bg-background/80 backdrop-blur-md rounded-xl border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Deployment Map</h4>
            <p className="text-[11px] font-bold mt-1">EU Zone</p>
          </div>
          <img src="https://picsum.photos/seed/map/800/800" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <Button variant="ghost" size="icon" className="absolute bottom-5 right-5 size-9 rounded-full bg-accent text-accent-foreground shadow-xl">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Expansion Registry */}
      <div className="flex flex-col gap-5">
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Expansion Registry</h2>
        <div className="premium-panel rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.05]">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Target Lead</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Category</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Est. Value</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Stage</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="size-9 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center font-bold text-sm text-primary">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold tracking-tight text-sm text-white group-hover:text-primary transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{p.type}</td>
                  <td className="p-5 text-sm font-black">${(p.estimatedValue / 1000).toFixed(0)}k</td>
                  <td className="p-5 text-[11px] font-bold text-white/80">{p.currentStage}</td>
                  <td className="p-5">
                    <Badge className={cn(
                      "font-black text-[9px] uppercase tracking-widest rounded px-2 py-1 border-none",
                      p.currentStage === "Live" ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"
                    )}>
                      ● {p.currentStage === "Live" ? "Active" : "Processing"}
                    </Badge>
                  </td>
                  <td className="p-5 text-right">
                    <Button variant="ghost" size="icon" className="size-8 rounded-lg opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>
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
    <div className="premium-panel rounded-2xl p-5 flex items-center gap-5 min-w-[240px] group hover:border-accent/30 transition-all cursor-pointer">
      <div className="size-14 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-all">
        <Icon className="size-6 text-muted-foreground group-hover:text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{label}</span>
        <div className="flex items-baseline gap-2.5 mt-1">
          <span className="text-2xl font-black leading-none">{value}</span>
          <span className={cn("text-[9px] font-black", trendUp ? "text-green-500" : "text-red-500")}>
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
        "mt-2 size-2 rounded-full",
        status === 'complete' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
        status === 'active' ? "bg-accent animate-pulse shadow-[0_0_8px_rgba(255,0,255,0.4)]" : "bg-white/10"
      )} />
      <div className="flex flex-col">
        <span className={cn("text-xs font-bold", status === 'pending' ? "text-muted-foreground" : "text-white")}>{label}</span>
        <span className="text-[10px] font-bold text-muted-foreground mt-1">{time}</span>
      </div>
    </div>
  );
}
