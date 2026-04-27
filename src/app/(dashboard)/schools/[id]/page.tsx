
"use client";

import { use, useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Edit3, 
  Clock, 
  GraduationCap,
  Calendar,
  User,
  Activity,
  Star,
  Loader2,
  Plus,
  Zap,
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = getFirestore();

  const docRef = useMemoFirebase(() => doc(firestore, 'partners', id), [firestore, id]);
  const { data: school, isLoading } = useDoc(docRef);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Retrieving School Intel...</span>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
        <div className="size-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <ShieldCheck className="size-10 text-rose-400 opacity-50" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-tier-1">Institutional Data Missing</h1>
          <p className="text-tier-3 text-sm max-w-xs mx-auto">The requested school profile could not be located in the cloud registry. It may have been declassified or moved.</p>
        </div>
        <Button asChild variant="outline" className="border-white/10 text-tier-2 hover:text-tier-1">
          <Link href="/schools"><ArrowLeft className="size-4 mr-2" /> Return to Vertical</Link>
        </Button>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Pilot': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'Approved': return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case 'Sample Sent': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-100 border-slate-500/20";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-6">
          <Link 
            href="/schools" 
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors w-fit group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> School Systems
          </Link>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-semibold tracking-tight text-tier-1">{school.name}</h1>
              <div className="flex gap-2">
                <Badge variant="outline" className={cn("px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-lg", getStatusStyles(school.status))}>
                  {school.status}
                </Badge>
                <Badge variant="outline" className="px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-lg border-primary/20 text-primary/80 bg-primary/5">
                  Score: {school.impactScore}/10
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[13px] font-medium text-tier-3">
              <span className="flex items-center gap-1.5"><GraduationCap className="size-4" /> Education Vertical</span>
              <span className="text-tier-4">•</span>
              <span className="uppercase tracking-wider text-[11px]">System Unit-01</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 px-4 rounded-xl border border-white/[0.05] text-tier-2 hover:text-tier-1 text-[12px] font-semibold uppercase tracking-wider">
            <Edit3 className="size-4 mr-2" /> Edit Profile
          </Button>
          <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-[12px] font-semibold uppercase tracking-wider shadow-lg shadow-primary/20">
            <Zap className="size-4 mr-2" /> Update Status
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* CURRENT MISSION STATUS */}
          <div className="premium-panel p-8 rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="size-16 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Current Engagement Stage</span>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl font-semibold text-tier-1 tracking-tight leading-snug">
                  {school.status === 'Active' ? 'Maintaining Institutional Logistics' : `Proceeding to ${school.status} protocols.`}
                </h2>
                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-tier-4">Last Contact</span>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <Calendar className="size-4" />
                    <span>{school.lastContact || 'No Interaction Recorded'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SNAPSHOT ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SnapshotCard label="Impact Potential" value={`${school.impactScore}/10`} icon={Star} />
            <SnapshotCard label="Operational Status" value={school.status} icon={Activity} />
            <SnapshotCard label="Decision Maker" value={school.contact ? 'Identified' : 'TBD'} icon={User} />
            <SnapshotCard label="Vertical" value="Education" icon={GraduationCap} />
          </div>

          {/* MISSION JOURNAL */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Operational Journal</h3>
              <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider text-tier-3 hover:text-primary transition-all">
                <Plus className="size-3.5 mr-2" /> Add Field Note
              </Button>
            </div>
            
            <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.05]">
              <TimelineEntry 
                date={school.lastContact || 'Recent'} 
                user="System Operator" 
                content={school.notes || "Education vertical protocols initialized. Awaiting detailed institutional profiling and procurement alignment."} 
              />
            </div>
          </section>

        </div>

        {/* SIDEBAR COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Institutional Intel</h3>
            <div className="flex flex-col gap-6">
              <InfoRow label="Vertical Type" value={school.type} icon={GraduationCap} />
              <InfoRow label="Engagement" value={school.status} icon={Activity} />
              <InfoRow label="Last Update" value={school.lastContact || 'N/A'} icon={Clock} />
              <Separator className="bg-white/[0.05]" />
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">Primary Decision Maker</span>
                <span className="text-[14px] font-semibold text-tier-1">{school.contact || 'N/A'}</span>
                <div className="flex items-center gap-2 text-[11px] text-tier-3 font-medium">
                  <Mail className="size-3" /> Verified Point of Contact
                </div>
              </div>
            </div>
          </section>

          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Geographic Profile</h3>
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
                <MapPin className="size-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-semibold text-tier-1">Location Details</span>
                <p className="text-[12px] text-tier-3 leading-relaxed">
                  Awaiting detailed campus address for logistics synchronization.
                </p>
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
      <div className="absolute left-0 top-1.5 size-[23px] rounded-full bg-background border-2 border-white/[0.08] flex items-center justify-center shadow-lg shadow-black">
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
