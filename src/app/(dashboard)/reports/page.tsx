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
  GraduationCap
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
      totalUnits: partners.length + opportunities.length
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.03]">
        <div className="flex items-center gap-5">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg active-glow">
            <BarChart3 className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Performance Intel</h1>
            <p className="text-[11px] text-tier-3 font-semibold uppercase tracking-widest mt-1">
              Live mission analytics synchronized from Unit-01 cloud registry.
            </p>
          </div>
        </div>

        <Button variant="outline" className="h-10 font-bold gap-2.5 border-white/5 bg-white/[0.02] px-6 rounded-xl text-[11px] uppercase tracking-wider text-tier-2 hover:text-white hover:bg-white/[0.05] transition-all">
          <Download className="size-4" /> Export Registry
        </Button>
      </div>

      {/* Primary Metrics Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Estimated ARR" 
          value={`$${(metrics.totalEstValue / 1000).toFixed(1)}k`} 
          icon={TrendingUp} 
          iconColor="text-emerald-500" 
          trend="Total Platform Value"
          trendUp={true} 
        />
        <StatCard 
          label="Task Execution" 
          value={`${metrics.taskVelocity.toFixed(0)}%`} 
          icon={Zap} 
          iconColor="text-primary" 
          trend="Completion Velocity"
          trendUp={true} 
        />
        <StatCard 
          label="Active Initiatives" 
          value={metrics.liveOps} 
          icon={CheckCircle2} 
          iconColor="text-accent" 
          trend="Status: LIVE"
          trendUp={true} 
        />
        <StatCard 
          label="Tactical Reach" 
          value={metrics.totalUnits} 
          icon={Globe} 
          iconColor="text-blue-400" 
          trend="Total Registry Units"
          trendUp={true} 
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Pipeline Distribution Bar Chart */}
        <div className="xl:col-span-8 premium-panel rounded-3xl p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.25em] text-tier-4">Platform Pipeline Distribution</h3>
              <p className="text-[14px] font-medium text-tier-2 mt-1">Distribution of growth opportunities by mission stage</p>
            </div>
            <Layers className="size-4 text-primary" />
          </div>

          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.pipelineData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
                <XAxis 
                  dataKey="stage" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground)/0.6)', fontSize: 10, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground)/0.6)', fontSize: 10, fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.03 }}
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', fontSize: '11px', fontWeight: 600, backdropFilter: 'blur(12px)', color: '#fff' }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={48}>
                  <LabelList dataKey="count" position="top" fill="hsl(var(--primary))" fontSize={11} fontWeight={800} offset={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vertical Saturation Pie Chart */}
        <div className="xl:col-span-4 premium-panel rounded-3xl p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-[10px] uppercase tracking-[0.25em] text-tier-4">Vertical Saturation</h3>
            <p className="text-[14px] font-medium text-tier-2 mt-1">Active market coverage</p>
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
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" opacity={0.8} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white tracking-tighter leading-none">{metrics.totalUnits}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-tier-4 mt-2">Units</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-white/[0.03]">
            {metrics.verticalData.map((item) => (
              <div key={item.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[12px] font-semibold text-tier-2 group-hover:text-white transition-colors">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-white">{item.value}</span>
                  <span className="text-[10px] font-bold text-tier-4">({((item.value / metrics.totalUnits) * 100).toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Insights Summary */}
        <div className="xl:col-span-12 premium-panel rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r from-primary/5 via-transparent to-accent/5 border-primary/10 shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="size-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shadow-inner group">
              <Zap className="size-6 text-primary group-hover:scale-110 transition-transform animate-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-semibold tracking-tight text-white leading-none">Operational Intelligence Synchronized</h4>
                <Badge className="bg-primary/20 text-primary border-primary/30 font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg">System Integrity: 100%</Badge>
              </div>
              <p className="text-tier-3 text-[14px] leading-relaxed max-w-3xl">
                Analytics are aggregated across all growth verticals. The <span className="text-white font-semibold">Expansion Velocity</span> metrics reflect real-time transitions in your Platform and Partner pipelines. Task completion rates are calculated based on the global execution backlog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 lg:mt-0">
            <Button className="h-11 bg-primary hover:bg-primary/90 text-white font-bold uppercase text-[11px] tracking-wider rounded-xl px-8 shadow-xl shadow-primary/20 active:scale-95 transition-all">
              Optimize Strategic Path
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
