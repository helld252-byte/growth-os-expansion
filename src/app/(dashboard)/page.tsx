"use client";

import { useMemo } from "react";
import { 
  Activity,
  ChevronRight, 
  Loader2,
  AlertCircle,
  Clock,
  TrendingUp,
  Zap,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CommandCenter() {
  const firestore = getFirestore();
  
  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: opportunities, isLoading } = useCollection(opportunitiesRef);

  const data = useMemo(() => {
    if (!opportunities) return null;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. KPIs (Global View)
    const trackedOpps = opportunities.length;
    const inReview = opportunities.filter(o => o.currentStage === 'In Review').length;
    const livePartnerships = opportunities.filter(o => o.currentStage === 'Live').length;
    
    const contacted = opportunities.filter(o => o.commStatus && o.commStatus !== 'No outreach');
    const responded = contacted.filter(o => ['In discussion', 'Approved', 'Waiting reply'].includes(o.commStatus || ''));
    const responseRate = contacted.length > 0 ? Math.round((responded.length / contacted.length) * 100) : 0;

    // 2. Funnel Stages (Growth Pipeline)
    const stages = [
      { label: 'Research', count: opportunities.filter(o => o.currentStage === 'Research' || o.currentStage === 'Not Started').length },
      { label: 'Applied', count: opportunities.filter(o => o.currentStage === 'Applied').length },
      { label: 'In Review', count: opportunities.filter(o => o.currentStage === 'In Review').length },
      { label: 'Approved', count: opportunities.filter(o => o.currentStage === 'Approved').length },
      { label: 'Live', count: opportunities.filter(o => o.currentStage === 'Live').length },
    ];

    // 3. Needs Attention (Bottlenecks)
    const urgentFollowUps = opportunities
      .filter(o => o.commStatus === 'Waiting reply' || o.priority === 'High')
      .sort((a, b) => {
        const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
        const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);

    // 4. Recent Updates
    const recentActivity = opportunities
      .sort((a, b) => {
        const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || a.createdAt || 0);
        const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 6);

    return { 
      kpis: { trackedOpps, inReview, livePartnerships, responseRate },
      stages,
      urgentFollowUps,
      recentActivity
    };
  }, [opportunities]);

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
    <div className="max-w-[1400px] mx-auto flex flex-col gap-12 animate-in fade-in duration-700">
      
      {/* Executive Header */}
      <header className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
              <Activity className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-tier-1 leading-none">Home</h1>
              <p className="text-tier-4 text-[11px] font-bold uppercase tracking-[0.2em] mt-1.5">What should I work on today?</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest px-3 py-1">System Live</Badge>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between divide-x divide-border shadow-sm backdrop-blur-sm">
          <StatModule label="Tracked Units" value={data.kpis.trackedOpps} />
          <StatModule label="In Review" value={data.kpis.inReview} />
          <StatModule label="Live" value={data.kpis.livePartnerships} highlight />
          <StatModule label="Response Rate" value={`${data.kpis.responseRate}%`} />
          <StatModule label="Mission Velocity" value="Stable" color="text-emerald-500" />
        </div>
      </header>

      {/* Growth Pipeline (Onboarding Flow) */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-4">Growth Pipeline (Onboarding Flow)</h3>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {data.stages.map((stage, i) => (
            <div key={stage.label} className="flex flex-col gap-3.5 group">
              <div className="flex items-end justify-between px-1">
                <span className="text-[11px] font-medium text-tier-3 group-hover:text-tier-1 transition-colors uppercase tracking-widest">{stage.label}</span>
                <span className="text-xl font-bold text-tier-1">{stage.count}</span>
              </div>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
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
        
        {/* Needs Attention (Priority & Bottlenecks) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Needs Attention</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.urgentFollowUps.length > 0 ? (
              data.urgentFollowUps.map((opp) => (
                <Link 
                  key={opp.id} 
                  href={`/channels/${opp.id}`} 
                  className="premium-panel p-5 rounded-xl flex items-center justify-between hover:bg-secondary/50 border-border group transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-500">
                      <AlertCircle className="size-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-tier-1 group-hover:text-primary transition-colors">{opp.name}</span>
                      <span className="text-[10px] text-tier-4 font-bold uppercase tracking-widest">
                        {opp.commStatus === 'Waiting reply' ? "Awaiting Reply" : "High Priority Action"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold border-border">{opp.currentStage}</Badge>
                    <ChevronRight className="size-3.5 text-tier-4 group-hover:text-tier-1 transition-all" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full h-40 border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 opacity-30">
                <Zap className="size-6 text-tier-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">No urgent bottlenecks</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Mini-Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-1">Recent Updates</h3>
          <div className="flex flex-col gap-3">
            {data.recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 bg-white/[0.015] border border-border/50 rounded-xl hover:bg-secondary/30 transition-all cursor-default">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[12px] font-semibold text-tier-1 truncate">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-tier-4 font-bold uppercase tracking-widest">{item.currentStage}</span>
                    <span className="text-[10px] text-tier-4">•</span>
                    <span className="text-[10px] text-tier-4 font-medium italic">Synchronized</span>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/channels" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:underline px-1 mt-2 flex items-center gap-2">
              View all platforms <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

function StatModule({ label, value, highlight, color }: { label: string, value: string | number, highlight?: boolean, color?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4 first:pl-0 last:pr-0">
      <span className={cn(
        "text-[15px] font-bold tracking-tight",
        color ? color : highlight ? "text-primary" : "text-tier-1"
      )}>
        {value}
      </span>
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-tier-4 whitespace-nowrap">{label}</span>
    </div>
  );
}
