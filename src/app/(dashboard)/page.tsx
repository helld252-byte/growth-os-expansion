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
    <div className="max-w-[1440px] mx-auto flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* Dashboard Headline & Top Metrics */}
      <div className="flex flex-col xl:flex-row justify-between gap-8">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-black tracking-tighter leading-none">
            Growth <br /> Operations <br /> Command
          </h1>
          
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 max-w-fit">
            <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Globe className="size-4 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white leading-tight">Global Market Engine</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">MAR 25, 2024</span>
            </div>
          </div>
        </div>

        {/* Top Metric Boxes */}
        <div className="flex flex-wrap gap-3">
          <MetricBox label="Leads" value="789" trend="+5.45% ↗" trendUp={true} icon={Layers} />
          <MetricBox label="Pipeline" value="120" trend="-0.45% ↘" trendUp={false} icon={Navigation} />
          <MetricBox label="Onboarded" value="98" trend="+5.45% ↗" trendUp={true} icon={Box} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-y border-white/[0.03]">
        <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest">
          <Zap className="size-3.5" /> 5 pending actions
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-8 font-bold border border-white/5 bg-white/5 rounded-lg px-3 text-[10px]">
            <Filter className="size-3.5 mr-1.5" /> Filters
          </Button>
          <Button className="h-8 font-bold bg-accent hover:bg-accent/80 text-accent-foreground rounded-full px-5 text-[10px] uppercase tracking-widest">
            Create Initiative
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Analytics */}
        <div className="lg:col-span-5 premium-panel rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/90">Market Velocity</h3>
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <span className="text-white">Week</span>
              <span>Month</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xl font-black">97 <span className="text-[10px] text-muted-foreground">↗</span></span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Daily Cap</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black">120 <span className="text-[10px] text-muted-foreground">↗</span></span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Avg Flow</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black">259 <span className="text-[10px] text-muted-foreground">↗</span></span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Peak</span>
            </div>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[2, 2, 2, 2]} barSize={28} opacity={0.8} />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', fontSize: '9px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Path */}
        <div className="lg:col-span-4 premium-panel rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/90">Critical Path</h3>
            <Button variant="ghost" size="icon" className="size-7 rounded-full border border-white/10"><MoreHorizontal className="size-3.5" /></Button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Active ID</span>
                <span className="text-xs font-black mt-0.5">#17986-WAY</span>
              </div>
              <Badge className="bg-accent/10 text-accent border-none text-[8px] font-black tracking-widest uppercase px-2 py-0.5">In Review</Badge>
            </div>

            <div className="space-y-3">
              <TimelineItem status="complete" label="Initial Research" time="Mar 10" />
              <TimelineItem status="active" label="Compliance" time="Mar 22" />
              <TimelineItem status="pending" label="Catalog" time="Est. Mar 28" />
            </div>

            <div className="mt-2 p-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full overflow-hidden">
                  <img src="https://picsum.photos/seed/sarah/100/100" alt="Owner" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Contact</span>
                  <span className="text-[10px] font-bold">Sarah Chen</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="icon" className="size-7 rounded-lg bg-white/5"><Globe className="size-3" /></Button>
                <Button variant="ghost" size="icon" className="size-7 rounded-lg bg-white/5"><Star className="size-3" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-3 premium-panel rounded-2xl p-0 overflow-hidden relative group">
          <div className="absolute top-4 left-4 z-10 p-2.5 bg-background/80 backdrop-blur-md rounded-xl border border-white/10">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-accent">Deployment Map</h4>
            <p className="text-[10px] font-bold mt-0.5">EU Zone</p>
          </div>
          <img src="https://picsum.photos/seed/map/800/800" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <Button variant="ghost" size="icon" className="absolute bottom-4 right-4 size-8 rounded-full bg-accent text-accent-foreground shadow-xl">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Registry */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Expansion Registry</h2>
        <div className="premium-panel rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.05]">
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Target Lead</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Category</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Est. Value</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Stage</th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center font-bold text-xs text-primary">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold tracking-tight text-xs text-white group-hover:text-primary transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.type}</td>
                  <td className="p-4 text-xs font-black">${(p.estimatedValue / 1000).toFixed(0)}k</td>
                  <td className="p-4 text-[10px] font-bold text-white/80">{p.currentStage}</td>
                  <td className="p-4">
                    <Badge className={cn(
                      "font-black text-[8px] uppercase tracking-widest rounded px-1.5 py-0.5 border-none",
                      p.currentStage === "Live" ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"
                    )}>
                      ● {p.currentStage === "Live" ? "Active" : "Processing"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="size-7 rounded-lg opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-3.5" /></Button>
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
    <div className="premium-panel rounded-2xl p-4 flex items-center gap-4 min-w-[210px] group hover:border-accent/30 transition-all cursor-pointer">
      <div className="size-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-all">
        <Icon className="size-5 text-muted-foreground group-hover:text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{label}</span>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-xl font-black leading-none">{value}</span>
          <span className={cn("text-[8px] font-black", trendUp ? "text-green-500" : "text-red-500")}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ label, time, status }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn(
        "mt-1.5 size-1.5 rounded-full",
        status === 'complete' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
        status === 'active' ? "bg-accent animate-pulse shadow-[0_0_8px_rgba(255,0,255,0.4)]" : "bg-white/10"
      )} />
      <div className="flex flex-col">
        <span className={cn("text-[11px] font-bold", status === 'pending' ? "text-muted-foreground" : "text-white")}>{label}</span>
        <span className="text-[9px] font-bold text-muted-foreground mt-0.5">{time}</span>
      </div>
    </div>
  );
}
