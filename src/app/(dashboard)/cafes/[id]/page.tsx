
"use client";

import { use, useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Coffee, 
  Globe, 
  Calendar, 
  User, 
  Activity, 
  Star, 
  Loader2, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  ExternalLink,
  MapPin,
  TrendingDown,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useDoc, useMemoFirebase, useUser } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { suggestNextActions } from "@/ai/flows/suggest-next-actions";

const pipelineStages = ["Prospect", "Contacted", "Sample Sent", "Trial", "Negotiation", "Live"];

export default function CafeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = getFirestore();
  const { user } = useUser();
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const docRef = useMemoFirebase(() => doc(firestore, 'partners', id), [firestore, id]);
  const { data: cafe, isLoading } = useDoc(docRef);

  useEffect(() => {
    async function fetchAiIntel() {
      if (!cafe) return;
      setIsAiLoading(true);
      try {
        const result = await suggestNextActions({
          opportunityName: cafe.name,
          type: cafe.type || 'Hospitality',
          market: cafe.region || 'Global',
          currentStage: (cafe.status as any) || 'Not Started',
          priority: (cafe.priority as any) || 'Medium',
          estimatedValue: `$${(cafe.estimatedValue || 0).toLocaleString()}`,
          fitScore: `${cafe.milkMenuFit || 7}/10`,
          riskLevel: cafe.riskLevel || 'Medium',
          notes: cafe.notes,
          contactPerson: cafe.contact
        });
        setAiSuggestions(result.suggestions || []);
      } catch (e) {
        console.error("AI Error:", e);
      } finally {
        setIsAiLoading(false);
      }
    }
    if (cafe) fetchAiIntel();
  }, [cafe]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Synchronizing Hospitality Intel...</span>
      </div>
    );
  }

  if (!cafe) return notFound();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Live': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Negotiation': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Trial': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-100 border-slate-500/20";
    }
  };

  const currentStageIndex = pipelineStages.indexOf(cafe.status);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="flex flex-col gap-6">
          <Link 
            href="/cafes" 
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors w-fit group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> Cafe Vertical
          </Link>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="size-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary shadow-2xl">
                <Coffee className="size-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-bold tracking-tight text-tier-1">{cafe.name}</h1>
                <div className="flex items-center gap-3 text-[13px] font-medium text-tier-3">
                  <span className="flex items-center gap-1.5"><Globe className="size-3.5" /> {cafe.region || 'Unknown Region'}</span>
                  <span className="text-tier-4">•</span>
                  <span className="uppercase tracking-widest text-[10px] font-bold text-primary">{cafe.type} Unit</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2.5">
              <Badge variant="outline" className={cn("px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-xl", getStatusStyles(cafe.status))}>
                <span className={cn("size-1.5 rounded-full mr-2", cafe.status === 'Live' ? "bg-emerald-500 animate-pulse" : "bg-current")} />
                {cafe.status}
              </Badge>
              <Badge variant="outline" className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-xl border-accent/20 text-accent/80 bg-accent/5">
                {cafe.priority || 'Medium'} Priority
              </Badge>
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-tier-2 ml-2">
                <User className="size-3.5 text-tier-3" />
                <span>Owner: System</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-end">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-11 px-5 rounded-xl border border-white/[0.05] text-tier-2 hover:text-tier-1 text-[12px] font-bold uppercase tracking-widest">
              Manage Tasks
            </Button>
            <Button className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white text-[12px] font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
              <Zap className="size-4 mr-2" /> Update Mission
            </Button>
          </div>
          <div className="flex items-center gap-2 text-tier-3 text-[11px] font-medium">
            <Clock className="size-3.5" />
            Next Step: <span className="text-accent font-semibold">{cafe.nextStep || 'Outreach'}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* PIPELINE PROGRESS */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <TrendingUp className="size-20 text-primary" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Mission Pipeline Progress</h3>
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute top-[11px] left-0 right-0 h-0.5 bg-white/[0.05] -z-0" />
              <div 
                className="absolute top-[11px] left-0 h-0.5 bg-primary transition-all duration-1000 -z-0" 
                style={{ width: `${(currentStageIndex / (pipelineStages.length - 1)) * 100}%` }}
              />
              {pipelineStages.map((stage, i) => (
                <div key={stage} className="flex flex-col items-center gap-4 relative z-10">
                  <div className={cn(
                    "size-6 rounded-full border-4 border-background flex items-center justify-center transition-all duration-500",
                    i <= currentStageIndex ? "bg-primary shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-white/[0.05] border-white/[0.08]"
                  )}>
                    {i < currentStageIndex && <CheckCircle2 className="size-3 text-white" />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap",
                    i === currentStageIndex ? "text-primary" : i < currentStageIndex ? "text-tier-2" : "text-tier-4"
                  )}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* OPPORTUNITY OVERVIEW */}
            <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Strategic Overview</h3>
              <div className="flex flex-col gap-6">
                <InfoRow label="Entity Type" value={cafe.type} icon={Coffee} />
                <InfoRow label="Market Region" value={cafe.region || 'Global'} icon={Globe} />
                <InfoRow label="Locations" value={cafe.locationsCount || '1 Unit'} icon={MapPin} />
                <InfoRow label="Daily Traffic" value={cafe.dailyTraffic || 'Medium'} icon={Activity} />
                <Separator className="bg-white/[0.04]" />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-tier-3">Milk Menu Fit</span>
                    <span className="text-[13px] font-bold text-primary">{cafe.milkMenuFit || 7}/10</span>
                  </div>
                  <Progress value={(cafe.milkMenuFit || 7) * 10} className="h-1.5 bg-white/[0.05]" />
                </div>
              </div>
            </section>

            {/* TASKS */}
            <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Tactical Backlog</h3>
                <Plus className="size-4 text-tier-3 hover:text-primary cursor-pointer" />
              </div>
              <div className="flex flex-col gap-4">
                <TaskItem label="Verify wholesale pricing sheet" checked={false} />
                <TaskItem label="Send samples for trial batch" checked={true} />
                <TaskItem label="Schedule follow-up with manager" checked={false} />
                <TaskItem label="Audit current milk catalog" checked={false} />
              </div>
            </section>
          </div>

          {/* NOTES & COMMUNICATION */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Mission Journal</h3>
              <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest text-tier-3 hover:text-primary">
                Add Field Note
              </Button>
            </div>
            <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.05]">
              <TimelineEntry 
                date={cafe.lastContact || 'Recent'} 
                user="System Operator" 
                content={cafe.notes || "Hospitality protocols initialized. Initiating initial outreach and institutional profiling."} 
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* DECISION MAKER */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Primary Contact</h3>
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-white/[0.08] flex items-center justify-center text-tier-1 font-bold text-xl">
                {cafe.contact ? cafe.contact.charAt(0) : '?'}
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-tier-1">{cafe.contact || 'Identifying...'}</span>
                <span className="text-[12px] text-tier-3 font-medium">Head of Procurement</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-11 border-white/[0.06] bg-white/[0.02] text-[11px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
              <MessageSquare className="size-3.5 mr-2" /> Open Comms
            </Button>
          </section>

          {/* REVENUE POTENTIAL */}
          <section className="premium-panel p-8 rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Revenue Impact</h3>
              <TrendingUp className="size-4 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-tier-1 tracking-tight">
                ${(cafe.estimatedValue || 0).toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-tier-3 uppercase tracking-widest mt-1">Projected Annual ARR</span>
            </div>
            <Progress value={75} className="h-1.5 bg-white/[0.05]" />
          </section>

          {/* TRIAL METRICS */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Trial Execution Metrics</h3>
            <div className="flex flex-col gap-6">
              <MetricRow label="Samples Authorized" value={cafe.samplesSent ? 'Yes' : 'Pending'} success={!!cafe.samplesSent} />
              <MetricRow label="Active Trial Batch" value={cafe.status === 'Trial' ? 'Live' : 'No'} success={cafe.status === 'Trial'} />
              <MetricRow label="Repeat Interest" value="High" success={true} />
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Early Feedback</span>
                <p className="text-[12px] text-tier-2 leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                  "Positive initial response on texturing properties with our steam profiles."
                </p>
              </div>
            </div>
          </section>

          {/* AI RECOMMENDATIONS */}
          <section className="premium-panel p-8 rounded-3xl border-primary/10 bg-primary/5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Strategic AI Intel</h3>
              <Sparkles className="size-4 text-primary animate-pulse" />
            </div>
            
            <div className="flex flex-col gap-4">
              {isAiLoading ? (
                <div className="flex flex-col items-center gap-3 py-4 opacity-50">
                  <Loader2 className="size-5 text-primary animate-spin" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Generating Strategy...</span>
                </div>
              ) : aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion: any, i: number) => (
                  <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{suggestion.action}</span>
                      <ChevronRight className="size-3.5 text-tier-4 group-hover:text-primary transition-all" />
                    </div>
                    <p className="text-[12px] text-tier-2 leading-relaxed font-medium">
                      {suggestion.reason}
                    </p>
                  </div>
                ))
              ) : (
                <span className="text-[11px] text-tier-3 italic">AI engine offline or awaiting data calibration.</span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-tier-3">
        <Icon className="size-4" />
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[13px] font-bold text-tier-1">{value || 'N/A'}</span>
    </div>
  );
}

function TaskItem({ label, checked }: any) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <Checkbox checked={checked} className="size-5 rounded-md border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
      <span className={cn("text-[13px] font-medium transition-colors", checked ? "text-tier-3 line-through" : "text-tier-2 group-hover:text-tier-1")}>
        {label}
      </span>
    </div>
  );
}

function MetricRow({ label, value, success }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-medium text-tier-3">{label}</span>
      <Badge variant="outline" className={cn(
        "text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-lg",
        success ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/[0.02] text-tier-3 border-white/[0.08]"
      )}>
        {value}
      </Badge>
    </div>
  );
}

function TimelineEntry({ date, user, content }: any) {
  return (
    <div className="flex flex-col gap-2 pl-8 relative">
      <div className="absolute left-0 top-1.5 size-[23px] rounded-full bg-background border-2 border-white/[0.08] flex items-center justify-center">
        <div className="size-1.5 rounded-full bg-primary" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-bold text-tier-2">{user}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">{date}</span>
      </div>
      <p className="text-[13px] text-tier-3 leading-relaxed font-medium">
        {content}
      </p>
    </div>
  );
}
