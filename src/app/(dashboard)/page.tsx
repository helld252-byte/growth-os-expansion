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
  History,
  Target,
  BarChart3,
  Layers,
  ArrowRight
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

    // 1. Core Intelligence Metrics
    const trackedOpps = opportunities.length;
    const livePartnerships = opportunities.filter(o => o.currentStage === 'Live').length;
    const inReview = opportunities.filter(o => o.currentStage === 'In Review').length;
    
    const contacted = opportunities.filter(o => o.commStatus && o.commStatus !== 'No outreach');
    const approved = opportunities.filter(o => o.currentStage === 'Approved' || o.currentStage === 'Live' || o.currentStage === 'Onboarding');
    const successRate = contacted.length > 0 ? Math.round((approved.length / contacted.length) * 100) : 0;

    // 2. Integrated Pipeline Data
    const stages = [
      { label: 'Research', count: opportunities.filter(o => o.currentStage === 'Research' || o.currentStage === 'Not Started').length },
      { label: 'Applied', count: opportunities.filter(o => o.currentStage === 'Applied').length },
      { label: 'In Review', count: opportunities.filter(o => o.currentStage === 'In Review').length },
      { label: 'Approved', count: opportunities.filter(o => o.currentStage === 'Approved' || o.currentStage === 'Onboarding').length },
      { label: 'Live', count: opportunities.filter(o => o.currentStage === 'Live').length },
    ];

    // 3. Needs Attention (Priority & Bottlenecks)
    const urgentFollowUps = opportunities
      .filter(o => o.commStatus === 'Waiting reply' || o.priority === 'High')
      .sort((a, b) => {
        const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
        const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);

    // 4. Recent Activity Mini-Feed
    const recentActivity = opportunities
      .sort((a, b) => {
        const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || a.createdAt || 0);
        const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 6);

    return { 
      intel: { trackedOpps, livePartnerships, inReview, successRate },
      stages,
      urgentFollowUps,
      recentActivity
    };
  }, [opportunities]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-tier-4">Syncing Mission Data</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-12 animate-in fade-in duration-700">
      
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg active-glow">
            <Activity className="size-5.5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold tracking-tight text-tier-1 leading-none">Command Center</h1>
            <p className="text-tier-4 text-[10px] font-bold uppercase tracking-[0.25em] mt-2">Operational Oversight Unit-01</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Mission Synchronized
        </Badge>
      </header>

      {/* Unified Mission Intelligence Section */}
      <section className="premium-panel p-10 rounded-[32px] bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent flex flex-col gap-12 border-white/[0.04]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Key Insights Rail */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Mission Key Insights</h2>
              <p className="text-[13px] text-tier-3 font-medium">Core performance telemetry across all vertical channels.</p>
            </div>
            
            <div className="flex flex-col gap-6">
              <InsightBlock label="Total Pipeline" value={data.intel.trackedOpps} icon={Layers} />
              <InsightBlock label="Live Channels" value={data.intel.livePartnerships} icon={Target} color="text-emerald-500" />
              <InsightBlock label="In Evaluation" value={data.intel.inReview} icon={Clock} color="text-primary" />
              <InsightBlock label="Conversion Success" value={`${data.intel.successRate}%`} icon={BarChart3} />
            </div>
          </div>

          {/* Redesigned Growth Pipeline */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Growth Pipeline Flow</h3>
              <span className="text-[13px] text-tier-3 font-medium">Distribution of high-impact opportunities across onboarding phases.</span>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {data.stages.map((stage, i) => {
                const total = data.intel.trackedOpps || 1;
                const percentage = Math.min((stage.count / total) * 100, 100);
                const isFinal = i === 4;

                return (
                  <div key={stage.label} className="relative group">
                    <div className={cn(
                      "flex flex-col gap-6 p-6 rounded-2xl border transition-all duration-500 h-full",
                      "bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border-white/[0.08]",
                      "hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-2px] hover:border-primary/20",
                      isFinal && "bg-emerald-500/5 border-emerald-500/10"
                    )}>
                      <div className="flex flex-col gap-1">
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-[0.2em]",
                          isFinal ? "text-emerald-500" : "text-tier-4 group-hover:text-tier-1 transition-colors"
                        )}>
                          {stage.label}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-bold text-tier-1 tracking-tight">{stage.count}</span>
                          <span className="text-[10px] font-bold text-tier-4">Units</span>
                        </div>
                      </div>

                      <div className="mt-auto flex flex-col gap-3">
                        <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden relative">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000 ease-out rounded-full",
                              isFinal 
                                ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" 
                                : "bg-primary/60 shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                            )} 
                            style={{ width: `${percentage || 5}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-tier-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Verified</span>
                          <span>{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    {i < 4 && (
                      <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-10 opacity-20 group-hover:opacity-40 transition-opacity">
                        <ArrowRight className="size-4 text-tier-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Needs Attention Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col gap-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Needs Attention</h3>
              <p className="text-[13px] text-tier-3 font-medium">Critical bottlenecks and high-priority tactical follow-ups.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.urgentFollowUps.length > 0 ? (
              data.urgentFollowUps.map((opp) => (
                <Link 
                  key={opp.id} 
                  href={`/channels/${opp.id}`} 
                  className="premium-panel p-6 rounded-2xl flex items-center justify-between hover:bg-white/[0.02] border-white/[0.05] group transition-all active:scale-[0.99]"
                >
                  <div className="flex items-start gap-5">
                    <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/5">
                      <AlertCircle className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[15px] font-semibold text-tier-1 group-hover:text-primary transition-colors tracking-tight">{opp.name}</span>
                      <span className="text-[10px] text-tier-4 font-bold uppercase tracking-widest">
                        {opp.commStatus === 'Waiting reply' ? "Awaiting Partner Reply" : "Immediate Mission Action"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-tier-4 group-hover:text-tier-1 transition-all" />
                </Link>
              ))
            ) : (
              <div className="col-span-full h-48 border border-dashed border-white/5 rounded-[24px] flex flex-col items-center justify-center gap-4 opacity-30">
                <Zap className="size-8 text-tier-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em]">No urgent missions</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-1 px-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-1">Mission Log</h3>
            <p className="text-[13px] text-tier-3 font-medium">Real-time platform synchronization feed.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {data.recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-5 bg-white/[0.015] border border-white/[0.04] rounded-2xl hover:border-white/[0.08] transition-all cursor-default group">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:shadow-[0_0_8px_hsl(var(--primary))]" />
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[13px] font-semibold text-tier-1 truncate tracking-tight">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.currentStage}</span>
                    <span className="text-tier-4">•</span>
                    <span className="text-[9px] text-tier-4 font-bold uppercase tracking-widest tracking-[0.1em]">Verified</span>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/channels" className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary hover:text-accent transition-colors px-1 mt-4 flex items-center gap-2 group w-fit">
              Explore Full Registry <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

function InsightBlock({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color?: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={cn("size-9 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center transition-all group-hover:bg-white/[0.05]", color || "text-tier-3")}>
        <Icon className="size-4.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4 mb-0.5">{label}</span>
        <span className="text-lg font-bold tracking-tight text-tier-1">{value}</span>
      </div>
    </div>
  );
}
