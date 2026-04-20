"use client";

import { 
  BarChart3, 
  Box, 
  Calendar, 
  Download, 
  Filter, 
  Map as MapIcon, 
  MoreHorizontal, 
  Navigation, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Layers,
  Search,
  Zap,
  ChevronRight,
  Globe,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { platforms, tasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

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
  const highPriority = platforms.filter(p => p.priority === "High");

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Dashboard Headline & Top Metrics */}
      <div className="flex flex-col xl:flex-row justify-between gap-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-6xl font-black tracking-tighter leading-none">
            Growth <br /> Operations <br /> Command
          </h1>
          
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 max-w-fit">
            <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe className="size-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Global Markets Database</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Updated: March 25, 2024</span>
            </div>
          </div>
        </div>

        {/* Top Metric Boxes */}
        <div className="flex flex-wrap gap-4">
          <MetricBox 
            label="Total Leads" 
            value="789" 
            trend="+5.45% ↗" 
            trendUp={true} 
            icon={Layers} 
          />
          <MetricBox 
            label="Active Pipeline" 
            value="120" 
            trend="-0.45% ↘" 
            trendUp={false} 
            icon={Navigation} 
          />
          <MetricBox 
            label="Onboarded" 
            value="98" 
            trend="+5.45% ↗" 
            trendUp={true} 
            icon={Box} 
          />
        </div>
      </div>

      {/* Sub Header / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 border-y border-white/[0.03]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
            <Zap className="size-4" /> 5 Pending actions requiring attention
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 font-bold border border-white/5 bg-white/5 rounded-xl px-4 text-xs">
            <Filter className="size-4 mr-2" /> Filters
          </Button>
          <Button variant="ghost" className="h-10 font-bold border border-white/5 bg-white/5 rounded-xl px-4 text-xs">
            Download Report
          </Button>
          <Button className="h-10 font-bold bg-accent hover:bg-accent/80 text-accent-foreground rounded-full px-8 text-xs uppercase tracking-widest">
            Create Initiative
          </Button>
        </div>
      </div>

      {/* Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics View */}
        <div className="lg:col-span-5 premium-panel rounded-[2.5rem] p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg uppercase tracking-widest text-white/90">Market Velocity</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <span className="text-white">Week</span>
              <span>Month</span>
              <span>Quarter</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col">
              <span className="text-2xl font-black">97 <span className="text-xs text-muted-foreground">↗</span></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Daily Cap</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black">120 <span className="text-xs text-muted-foreground">↗</span></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Avg Flow</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black">259 <span className="text-xs text-muted-foreground">↗</span></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Peak Volume</span>
            </div>
          </div>

          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 4, 4]} barSize={40} opacity={0.8} />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Tracking */}
        <div className="lg:col-span-4 premium-panel rounded-[2.5rem] p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg uppercase tracking-widest text-white/90">Critical Path</h3>
            <Button variant="ghost" size="icon" className="size-8 rounded-full border border-white/10"><MoreHorizontal className="size-4" /></Button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Objective</span>
                <span className="text-sm font-black mt-1">#17986-WAY-2024</span>
              </div>
              <Badge className="bg-accent/10 text-accent border-none text-[10px] font-black tracking-widest uppercase px-3 py-1">In Review</Badge>
            </div>

            <div className="space-y-4">
              <TimelineItem status="complete" label="Initial Research" time="Mar 10, 2024" />
              <TimelineItem status="active" label="Insurance Compliance" time="Mar 22, 2024" />
              <TimelineItem status="pending" label="Catalog Finalization" time="Est. Mar 28" />
            </div>

            <div className="mt-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full overflow-hidden">
                  <img src="https://picsum.photos/seed/sarah/100/100" alt="Owner" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Point of Contact</span>
                  <span className="text-xs font-bold">Sarah Chen</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-white/5"><Globe className="size-3.5" /></Button>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-white/5"><Star className="size-3.5" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Market Visualizer */}
        <div className="lg:col-span-3 premium-panel rounded-[2.5rem] p-0 overflow-hidden relative group">
          <div className="absolute top-6 left-6 z-10 p-3 bg-background/80 backdrop-blur-md rounded-2xl border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Deployment Map</h4>
            <p className="text-xs font-bold mt-1">EU Expansion Zone</p>
          </div>
          <img 
            src="https://picsum.photos/seed/map/800/800" 
            alt="Operational Map" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <Button variant="ghost" size="icon" className="absolute bottom-6 right-6 size-10 rounded-full bg-accent text-accent-foreground shadow-2xl hover:scale-110 transition-all">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">Expansion Registry</h2>
          <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase">
             <span>Customize</span>
             <span className="text-white">1-10 of 40</span>
             <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="size-6 rounded-md bg-white/5 p-0"><ChevronRight className="size-3 rotate-180" /></Button>
               <Button variant="ghost" size="icon" className="size-6 rounded-md bg-white/5 p-0"><ChevronRight className="size-3" /></Button>
             </div>
          </div>
        </div>

        <div className="premium-panel rounded-[2rem] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.05]">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Target Lead</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Category</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Estimated Value</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Current Stage</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center font-bold text-primary">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold tracking-tight text-white group-hover:text-primary transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{p.type}</td>
                  <td className="p-6 text-sm font-black">${p.estimatedValue.toLocaleString()}</td>
                  <td className="p-6 text-[11px] font-bold text-white/80">{p.currentStage}</td>
                  <td className="p-6">
                    <Badge className={cn(
                      "font-black text-[9px] uppercase tracking-widest rounded-md px-2.5 py-1 border-none",
                      p.currentStage === "Live" ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"
                    )}>
                      ● {p.currentStage === "Live" ? "Delivered" : "Processing"}
                    </Badge>
                  </td>
                  <td className="p-6 text-right">
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
    <div className="premium-panel rounded-[2rem] p-6 flex items-center gap-6 min-w-[260px] group hover:border-accent/30 transition-all cursor-pointer">
      <div className="size-16 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-all">
        <Icon className="size-6 text-muted-foreground group-hover:text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{label}</span>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-3xl font-black">{value}</span>
          <span className={cn("text-[10px] font-black", trendUp ? "text-green-500" : "text-red-500")}>
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
        "mt-1.5 size-2 rounded-full",
        status === 'complete' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
        status === 'active' ? "bg-accent animate-pulse shadow-[0_0_8px_rgba(255,0,255,0.4)]" : "bg-white/10"
      )} />
      <div className="flex flex-col">
        <span className={cn("text-xs font-bold", status === 'pending' ? "text-muted-foreground" : "text-white")}>{label}</span>
        <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{time}</span>
      </div>
    </div>
  );
}
