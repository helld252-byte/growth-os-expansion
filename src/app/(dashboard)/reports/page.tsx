"use client";

import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Target, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Download,
  TrendingUp,
  Zap,
  Globe,
  Calendar,
  ArrowUpRight,
  Filter
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
  { month: 'Oct', apps: 4, live: 1, revenue: 12000 },
  { month: 'Nov', apps: 6, live: 1, revenue: 15000 },
  { month: 'Dec', apps: 8, live: 2, revenue: 22000 },
  { month: 'Jan', apps: 12, live: 3, revenue: 45000 },
  { month: 'Feb', apps: 15, live: 4, revenue: 68000 },
  { month: 'Mar', apps: 20, live: 6, revenue: 95000 },
];

const marketShare = [
  { name: 'EU', value: 45, color: 'hsl(var(--primary))' },
  { name: 'US', value: 35, color: 'hsl(var(--accent))' },
  { name: 'CA', value: 15, color: 'hsl(var(--muted-foreground))' },
  { name: 'Global', value: 5, color: 'hsl(var(--primary) / 0.5)' },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("Quarterly");
  const liveCount = platforms.filter(p => p.currentStage === "Live").length;
  const totalValue = platforms.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1">
              Performance Unit
            </Badge>
            <div className="h-px w-8 bg-white/10" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Analytics Platform</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Performance Intelligence</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-full p-1 flex items-center">
            {["Monthly", "Quarterly", "Annual"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                  period === p ? "bg-primary text-white shadow-lg active-glow" : "text-muted-foreground hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" className="glass-card font-bold gap-2 h-11 border-white/10 px-6 rounded-xl">
            <Download className="size-4" /> Export Ledger
          </Button>
        </div>
      </div>

      {/* Primary Metrics Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Cumulative Pipeline" 
          value={`$${(totalValue / 1000000).toFixed(1)}M`} 
          icon={TrendingUp} 
          iconColor="text-primary"
          trend="+12.4%"
          trendUp={true}
        />
        <StatCard 
          label="Conversion Velocity" 
          value="24.5%" 
          icon={Zap} 
          iconColor="text-accent"
          trend="+5.2%"
          trendUp={true}
        />
        <StatCard 
          label="Live Channels" 
          value={liveCount} 
          icon={CheckCircle2} 
          iconColor="text-green-500"
          trend="+2"
          trendUp={true}
        />
        <StatCard 
          label="Market Saturation" 
          value="68%" 
          icon={Globe} 
          iconColor="text-muted-foreground"
          trend="-1.2%"
          trendUp={false}
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Growth Momentum Area Chart */}
        <div className="xl:col-span-8 premium-panel rounded-[2.5rem] p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-lg uppercase tracking-widest text-white/90">Expansion Velocity</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Growth metrics across active expansion zones</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pipeline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-accent" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrend}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'black', border: '1px solid hsl(var(--border))', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="live" stroke="hsl(var(--accent))" strokeWidth={4} fillOpacity={1} fill="url(#colorLive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Concentration Pie */}
        <div className="xl:col-span-4 premium-panel rounded-[2.5rem] p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg uppercase tracking-widest text-white/90">Regional Reach</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active market distribution</p>
          </div>

          <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {marketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black">4</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Zones</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {marketShare.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">{item.name} Market</span>
                </div>
                <span className="text-[11px] font-black">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline conversion analysis */}
        <div className="xl:col-span-6 premium-panel rounded-[2.5rem] p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-lg uppercase tracking-widest text-white/90">Funnel Integrity</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lead conversion status registry</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }}
                />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 10, 10, 0]} 
                  barSize={24}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Card */}
        <div className="xl:col-span-6 premium-panel rounded-[2.5rem] p-8 flex flex-col justify-between bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="size-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                <Zap className="size-6 text-accent animate-pulse" />
              </div>
              <Badge className="bg-accent/20 text-accent border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">AI INSIGHT</Badge>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-2xl font-black tracking-tight">Expansion Acceleration Detected</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Market velocity in the <span className="text-white font-bold">EU Zone</span> has increased by <span className="text-accent font-bold">18.4%</span> since the last audit. Current onboarding cycles are 4 days faster than previous quarter average.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-white/5">
            <Button className="flex-1 h-12 bg-white text-black hover:bg-white/90 font-black uppercase text-[10px] tracking-widest rounded-2xl">
              Optimize Strategy
            </Button>
            <Button variant="ghost" className="size-12 rounded-2xl border border-white/10 p-0 flex items-center justify-center">
              <ArrowUpRight className="size-5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
