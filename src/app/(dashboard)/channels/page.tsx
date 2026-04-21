"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Star,
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
    <div className="max-w-[1400px] mx-auto flex gap-12 animate-in fade-in duration-700">
      {/* Operations Sidebar (Internal) */}
      <aside className="w-60 shrink-0 flex flex-col gap-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/40 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
          Return to Base
        </Link>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/20 px-3 mb-2">Tactical Filters</h3>
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

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/20 px-3 mb-2">Strategic Intel</h3>
            <nav className="flex flex-col gap-1">
              <Button variant="ghost" className="h-10 justify-start gap-3 px-3 rounded-lg hover:bg-white/[0.02] text-muted-foreground/60 group">
                <Globe className="size-3.5 group-hover:text-primary" />
                <span className="text-[11px] font-medium tracking-tight">Expansion Profile</span>
              </Button>
            </nav>
          </div>
        </div>

        <div className="mt-auto">
          <Button className="w-full bg-white/[0.02] hover:bg-primary/20 border border-white/[0.05] hover:border-primary/30 text-white font-semibold text-[11px] uppercase tracking-wider h-11 rounded-xl transition-all shadow-lg active-glow">
            <Plus className="size-3.5 mr-2" /> Add Platform
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Expansion Operations</h1>
            <p className="text-muted-foreground/60 text-[13px] font-medium">
              Manage wholesale, retail, and global digital channel scaling.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search platforms..." 
                className="pl-10 h-10 bg-white/[0.02] border-white/[0.05] rounded-xl font-medium text-[12px] focus-visible:ring-primary/20 transition-all" 
              />
            </div>
            <Button variant="ghost" className="h-10 w-10 p-0 bg-white/[0.02] border border-white/[0.05] rounded-xl text-muted-foreground/40 hover:text-white hover:border-white/10 transition-all">
              <Filter className="size-3.5" />
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-3">
          {filteredPlatforms.length === 0 ? (
            <div className="h-64 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-20">
              <LayoutGrid className="size-8" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">No active units found</span>
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
          ? "bg-primary/10 text-white shadow-sm" 
          : "text-muted-foreground/60 hover:bg-white/[0.02] hover:text-white"
      )}
    >
      <Icon className={cn("size-3.5", active ? "text-primary" : "text-muted-foreground/30 group-hover:text-muted-foreground/60")} />
      <span className={cn("text-[12px] tracking-tight", active ? "font-semibold" : "font-medium")}>{label}</span>
      <span className={cn(
        "ml-auto text-[10px] font-semibold tracking-tighter",
        active ? "text-primary" : "text-muted-foreground/20"
      )}>
        {count}
      </span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-primary rounded-full" />}
    </Button>
  );
}

function PlatformListItem({ platform }: { platform: any }) {
  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'Live':
        return "bg-green-500/5 text-green-500/80 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]";
      case 'In Review':
        return "bg-amber-500/5 text-amber-500/80 border-amber-500/20";
      case 'Approved':
        return "bg-primary/5 text-primary border-primary/20";
      case 'Applied':
        return "bg-blue-500/5 text-blue-500/80 border-blue-500/20";
      case 'Research':
        return "bg-white/5 text-muted-foreground/60 border-white/10";
      case 'Rejected':
        return "bg-red-500/5 text-red-500/80 border-red-500/20";
      case 'Onboarding':
        return "bg-cyan-500/5 text-cyan-500/80 border-cyan-500/20";
      default:
        return "bg-white/5 text-muted-foreground/60 border-white/10";
    }
  };

  return (
    <div className="premium-panel p-5 rounded-2xl flex items-center justify-between group hover:border-primary/20 cursor-pointer transition-all active:scale-[0.995]">
      <div className="flex items-center gap-6">
        <div className="size-11 rounded-xl bg-white/[0.015] border border-white/[0.04] flex items-center justify-center text-primary/40 group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <Globe className="size-5" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold tracking-tight text-white/90 group-hover:text-primary transition-colors">{platform.name}</h3>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/30 px-2 py-0.5 border border-white/[0.03] rounded bg-white/[0.01]">
              {platform.type}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              variant="outline" 
              className={cn(
                "border px-2 py-0.5 h-auto text-[8px] font-medium uppercase tracking-[0.1em] rounded-md flex items-center gap-1.5 transition-all",
                getStageStyles(platform.currentStage)
              )}
            >
              <span className={cn("size-1 rounded-full", platform.currentStage === 'Live' ? "bg-green-500" : "bg-current")} />
              {platform.currentStage}
            </Badge>
            <div className="flex items-center gap-1.5 text-muted-foreground/40">
              <Zap className={cn("size-3", platform.priority === 'High' ? "text-accent/60" : "text-muted-foreground/20")} />
              <span className="text-[10px] font-medium tracking-tight">{platform.priority} Priority</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex flex-col text-right">
          <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/20 mb-1">Target Action</span>
          <span className={cn(
            "text-[12px] font-medium tracking-tight",
            platform.currentStage !== 'Live' ? "text-accent/80" : "text-muted-foreground/40"
          )}>
            {platform.nextStep}
          </span>
        </div>
        
        <div className="size-8 rounded-full flex items-center justify-center bg-white/[0.015] border border-white/[0.03] group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
          <ChevronRight className="size-3.5 text-muted-foreground/30 group-hover:text-primary" />
        </div>
      </div>
    </div>
  );
}