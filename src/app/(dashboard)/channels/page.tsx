
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
  ChevronDown
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
      <aside className="w-64 shrink-0 flex flex-col gap-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
          Return to Base
        </Link>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-3 mb-2">Operations</h3>
            <nav className="flex flex-col gap-1">
              <FilterButton 
                active={activeFilter === 'needs-action'} 
                onClick={() => setActiveFilter('needs-action')}
                icon={Zap}
                label="Needs Action"
                count={counts['needs-action']}
                glow
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
                label="Live"
                count={counts['live']}
              />
              <FilterButton 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')}
                icon={LayoutGrid}
                label="All"
                count={counts['all']}
              />
            </nav>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-3 mb-2">Intel</h3>
            <nav className="flex flex-col gap-1">
              <Button variant="ghost" className="h-10 justify-start gap-3 px-3 rounded-xl hover:bg-white/[0.03] text-muted-foreground">
                <Globe className="size-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Business Profile</span>
              </Button>
            </nav>
          </div>
        </div>

        <div className="mt-auto">
          <Button className="w-full bg-white/[0.03] hover:bg-primary/20 border border-white/5 hover:border-primary/50 text-white font-black text-[10px] uppercase tracking-[0.15em] h-12 rounded-xl transition-all shadow-lg active-glow">
            <Plus className="size-4 mr-2" /> Deploy Platform
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-black tracking-tight">Expansion Operations</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Manage wholesale, retail, and digital channel growth.
            </p>
          </div>
          
          <div className="relative group w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search missions..." 
              className="pl-11 h-11 bg-white/[0.03] border-white/10 rounded-xl font-medium text-xs focus-visible:ring-primary/30" 
            />
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {filteredPlatforms.length === 0 ? (
            <div className="h-64 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-30">
              <LayoutGrid className="size-10" />
              <span className="text-xs font-black uppercase tracking-widest">No matching missions</span>
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

function FilterButton({ icon: Icon, label, count, active, onClick, glow }: any) {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "h-11 justify-start gap-4 px-4 rounded-xl transition-all relative group",
        active 
          ? "bg-primary/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
          : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
      )}
    >
      <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground/40")} />
      <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      <span className={cn(
        "ml-auto text-[10px] font-black",
        active ? "text-primary" : "text-muted-foreground/20"
      )}>
        {count}
      </span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full" />}
    </Button>
  );
}

function PlatformListItem({ platform }: { platform: any }) {
  return (
    <div className="premium-panel p-6 rounded-2xl flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all active:scale-[0.99]">
      <div className="flex items-center gap-6">
        <div className="size-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
          <Globe className="size-6" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">{platform.name}</h3>
            <Badge variant="outline" className="bg-white/5 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 text-muted-foreground/60">
              {platform.type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <LayoutGrid className="size-3" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{platform.currentStage}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <Zap className={cn("size-3", platform.priority === 'High' ? "text-accent" : "")} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{platform.priority} Priority</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 mb-1">Next Step</span>
          <span className={cn(
            "text-xs font-bold",
            platform.currentStage !== 'Live' ? "text-accent" : "text-muted-foreground"
          )}>
            {platform.nextStep}
          </span>
        </div>
        
        <div className="size-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5 group-hover:border-primary/30 transition-all">
          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary" />
        </div>
      </div>
    </div>
  );
}
