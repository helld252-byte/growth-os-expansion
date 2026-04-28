
"use client";

import { useMemo } from "react";
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Target,
  LayoutGrid,
  Loader2,
  Calendar,
  Star,
  Activity,
  ArrowRight,
  Filter,
  Users2,
  Coffee,
  GraduationCap,
  Handshake,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CommandCenter() {
  const firestore = getFirestore();
  
  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: opportunities, isLoading: opLoading } = useCollection(opportunitiesRef);

  const partnersRef = useMemoFirebase(() => collection(firestore, 'partners'), [firestore]);
  const { data: partners, isLoading: pLoading } = useCollection(partnersRef);

  const isLoading = opLoading || pLoading;

  const data = useMemo(() => {
    if (!opportunities || !partners) return null;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Executive KPIs
    const trackedOpps = opportunities.length + partners.length;
    const activeConversations = opportunities.filter(o => o.commStatus && o.commStatus !== 'No outreach').length;
    const inReview = opportunities.filter(o => o.currentStage === 'In Review').length;
    const approvedCount = opportunities.filter(o => o.currentStage === 'Approved').length;
    const livePartnerships = opportunities.filter(o => o.currentStage === 'Live').length + 
                            partners.filter(p => p.status === 'Live' || p.status === 'Active').length;
    
    const contacted = opportunities.filter(o => o.commStatus && o.commStatus !== 'No outreach');
    const responded = contacted.filter(o => ['In discussion', 'Approved', 'Waiting reply'].includes(o.commStatus || ''));
    const responseRate = contacted.length > 0 ? Math.round((responded.length / contacted.length) * 100) : 0;

    // 2. Funnel Stages
    const stages = [
      { label: 'Research', count: opportunities.filter(o => o.currentStage === 'Research' || o.currentStage === 'Not Started').length },
      { label: 'Applied', count: opportunities.filter(o => o.currentStage === 'Applied').length },
      { label: 'In Review', count: opportunities.filter(o => o.currentStage === 'In Review').length },
      { label: 'Approved', count: opportunities.filter(o => o.currentStage === 'Approved').length },
      { label: 'Live', count: opportunities.filter(o => o.currentStage === 'Live').length },
    ];

    // 3. Vertical Breakdown
    const verticals = [
      { label: 'Platforms', count: opportunities.length, icon: Globe, path: '/channels' },
      { label: 'Schools', count: partners.filter(p => p.type === 'School').length, icon: GraduationCap, path: '/schools' },
      { label: 'Cafes', count: partners.filter(p => p.type === 'Cafe' || p.partnerType === 'Cafe').length, icon: Coffee, path: '/cafes' },
      { label: 'Partnerships', count: partners.filter(p => ["Milk Brand", "Co-branding", "Event", "Influencer"].includes(p.type)).length, icon: Handshake, path: '/partnerships' },
      { label: 'Communities', count: partners.filter(p => ["Forum", "Blog", "Review Site"].includes(p.type)).length, icon: Users2, path: '/communities' },
    ];

    // 4. Momentum
    const newLeadsThisWeek = opportunities.filter(o => new Date(o.createdAt || 0) >= sevenDaysAgo).length +
                             partners.filter(p => new Date(p.createdAt || 0) >= sevenDaysAgo).length;
    const movedStages = opportunities.filter(o => new Date(o.updatedAt || 0) >= sevenDaysAgo && o.currentStage !== 'Not Started').length;
    
    // 5. Bottlenecks
    const needsFollowUp = opportunities.filter(o => o.commStatus === 'Waiting reply').sort((a, b) => 
      new Date(a.lastContactDate || 0).getTime() - new Date(b.lastContactDate || 0).getTime()
    )[0];

    const oldestPending = contacted.sort((a, b) => 
      new Date(a.lastContactDate || 0).getTime() - new Date(b.lastContactDate || 0).getTime()
    )[0];

    const stalledCategory = verticals.sort((a, b) => b.count - a.count)[0]?.label;

    // 6. Recent Strategic Activity
    const recentActivity = [...opportunities, ...partners]
      .sort((a, b) => {
        const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || a.createdAt || 0);
        const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);

    return { 
      kpis: { trackedOpps, activeConversations, inReview, approvedCount, livePartnerships, responseRate },
      stages,
      verticals,
      momentum: { newLeadsThisWeek, movedStages },
      bottlenecks: { oldestPending, needsFollowUp, stalledCategory },
      recentActivity
    };
  }, [opportunities, partners]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-tier-4">Scanning Registry</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <Activity className="size-4 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-tier-1">Executive Dashboard</h1>
        </div>
        <p className="text-tier-3 text-[13px] font-medium tracking-tight px-1">Mission progress and pipeline velocity across all active verticals.</p>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <ExecutiveKPI label="Tracked Opps" value={data.kpis.trackedOpps} />
        <ExecutiveKPI label="Active Convos" value={data.kpis.activeConversations} color="text-blue-400" />
        <ExecutiveKPI label="In Review" value={data.kpis.inReview} color="text-amber-400" />
        <ExecutiveKPI label="Approved" value={data.kpis.approvedCount} color="text-violet-400" />
        <ExecutiveKPI label="Live Units" value={data.kpis.livePartnerships} color="text-emerald-400" />
        <ExecutiveKPI label="Response Rate" value={`${data.kpis.responseRate}%`} color="text-primary" />
      </div>

      {/* Funnel Section */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Expansion Funnel Velocity</h3>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Pipeline</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {data.stages.map((stage, i) => (
            <div key={stage.label} className="flex flex-col gap-3 group">
              <div className="flex items-end justify-between px-1">
                <span className="text-[11px] font-bold text-tier-2 group-hover:text-primary transition-colors">{stage.label}</span>
                <span className="text-lg font-bold text-tier-1">{stage.count}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    i === 4 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-primary/40"
                  )} 
                  style={{ width: `${Math.min((stage.count / (data.kpis.trackedOpps || 1)) * 100 * 2, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Vertical Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Vertical Saturation</h3>
          <div className="flex flex-col gap-px bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
            {data.verticals.map((v) => (
              <Link key={v.label} href={v.path} className="px-6 py-4 bg-background/40 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                <div className="flex items-center gap-4">
                  <v.icon className="size-4 text-tier-3 group-hover:text-primary transition-colors" />
                  <span className="text-[13px] font-semibold text-tier-2 group-hover:text-tier-1 transition-colors">{v.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-bold text-tier-1">{v.count}</span>
                  <ChevronRight className="size-3.5 text-tier-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Middle: Momentum & WoW */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Weekly Momentum</h3>
          <div className="premium-panel p-6 rounded-2xl flex flex-col gap-6 h-full justify-between">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">New Leads</span>
                <span className="text-2xl font-bold text-tier-1">+{data.momentum.newLeadsThisWeek}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">Stage Shifts</span>
                <span className="text-2xl font-bold text-tier-1">{data.momentum.movedStages}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.03]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-tier-3 uppercase tracking-tighter">Week-over-Week</span>
                <span className="text-[11px] font-bold text-emerald-400">↑ 12.5%</span>
              </div>
              <div className="h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-500" />
              </div>
            </div>
            <p className="text-[11px] text-tier-3 font-medium leading-relaxed italic">
              "Growth velocity is steady. Focus on moving Approved units to Live to hit EOM targets."
            </p>
          </div>
        </div>

        {/* Right: Bottlenecks */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Attention Required</h3>
          <div className="flex flex-col gap-3">
            <AttentionCard 
              label="Oldest Pending" 
              value={data.bottlenecks.oldestPending?.name || "None"} 
              sub={data.bottlenecks.oldestPending?.lastContactDate || "System Clear"}
            />
            <AttentionCard 
              label="Needs Follow-up" 
              value={data.bottlenecks.needsFollowUp?.name || "None"} 
              sub="Waiting on reply"
              urgent
            />
            <AttentionCard 
              label="Stalled Category" 
              value={data.bottlenecks.stalledCategory} 
              sub="Low velocity detected"
            />
          </div>
        </div>

      </div>

      {/* Recent Strategic Activity */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Strategic Activity Log</h3>
          <Link href="/reports" className="text-[9px] font-bold text-tier-4 uppercase tracking-[0.2em] hover:text-primary transition-colors">Historical Intelligence</Link>
        </div>
        <div className="flex flex-col gap-px bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
          {data.recentActivity.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
}

function ExecutiveKPI({ label, value, color }: any) {
  return (
    <div className="premium-panel p-4 rounded-xl flex flex-col gap-1 border-white/[0.03] hover:border-primary/20 transition-all cursor-default group">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4 group-hover:text-tier-3 transition-colors">{label}</span>
      <span className={cn("text-xl font-bold tracking-tight", color || "text-tier-1")}>{value}</span>
    </div>
  );
}

function AttentionCard({ label, value, sub, urgent }: any) {
  return (
    <div className={cn(
      "p-4 rounded-xl border flex flex-col gap-1 transition-all",
      urgent ? "bg-rose-500/[0.03] border-rose-500/20" : "bg-white/[0.015] border-white/[0.05]"
    )}>
      <span className={cn("text-[9px] font-bold uppercase tracking-widest", urgent ? "text-rose-400" : "text-tier-4")}>{label}</span>
      <span className="text-[13px] font-bold text-tier-2 truncate">{value}</span>
      <span className="text-[10px] font-medium text-tier-4">{sub}</span>
    </div>
  );
}

function ActivityRow({ item }: { item: any }) {
  const date = item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date(item.updatedAt || item.createdAt || 0);
  
  return (
    <div className="px-6 py-3.5 bg-background/40 flex items-center justify-between hover:bg-white/[0.02] transition-colors group border-b border-white/[0.03] last:border-0">
      <div className="flex items-center gap-4">
        <div className="size-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-tier-2 group-hover:text-tier-1 transition-colors">{item.name}</span>
          <span className="text-[10px] text-tier-4 font-medium uppercase tracking-tighter">
            System parameter synced to {item.currentStage || item.status}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Badge variant="outline" className="h-4 px-1.5 text-[8px] uppercase tracking-widest font-bold border-white/5 bg-white/[0.03] text-tier-4">
          {item.currentStage ? "Platform" : "Vertical"}
        </Badge>
        <span className="text-[10px] font-bold text-tier-4 uppercase w-20 text-right">{date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}
