"use client";

import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from "recharts";
import { 
  CheckCircle2, 
  Download,
  TrendingUp,
  Zap,
  Globe,
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { platforms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const funnelData = [
  { name: 'Research', value: 12 },
  { name: 'Applied', value: 8 },
  { name: 'In Review', value: 5 },
  { name: 'Approved', value: 3 },
  { name: 'Live', value: 2 },
];

const growthTrend = [
  { month: 'Oct', apps: 4, live: 1 },
  { month: 'Nov', apps: 6, live: 1 },
  { month: 'Dec', apps: 8, live: 2 },
  { month: 'Jan', apps: 12, live: 3 },
  { month: 'Feb', apps: 15, live: 4 },
  { month: 'Mar', apps: 20, live: 6 },
];

const marketShare = [
  { name: 'EU', value: 45, color: 'hsl(var(--primary))' },
  { name: 'US', value: 35, color: 'hsl(var(--accent))' },
  { name: 'Global', value: 20, color: 'hsl(var(--muted-foreground) / 0.5)' },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("Quarterly");
  const liveCount = platforms.filter(p => p.currentStage === "Live").length;
  const totalValue = platforms.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* Context Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <BarChart3 className="size-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-extrabold tracking-tight">Performance Intel</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
              High-velocity market metrics and growth trajectory analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-full p-1 flex items-center">
            {["Monthly", "Quarterly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                  period === p ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" className="h-8 font-bold gap-1.5 border-white/10 px-4 rounded-lg text-[9px] uppercase tracking-wider">
            <Download className="size-3" /> Export
          </Button>
        </div>
      </div>

      {/* Metrics Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pipeline" value={`$${(totalValue / 1000000).toFixed(1)}M`} icon={TrendingUp} iconColor="text-primary" trend="+12.4%" trendUp={true} />
        <StatCard label="Velocity" value="24.5%" icon={Zap} iconColor="text-accent" trend="+5.2%" trendUp={true} />
        <StatCard label="Live" value={liveCount} icon={CheckCircle2} iconColor="text-green-500" trend="+2" trendUp={true} />
        <StatCard label="Market" value="68%" icon={Globe} iconColor="text-muted-foreground" trend="-1.2%" trendUp={false} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Momentum Area Chart */}
        <div className="xl:col-span-8 premium-panel rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-bold text-xs uppercase tracking-widest text-white/90">Expansion Velocity</h3>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active market growth metrics</p>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrend}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8, fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8, fontWeight: 800 }} />
                <Tooltip contentStyle={{ backgroundColor: 'black', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '8px' }} />
                <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="live" stroke="hsl(var(--accent))" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Reach Pie */}
        <div className="xl:col-span-4 premium-panel rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col">
            <h3 className="font-bold text-xs uppercase tracking-widest text-white/90">Regional Reach</h3>
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Market concentration</p>
          </div>

          <div className="h-[160px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={marketShare} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={6} dataKey="value">
                  {marketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black leading-none">4</span>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">Zones</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {marketShare.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">{item.name} Market</span>
                </div>
                <span className="text-[9px] font-black">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel integrity */}
        <div className="xl:col-span-6 premium-panel rounded-2xl p-6 flex flex-col gap-6">
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/90">Funnel Integrity</h3>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8, fontWeight: 800 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={14} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Card */}
        <div className="xl:col-span-6 premium-panel rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-primary/10 via-background to-accent/5 border-primary/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="size-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                <Zap className="size-4 text-accent animate-pulse" />
              </div>
              <Badge className="bg-accent/20 text-accent border-none font-black text-[7px] uppercase tracking-widest px-2 py-0.5">AI INSIGHT</Badge>
            </div>
            
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-black tracking-tight">Expansion Acceleration</h4>
              <p className="text-muted-foreground text-[10px] leading-relaxed">
                Market velocity in the <span className="text-white font-bold">EU Zone</span> has increased by <span className="text-accent font-bold">18.4%</span>. Onboarding cycles are 4 days faster than average.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button className="flex-1 h-8 bg-white text-black hover:bg-white/90 font-black uppercase text-[8px] tracking-[0.2em] rounded-lg">
              Optimize Strategy
            </Button>
            <Button variant="ghost" className="size-8 rounded-lg border border-white/10 p-0 flex items-center justify-center hover:bg-white/5">
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
