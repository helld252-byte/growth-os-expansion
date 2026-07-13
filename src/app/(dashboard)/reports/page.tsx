"use client";

import { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LabelList
} from "recharts";
import { 
  CheckCircle2, 
  Download,
  TrendingUp,
  Zap,
  Globe,
  BarChart3,
  Loader2,
  Layers,
  Flag,
  Coffee,
  GraduationCap,
  Target,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const firestore = getFirestore();
  
  // Fetch real data from all core collections
  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: opportunities, isLoading: opLoading } = useCollection(opportunitiesRef);

  const partnersRef = useMemoFirebase(() => collection(firestore, 'partners'), [firestore]);
  const { data: partners, isLoading: partnerLoading } = useCollection(partnersRef);

  const tasksRef = useMemoFirebase(() => collection(firestore, 'tasks'), [firestore]);
  const { data: tasks, isLoading: tasksLoading } = useCollection(tasksRef);

  const isLoading = opLoading || partnerLoading || tasksLoading;

  // Process data for charts
  const metrics = useMemo(() => {
    if (!opportunities || !partners || !tasks) return null;

    // Vertical Distribution
    const verticalData = [
      { name: 'Schools', value: partners.filter(p => p.type === 'School').length, color: 'hsl(var(--primary))' },
      { name: 'Cafes', value: partners.filter(p => p.type === 'Cafe' || p.partnerType === 'Cafe').length, color: 'hsl(var(--accent))' },
      { name: 'Partners', value: partners.filter(p => ["Milk Brand", "Co-branding", "Event", "Influencer"].includes(p.type)).length, color: '#94a3b8' },
      { name: 'Communities', value: partners.filter(p => ["Forum", "Blog", "Review Site"].includes(p.type)).length, color: '#6366f1' },
    ].filter(v => v.value > 0);

    // Platform Pipeline Stages
    const stages = ['Not Started', 'Research', 'Applied', 'In Review', 'Approved', 'Onboarding', 'Live'];
    const pipelineData = stages.map(stage => ({
      stage,
      count: opportunities.filter(o => o.currentStage === stage).length
    }));

    // High Level Totals
    const totalEstValue = opportunities.reduce((acc, curr) => acc + (Number(curr.estimatedValue) || 0), 0);
    const liveOps = opportunities.filter(o => o.currentStage === 'Live').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const taskVelocity = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return {
      verticalData,
      pipelineData,
      totalEstValue,
      liveOps,
      taskVelocity,
      totalUnits: partners.length + opportunities.length,
      bestVertical: [...verticalData].sort((a, b) => b.value - a.value)[0]?.name || "N/A"
    };
  }, [opportunities, partners, tasks]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Aggregating Cloud Intel...</span>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* Context Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
              <BarChart3 className="size-5.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight text-tier-1">Performance Intel</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Operational Analytics Feed</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-xl">
            Executive oversight of expansion velocity, vertical saturation, and projected pipeline value across Unit-01.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 px-4 rounded-xl border border-border text-[10px] font-bold uppercase tracking-wider text-tier-2 hover:bg-secondary/50">
            <Download className="size-3.5 mr-2" /> Export Registry
          </Button>
          <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
            Recalibrate Metrics
          </Button>
        </div>
      </div>

      {/* Primary Metrics Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Projected Value" 
          value={`$${(metrics.totalEstValue / 1000).toFixed(1)}k`} 
          icon={TrendingUp} 
          iconColor="text-emerald-500" 
          trend="EST. ARR"
          trendUp={true} 
        />
        <StatCard 
          label="Execution Velocity" 
          value={`${metrics.taskVelocity.toFixed(0)}%`} 
          icon={Zap} 
          iconColor="text-primary" 
          trend="TASKS OK"
          trendUp={true} 
        />
        <StatCard 
          label="Active Initiatives" 
          value={metrics.liveOps} 
          icon={CheckCircle2} 
          iconColor="text-accent" 
          trend="STATUS: LIVE"
          trendUp={true} 
        />
        <StatCard 
          label="Tactical Reach" 
          value={metrics.totalUnits} 
          icon={Globe} 
          iconColor="text-blue-400" 
          trend="TOTAL UNITS"
          trendUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Pipeline Distribution Bar Chart */}
        <div className="xl:col-span-8 premium-panel rounded-3xl p-8 flex flex-col gap-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.25em] text-tier-4">Mission Pipeline Distribution</h3>
              <p className="text-[14px] font-medium text-tier-2 mt-1">Growth opportunities indexed by operational phase</p>
            </div>
            <Layers className="size-4 text-tier-3" />
          </div>

          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.pipelineData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="stage" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 8 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '14px', fontSize: '11px', fontWeight: 600, shadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={42}>
                  <LabelList dataKey="count" position="top" fill="hsl(var(--primary))" fontSize={11} fontWeight={800} offset={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vertical Saturation Pie Chart */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="premium-panel rounded-3xl p-8 flex flex-col gap-8 shadow-sm flex-1">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.25em] text-tier-4">Vertical Saturation</h3>
              <p className="text-[14px] font-medium text-tier-2 mt-1">Active market segment coverage</p>
            </div>

            <div className="h-[200px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={metrics.verticalData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={65} 
                    outerRadius={85} 
                    paddingAngle={8} 
                    dataKey="value"
                  >
                    {metrics.verticalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-tier-1 tracking-tighter leading-none">{metrics.totalUnits}</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-tier-4 mt-2">Units</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              {metrics.verticalData.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[12px] font-semibold text-tier-2 group-hover:text-tier-1 transition-colors">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-tier-1">{item.value}</span>
                    <span className="text-[10px] font-bold text-tier-4">({((item.value / metrics.totalUnits) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-panel rounded-3xl p-6 flex flex-col gap-4 bg-emerald-500/5 border-emerald-500/20 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Leading Vertical</span>
              <Target className="size-4 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-tier-1">{metrics.bestVertical}</span>
              <p className="text-[11px] text-tier-3 font-medium mt-1 uppercase tracking-wider">Strategic primary market</p>
            </div>
          </div>
        </div>

        {/* Intelligence Insights Summary */}
        <div className="xl:col-span-12 premium-panel rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] border-border shadow-sm">
          <div className="flex items-center gap-10">
            <div className="size-16 rounded-2xl bg-white border border-border flex items-center justify-center shadow-xl group">
              <ShieldCheck className="size-7 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h4 className="text-xl font-semibold tracking-tight text-tier-1 leading-none">Operational Intelligence Synchronized</h4>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg">System Integrity: 100%</Badge>
              </div>
              <p className="text-tier-2 text-[14px] leading-relaxed max-w-4xl text-justify">
                Mission analytics are aggregated in real-time across your global expansion pipeline. The <span className="text-tier-1 font-semibold">Pipeline Distribution</span> reflects tactical transitions between research and live operations, while <span className="text-tier-1 font-semibold">Vertical Saturation</span> ensures balanced market penetration. Unit-01 is currently maintaining an optimal task execution velocity, indicating a healthy transition from outreach to onboarding.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 lg:mt-0 shrink-0">
            <Button className="h-12 bg-primary hover:bg-primary/90 text-white font-bold uppercase text-[11px] tracking-[0.15em] rounded-xl px-10 shadow-xl shadow-primary/20 active:scale-95 transition-all">
              Launch Insight Engine
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
