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

    // 1. KPIs
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

    // 3. Verticals
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
    
    const repliesReceived = opportunities.filter(o => 
      new Date(o.updatedAt || 0) >= sevenDaysAgo && 
      ['In discussion', 'Approved', 'Rejected'].includes(o.commStatus || '')
    ).length;

    const wins = opportunities.filter(o => 
      new Date(o.updatedAt || 0) >= sevenDaysAgo && 
      ['Approved', 'Live'].includes(o.currentStage)
    ).length + partners.filter(p => 
      new Date(p.updatedAt || p.createdAt || 0) >= sevenDaysAgo && 
      ['Active', 'Live', 'Approved'].includes(p.status)
    ).length;
    
    // 5. Bottlenecks
    const needsFollowUp = opportunities.filter(o => o.commStatus === 'Waiting reply').sort((a, b) => 
      new Date(a.lastContactDate || 0).getTime() - new Date(b.lastContactDate || 0).getTime()
    )[0];

    const oldestPending = contacted.sort((a, b) => 
      new Date(a.lastContactDate || 0).getTime() - new Date(b.lastContactDate || 0).getTime()
    )[0];

    const stalledCategory = verticals.sort((a, b) => b.count - a.count)[0]?.label;

    // 6. Recent Updates
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
      momentum: { newLeadsThisWeek, movedStages, repliesReceived, wins },
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
    <div className="max-w-[1400px] mx-auto flex flex-col gap-14 animate-in fade-in duration-700">
      
      {/* Header & Executive Strip */}
      <div className="flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg active-glow">
              <Activity className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-tier-1 leading-none">Command Center</h1>
              <p className="text-tier-4 text-[11px] font-bold uppercase tracking-[0.2em] mt-1.5">Today’s growth priorities</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3">
             <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest px-3 py-1">System Live</Badge>
          </div>
        </header>

        {/* Slim Executive Stats Strip */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 flex items-center justify-between divide-x divide-white/[0.05] shadow-xl backdrop-blur-sm">
          <StatModule label="Tracked Units" value={data.kpis.trackedOpps} />
          <StatModule label="In Review" value={data.kpis.inReview} />
          <StatModule label="Live" value={data.kpis.livePartnerships} highlight />
          <StatModule label="Active Conversations" value={data.kpis.activeConversations} />
          <StatModule label="Response Rate" value={`${data.kpis.responseRate}%`} />
          <StatModule label="This Week %" value="+12.5%" color="text-emerald-400" />
        </div>
      </div>

      {/* Growth Pipeline Section */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-4">Growth Pipeline</h3>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {data.stages.map((stage, i) => (
            <div key={stage.label} className="flex flex-col gap-3.5 group">
              <div className="flex items-end justify-between px-1">
                <span className="text-[11px] font-medium text-tier-3 group-hover:text-tier-1 transition-colors uppercase tracking-widest">{stage.label}</span>
                <span className="text-xl font-bold text-tier-1">{stage.count}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Units by Category */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Units by Category</h3>
          <div className="flex flex-col gap-px bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden shadow-xl">
            {data.verticals.map((v) => (
              <Link key={v.label} href={v.path} className="px-6 py-4.5 bg-background/40 flex items-center justify-between hover:bg-white/[0.02] transition-all group border-b border-white/[0.02] last:border-0">
                <div className="flex items-center gap-4">
                  <v.icon className="size-4 text-tier-3 group-hover:text-primary transition-colors" />
                  <span className="text-[13px] font-medium text-tier-2 group-hover:text-tier-1 transition-colors">{v.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-medium text-tier-1">{v.count}</span>
                  <ChevronRight className="size-3.5 text-tier-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* This Week Progress */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">This Week Progress</h3>
          <div className="premium-panel p-8 rounded-2xl flex flex-col gap-8 h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              <ProgressMetric label="New Leads" value={data.momentum.newLeadsThisWeek} />
              <ProgressMetric label="Replies Received" value={data.momentum.repliesReceived} />
              <ProgressMetric label="Moved Forward" value={data.momentum.movedStages} />
              <ProgressMetric label="Wins" value={data.momentum.wins} color="text-emerald-400" />
            </div>

            <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-white/[0.03]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-tier-4 uppercase tracking-widest">Growth Velocity</span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                  +12.5% WoW
                </Badge>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-semibold text-tier-2 uppercase tracking-wide">Focus Area: <span className="text-tier-1">{data.bottlenecks.stalledCategory || "Schools"}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Needs Attention</h3>
          <div className="flex flex-col gap-4">
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
              sub="Low activity detected"
            />
          </div>
        </div>

      </div>

      {/* Recent Updates */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Recent Updates</h3>
          <Link href="/reports" className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:opacity-80 transition-colors">View All Reports</Link>
        </div>
        <div className="flex flex-col gap-px bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden shadow-xl">
          {data.recentActivity.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
}

function StatModule({ label, value, highlight, color }: { label: string, value: string | number, highlight?: boolean, color?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4 first:pl-0 last:pr-0">
      <span className={cn(
        "text-lg font-bold tracking-tight",
        color ? color : highlight ? "text-primary" : "text-tier-1"
      )}>
        {value}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4 whitespace-nowrap">{label}</span>
    </div>
  );
}

function ProgressMetric({ label, value, color }: { label: string, value: number, color?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">{label}</span>
      <span className={cn("text-3xl font-bold tracking-tight", color || "text-tier-1")}>{value}</span>
    </div>
  );
}

function AttentionCard({ label, value, sub, urgent }: any) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border flex flex-col gap-1.5 transition-all shadow-lg",
      urgent ? "bg-rose-500/[0.03] border-rose-500/20" : "bg-white/[0.015] border-white/[0.05]"
    )}>
      <span className={cn("text-[9px] font-bold uppercase tracking-widest mb-0.5", urgent ? "text-rose-400" : "text-tier-4")}>{label}</span>
      <span className="text-[14px] font-bold text-tier-2 truncate">{value}</span>
      <span className="text-[11px] font-medium text-tier-4">{sub}</span>
    </div>
  );
}

function ActivityRow({ item }: { item: any }) {
  const date = item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date(item.updatedAt || item.createdAt || 0);
  
  return (
    <div className="px-6 py-4 bg-background/40 flex items-center justify-between hover:bg-white/[0.02] transition-colors group border-b border-white/[0.03] last:border-0">
      <div className="flex items-center gap-5">
        <div className="size-2 rounded-full bg-primary/20 group-hover:bg-primary transition-all" />
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-tier-1 group-hover:text-primary transition-colors leading-none">{item.name}</span>
          <span className="text-[11px] text-tier-4 font-medium uppercase tracking-tighter mt-1.5">
            Status updated to <span className="text-tier-3 font-bold">{item.currentStage || item.status}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <Badge variant="outline" className="h-5 px-2 text-[9px] uppercase tracking-widest font-bold border-white/5 bg-white/[0.03] text-tier-4 group-hover:border-primary/20 group-hover:text-tier-3 transition-all">
          {item.currentStage ? "Platform" : "Vertical"}
        </Badge>
        <span className="text-[11px] font-bold text-tier-4 uppercase w-20 text-right">{date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}
