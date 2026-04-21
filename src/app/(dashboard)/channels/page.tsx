"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Globe,
  ArrowLeft,
  Clock,
  ShieldAlert,
  Zap,
  LayoutGrid,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { platforms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

type FilterStatus = 'needs-action' | 'waiting' | 'blocked' | 'high-priority' | 'live' | 'all';

export default function ExpansionOperationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlatforms = platforms.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'live') return p.currentStage === 'Live';
    if (activeFilter === 'high-priority') return p.priority === 'High';
    if (activeFilter === 'blocked') return !!p.blockers;
    if (activeFilter === 'needs-action') return p.currentStage !== 'Live' && !p.blockers;
    if (activeFilter === 'waiting') return p.currentStage === 'In Review';
    return true;
  });

  const counts = {
    'needs-action': platforms.filter(p => p.currentStage !== 'Live' && !p.blockers).length,
    'waiting': platforms.filter(p => p.currentStage === 'In Review').length,
    'blocked': platforms.filter(p => !!p.blockers).length,
    'high-priority': platforms.filter(p => p.priority === 'High').length,
    'live': platforms.filter(p => p.currentStage === 'Live').length,
    'all': platforms.length
  };

  return (
    <div className="max-w-[1400px] mx-auto flex gap-10 animate-in fade-in duration-700">
      {/* Operations Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col gap-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary hover:text-primary transition-colors group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          Return to Base
        </Link>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-[9px] font-medium uppercase tracking-[0.2em] text-tertiary/40 px-3 mb-1">Tactical Filters</h3>
            <nav className="flex flex-col gap-1">
              <FilterButton 
                active={activeFilter === 'needs-action'} 
                onClick={() => setActiveFilter('needs-action')}
                icon={Zap}
                label="Needs Action"
                count={counts['needs-action']}
              />
              <FilterButton 
                active={activeFilter === 'waiting'} 
                onClick={() => setActiveFilter('waiting')}
                icon={Clock}
                label="Waiting"
                count={counts['waiting']}
              />
              <FilterButton 
                active={activeFilter === 'blocked'} 
                onClick={() => setActiveFilter('blocked')}
                icon={ShieldAlert}
                label="Blocked"
                count={counts['blocked']}
              />
              <FilterButton 
                active={activeFilter === 'high-priority'} 
                onClick={() => setActiveFilter('high-priority')}
                icon={Star}
                label="High Priority"
                count={counts['high-priority']}
              />
              <FilterButton 
                active={activeFilter === 'live'} 
                onClick={() => setActiveFilter('live')}
                icon={Zap}
                label="Live Ops"
                count={counts['live']}
              />
              <FilterButton 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')}
                icon={LayoutGrid}
                label="All Units"
                count={counts['all']}
              />
            </nav>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[9px] font-medium uppercase tracking-[0.2em] text-tertiary/40 px-3 mb-1">Strategic Intel</h3>
            <nav className="flex flex-col gap-1">
              <Button variant="ghost" className="h-10 justify-start gap-3 px-3 rounded-lg hover:bg-white/[0.02] text-tertiary font-medium group transition-colors">
                <Globe className="size-4 text-tertiary/60 group-hover:text-primary" />
                <span className="text-[12px] tracking-tight text-secondary">Expansion Profile</span>
              </Button>
            </nav>
          </div>
        </div>

        <div className="mt-auto">
          <Button className="w-full bg-white/[0.03] hover:bg-primary text-foreground font-medium text-[11px] uppercase tracking-wider h-11 rounded-xl transition-all shadow-lg active-glow border border-white/[0.05]">
            <Plus className="size-4 mr-2" /> Add Platform
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-primary">Expansion Operations</h1>
            <p className="text-secondary text-[14px] font-medium leading-relaxed max-w-xl">
              Manage wholesale, retail, and global digital channel scaling across tactical operational zones.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-tertiary/60 group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search platforms..." 
                className="pl-10 h-10 bg-white/[0.015] border-white/[0.05] rounded-xl font-medium text-[13px] focus-visible:ring-primary/20 placeholder:text-tertiary/30 transition-all text-primary" 
              />
            </div>
            <Button variant="ghost" className="h-10 w-10 p-0 bg-white/[0.02] border border-white/[0.05] rounded-xl text-tertiary hover:text-primary hover:border-white/10 transition-all">
              <Filter className="size-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-3">
          {filteredPlatforms.length === 0 ? (
            <div className="h-64 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-30">
              <LayoutGrid className="size-10 text-tertiary" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-tertiary">No active units found</span>
            </div>
          ) : (
            filteredPlatforms.map((p) => (
              <PlatformListItem key={p.id} platform={p} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function FilterButton({ icon: Icon, label, count, active, onClick }: any) {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "h-10 justify-start gap-3.5 px-3.5 rounded-lg transition-all relative group",
        active 
          ? "bg-primary/10 text-primary shadow-sm" 
          : "text-secondary hover:bg-white/[0.02] hover:text-primary"
      )}
    >
      <Icon className={cn("size-4", active ? "text-primary" : "text-tertiary group-hover:text-secondary")} />
      <span className={cn("text-[13px] tracking-tight font-medium")}>{label}</span>
      <span className={cn(
        "ml-auto text-[10px] font-medium tracking-tighter",
        active ? "text-primary" : "text-tertiary"
      )}>
        {count}
      </span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />}
    </Button>
  );
}

function PlatformListItem({ platform }: { platform: any }) {
  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'Live':
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case 'In Review':
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case 'Approved':
        return "bg-violet-500/15 text-violet-400 border-violet-500/20";
      case 'Applied':
        return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      case 'Research':
        return "bg-slate-500/25 text-slate-100 border-slate-500/40";
      case 'Rejected':
        return "bg-rose-500/15 text-rose-400 border-rose-500/20";
      case 'Onboarding':
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20";
      case 'Not Started':
        return "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="premium-panel p-5 rounded-2xl flex items-center justify-between group hover:border-primary/20 cursor-pointer transition-all active:scale-[0.995]">
      <div className="flex items-center gap-6">
        <div className="size-11 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-tertiary group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <Globe className="size-5" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold tracking-tight text-primary group-hover:text-primary transition-colors">{platform.name}</h3>
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-secondary px-2 py-0.5 border border-white/[0.05] rounded-md bg-white/[0.02]">
              {platform.type}
            </span>
          </div>
          
          <div className="flex items-center gap-5">
            <Badge 
              variant="outline" 
              className={cn(
                "border px-2.5 py-0.5 h-auto text-[10px] font-medium uppercase tracking-[0.1em] rounded-lg flex items-center gap-2 transition-all",
                getStageStyles(platform.currentStage)
              )}
            >
              <span className={cn("size-1.5 rounded-full", platform.currentStage === 'Live' ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" : "bg-current")} />
              {platform.currentStage}
            </Badge>
            <div className="flex items-center gap-2 text-tertiary">
              <Zap className={cn("size-3.5", platform.priority === 'High' ? "text-accent" : "text-tertiary/20")} />
              <span className="text-[11px] font-medium tracking-tight text-secondary">{platform.priority} Priority</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-tertiary mb-1">Target Action</span>
          <span className={cn(
            "text-[13px] font-medium tracking-tight",
            platform.currentStage !== 'Live' ? "text-accent/90" : "text-tertiary"
          )}>
            {platform.nextStep}
          </span>
        </div>
        
        <div className="size-9 rounded-full flex items-center justify-center bg-white/[0.015] border border-white/[0.04] group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
          <ChevronRight className="size-4 text-tertiary group-hover:text-primary" />
        </div>
      </div>
    </div>
  );
}