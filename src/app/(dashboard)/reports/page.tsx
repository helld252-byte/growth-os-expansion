
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
  Cell
} from "recharts";
import { 
  CheckCircle2, 
  Download,
  TrendingUp,
  Zap,
  Globe,
  ArrowUpRight,
  BarChart3,
  Loader2
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";

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
  const firestore = getFirestore();
  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: opportunities, isLoading } = useCollection(opportunitiesRef);

  const liveCount = (opportunities || []).filter(p => p.currentStage === "Live").length;
  const totalValue = (opportunities || []).reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Calculating Metrics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* Context Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center">
            <BarChart3 className="size-5 text-accent/60" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Performance Intel</h1>
            <p className="text-[10px] text-muted-foreground/40 font-semibold uppercase tracking-widest mt-0.5">
              High-velocity market metrics and tactical trajectory analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/[0.015] border border-white/[0.03] rounded-full p-1 flex items-center">
            {["Monthly", "Quarterly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-all",
                  period === p ? "bg-primary/20 text-white shadow-sm" : "text-muted-foreground/30 hover:text-white/60"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" className="h-8 font-medium gap-2 border-white/5 px-4 rounded-lg text-[10px] uppercase tracking-wider text-muted-foreground/60 hover:text-white">
            <Download className="size-3" /> Export
          </Button>
        </div>
      </div>

      {/* Metrics Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pipeline" value={`$${(totalValue / 1000).toFixed(1)}k`} icon={TrendingUp} iconColor="text-primary/60" trend="+12.4%" trendUp={true} />
        <StatCard label="Onboarding Velocity" value="24.5%" icon={Zap} iconColor="text-accent/60" trend="+5.2%" trendUp={true} />
        <StatCard label="Live Units" value={liveCount} icon={CheckCircle2} iconColor="text-green-500/60" trend="+2" trendUp={true} />
        <StatCard label="Market Saturation" value="68%" icon={Globe} iconColor="text-muted-foreground/40" trend="-1.2%" trendUp={false} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Momentum Area Chart */}
        <div className="xl:col-span-8 premium-panel rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground/30">Expansion Velocity</h3>
              <p className="text-[12px] font-medium text-white/60 mt-1">Active market growth vs. live operationalization</p>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrend}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground)/0.3)', fontSize: 9, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground)/0.3)', fontSize: 9, fontWeight: 500 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '9px', backdropFilter: 'blur(8px)' }} />
                <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" strokeWidth={1.5} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="live" stroke="hsl(var(--accent))" strokeWidth={1.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Reach Pie */}
        <div className="xl:col-span-4 premium-panel rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col">
            <h3 className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground/30">Regional Reach</h3>
            <p className="text-[12px] font-medium text-white/60 mt-1">Market concentration</p>
          </div>

          <div className="h-[160px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={marketShare} cx="50%" cy="50%" innerRadius={55} outerRadius={68} paddingAngle={4} dataKey="value">
                  {marketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.7} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white leading-none">{liveCount}</span>
              <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/30 mt-1">Live Units</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {marketShare.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium text-white/60">{item.name} Operations</span>
                </div>
                <span className="text-[11px] font-semibold text-white/40">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Card */}
        <div className="xl:col-span-12 premium-panel rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r from-primary/5 via-background to-accent/5 border-primary/10">
          <div className="flex items-center gap-6">
            <div className="size-11 rounded-xl bg-white/[0.015] border border-white/[0.03] flex items-center justify-center">
              <Zap className="size-4.5 text-accent/80 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold tracking-tight text-white">Cloud Backend Synchronized</h4>
                <Badge variant="outline" className="bg-accent/10 text-accent/80 border-accent/20 font-medium text-[8px] uppercase tracking-widest px-2 py-0">System Status</Badge>
              </div>
              <p className="text-secondary text-[12px] leading-relaxed max-w-2xl">
                Your performance metrics are now being served live from <span className="text-white font-medium">Firestore</span>. All growth initiatives and historical data are synchronized across the tactical cloud network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 lg:mt-0">
            <Button className="h-9 bg-white text-black hover:bg-white/90 font-semibold uppercase text-[9px] tracking-wider rounded-lg px-6">
              Optimize Strategy
            </Button>
            <Button variant="ghost" className="size-9 rounded-lg border border-white/[0.03] p-0 flex items-center justify-center text-muted-foreground/40 hover:text-white">
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
