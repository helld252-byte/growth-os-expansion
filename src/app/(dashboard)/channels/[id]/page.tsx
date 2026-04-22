
"use client";

import { use } from "react";
import { 
  ArrowLeft, 
  ExternalLink, 
  Edit3, 
  Clock, 
  Globe,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  Plus,
  Zap,
  Star,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = getFirestore();

  const docRef = useMemoFirebase(() => doc(firestore, 'growth_opportunities', id), [firestore, id]);
  const { data: platform, isLoading } = useDoc(docRef);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Retrieving Intel...</span>
      </div>
    );
  }

  if (!platform) {
    return notFound();
  }

  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'Live': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'In Review': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Approved': return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case 'Research': return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-6">
          <Link 
            href="/channels" 
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors w-fit"
          >
            <ArrowLeft className="size-3.5" /> Pipeline
          </Link>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-semibold tracking-tight text-tier-1">{platform.name}</h1>
              <div className="flex gap-2">
                <Badge variant="outline" className={cn("px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-lg", getStageStyles(platform.currentStage))}>
                  {platform.currentStage}
                </Badge>
                <Badge variant="outline" className="px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-lg border-accent/20 text-accent/80 bg-accent/5">
                  {platform.priority} Priority
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[13px] font-medium text-tier-3">
              <span className="flex items-center gap-1.5"><Globe className="size-4" /> {platform.market} Region</span>
              <span className="text-tier-4">•</span>
              <span className="uppercase tracking-wider text-[11px]">{platform.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 px-4 rounded-xl border border-white/[0.05] text-tier-2 hover:text-tier-1 text-[12px] font-semibold uppercase tracking-wider">
            <Edit3 className="size-4 mr-2" /> Edit
          </Button>
          {platform.website && (
            <Button asChild className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-[12px] font-semibold uppercase tracking-wider shadow-lg shadow-primary/20">
              <a href={platform.website.startsWith('http') ? platform.website : `https://${platform.website}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 mr-2" /> Visit Site
              </a>
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* CURRENT FOCUS */}
          <div className="premium-panel p-8 rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="size-16 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Current Tactical Objective</span>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl font-semibold text-tier-1 tracking-tight leading-snug">
                  {platform.nextStep}
                </h2>
                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-tier-4">Target Date</span>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <Calendar className="size-4" />
                    <span>{platform.dueDate || 'No Date Set'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SNAPSHOT ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SnapshotCard label="Stage" value={platform.currentStage} icon={Activity} />
            <SnapshotCard label="Strategic Fit" value={`${platform.fitScore}/10`} icon={Star} />
            <SnapshotCard label="Risk Level" value={platform.riskLevel} icon={AlertTriangle} />
            <SnapshotCard label="Value Prop" value={`$${((platform.estimatedValue || 0) / 1000).toFixed(0)}k`} icon={Zap} />
          </div>

          {/* REQUIREMENTS */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Onboarding Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              {(platform.requirements || ['Logistics Setup', 'Catalog Audit', 'Compliance Verify']).map((req: string, i: number) => (
                <div key={req} className="flex items-center gap-4 group cursor-pointer">
                  <Checkbox 
                    id={`req-${i}`} 
                    className="size-5 rounded-md border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor={`req-${i}`} className="text-[14px] font-medium tracking-tight text-tier-2 group-hover:text-tier-1 transition-colors cursor-pointer">
                    {req}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* MISSION JOURNAL */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Mission Journal</h3>
              <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider text-tier-3 hover:text-primary">
                <Plus className="size-3.5 mr-2" /> Add Note
              </Button>
            </div>
            
            <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.05]">
              <TimelineEntry 
                date={platform.lastUpdate ? new Date(platform.lastUpdate).toLocaleDateString() : 'Recent'} 
                user="System" 
                content={platform.notes || "Operational history synchronized. Initiating growth protocols for this platform."} 
              />
            </div>
          </section>

        </div>

        {/* SIDEBAR COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Metadata Intel</h3>
            <div className="flex flex-col gap-6">
              <InfoRow label="Market" value={platform.market} icon={Globe} />
              <InfoRow label="Created" value={platform.dateStarted} icon={Calendar} />
              <InfoRow label="Last Update" value={platform.lastUpdate ? new Date(platform.lastUpdate).toLocaleDateString() : 'N/A'} icon={Clock} />
              <InfoRow label="Value" value={`$${(platform.estimatedValue || 0).toLocaleString()}`} icon={Zap} />
              <Separator className="bg-white/[0.05]" />
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">Contact Intelligence</span>
                <span className="text-[14px] font-semibold text-tier-1">{platform.contactPerson || 'N/A'}</span>
                <span className="text-[12px] text-tier-3 font-medium truncate">{platform.contactEmail || 'No email recorded'}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SnapshotCard({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) {
  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col gap-3 border-white/[0.03] hover:border-white/10 transition-all">
      <div className="flex items-center justify-between">
        <Icon className="size-4 text-tier-3" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">{label}</span>
      </div>
      <span className="text-[15px] font-bold text-tier-1 tracking-tight">{value}</span>
    </div>
  );
}

function TimelineEntry({ date, user, content }: { date: string, user: string, content: string }) {
  return (
    <div className="flex flex-col gap-2 pl-8 relative">
      <div className="absolute left-0 top-1.5 size-[23px] rounded-full bg-background border-2 border-white/[0.08] flex items-center justify-center">
        <div className="size-1.5 rounded-full bg-primary" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-tier-2">{user}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">{date}</span>
      </div>
      <p className="text-[14px] text-tier-3 leading-relaxed font-medium">
        {content}
      </p>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 text-tier-3">
        <Icon className="size-3.5" />
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-tier-1 text-right">{value}</span>
    </div>
  );
}
