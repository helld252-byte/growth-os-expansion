
"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Coffee,
  ArrowLeft,
  Clock,
  ShieldAlert,
  Zap,
  LayoutGrid,
  Star,
  Loader2,
  CheckCircle2,
  Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCollection, useMemoFirebase, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type CafeFilter = 'live' | 'negotiation' | 'needs-action' | 'all';

export default function CafesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = getFirestore();
  const [activeFilter, setActiveFilter] = useState<CafeFilter>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const partnersRef = useMemoFirebase(() => collection(firestore, 'partners'), [firestore]);
  const { data: partners, isLoading } = useCollection(partnersRef);

  const [newCafe, setNewCafe] = useState({
    name: "",
    type: "Cafe",
    status: "Prospect",
    contact: "",
    impactScore: 5,
    notes: ""
  });

  const handleAddCafe = () => {
    if (!user || !newCafe.name) return;

    const docData = {
      ...newCafe,
      ownerId: user.uid,
      lastContact: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(partnersRef, docData);
    setIsAddOpen(false);
    setNewCafe({
      name: "",
      type: "Cafe",
      status: "Prospect",
      contact: "",
      impactScore: 5,
      notes: ""
    });
    
    toast({
      title: "Cafe Vertical Entry Created",
      description: `"${docData.name}" has been recorded in the hospitality pipeline.`,
    });
  };

  const filtered = (partners || []).filter(p => {
    const isType = p.type === 'Cafe';
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!isType || !matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'live') return p.status === 'Live';
    if (activeFilter === 'negotiation') return p.status === 'Negotiation';
    if (activeFilter === 'needs-action') return ['Prospect', 'Contacted', 'Trial'].includes(p.status);
    return true;
  });

  const counts = {
    'live': (partners || []).filter(p => p.type === 'Cafe' && p.status === 'Live').length,
    'negotiation': (partners || []).filter(p => p.type === 'Cafe' && p.status === 'Negotiation').length,
    'needs-action': (partners || []).filter(p => p.type === 'Cafe' && ['Prospect', 'Contacted', 'Trial'].includes(p.status)).length,
    'all': (partners || []).filter(p => p.type === 'Cafe').length
  };

  return (
    <div className="max-w-[1400px] mx-auto flex gap-12 animate-in fade-in duration-700">
      <aside className="w-56 shrink-0 flex flex-col gap-10">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Return to Base
        </Link>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 px-3 mb-1">Tactical Filters</h3>
            <nav className="flex flex-col gap-1.5">
              <FilterButton 
                active={activeFilter === 'live'} 
                onClick={() => setActiveFilter('live')}
                icon={CheckCircle2}
                label="Live Ops"
                count={counts['live']}
              />
              <FilterButton 
                active={activeFilter === 'negotiation'} 
                onClick={() => setActiveFilter('negotiation')}
                icon={Handshake}
                label="Negotiation"
                count={counts['negotiation']}
              />
              <FilterButton 
                active={activeFilter === 'needs-action'} 
                onClick={() => setActiveFilter('needs-action')}
                icon={Zap}
                label="Pipeline"
                count={counts['needs-action']}
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
        </div>

        <div className="mt-auto">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary/20 hover:bg-primary text-tier-1 font-semibold text-[11px] uppercase tracking-wider h-11 rounded-xl transition-all shadow-lg active-glow border border-primary/20">
                <Plus className="size-4 mr-2" /> Add Cafe
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">New Hospitality Entry</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Business Name</Label>
                  <Input 
                    value={newCafe.name}
                    onChange={(e) => setNewCafe({...newCafe, name: e.target.value})}
                    placeholder="e.g. Roasters Collective" 
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Status</Label>
                    <Select value={newCafe.status} onValueChange={(v) => setNewCafe({...newCafe, status: v})}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-xl border-white/[0.1]">
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Trial">Trial</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Impact Score</Label>
                    <Input 
                      type="number"
                      value={newCafe.impactScore}
                      onChange={(e) => setNewCafe({...newCafe, impactScore: Number(e.target.value)})}
                      className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddCafe}
                  disabled={!newCafe.name}
                  className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest"
                >
                  Authorize Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Cafe Vertical</h1>
            <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-2xl">
              Focusing on cafe chains, restaurant groups, and premium hospitality trial locations.
            </p>
          </div>
          <div className="relative group w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitality..." 
              className="pl-11 h-11 bg-white/[0.02] border-white/[0.05] rounded-xl font-medium text-[13px] focus-visible:ring-primary/20 placeholder:text-tier-3 transition-all text-tier-1" 
            />
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="h-72 flex flex-col items-center justify-center gap-4 opacity-50">
              <Loader2 className="size-8 text-primary animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-3">Syncing Cloud Database</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-72 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 opacity-30">
              <Coffee className="size-12 text-tier-3" />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-tier-3">No cafe units found</span>
            </div>
          ) : (
            filtered.map((p) => (
              <CafeListItem key={p.id} cafe={p} />
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
        "h-10 justify-start gap-4 px-4 rounded-lg transition-all relative group",
        active 
          ? "bg-primary/10 text-primary shadow-sm" 
          : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1"
      )}
    >
      <Icon className={cn("size-4.5", active ? "text-primary" : "text-tier-3 group-hover:text-tier-2")} />
      <span className={cn("text-[13px] tracking-tight font-medium")}>{label}</span>
      <span className={cn(
        "ml-auto text-[10px] font-semibold tracking-tighter",
        active ? "text-primary" : "text-tier-2"
      )}>
        {count}
      </span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />}
    </Button>
  );
}

function CafeListItem({ cafe }: { cafe: any }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Live': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Negotiation': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Trial': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-100 border-slate-500/20";
    }
  };

  return (
    <div className="premium-panel p-6 rounded-2xl flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all active:scale-[0.995]">
      <div className="flex items-center gap-7">
        <div className="size-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-tier-3 group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <Coffee className="size-6" />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-semibold tracking-tight text-primary group-hover:text-tier-1 transition-colors">
              {cafe.name}
            </h3>
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-tier-1 px-2.5 py-0.5 border border-white/[0.1] rounded-md bg-white/[0.05]">
              Impact: {cafe.impactScore}/10
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Badge variant="outline" className={cn("border px-3 py-0.5 h-auto text-[10px] font-medium uppercase tracking-[0.12em] rounded-lg flex items-center gap-2 transition-all", getStatusStyles(cafe.status))}>
              <span className={cn("size-1.5 rounded-full", cafe.status === 'Live' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-current")} />
              {cafe.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Star className="size-4 text-amber-500" />
              <span className="text-[12px] font-medium tracking-tight text-tier-1 opacity-90">Hospitality Vertical</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 mb-1.5">Decision Maker</span>
          <span className="text-[14px] font-medium tracking-tight text-tier-2">
            {cafe.contact || 'N/A'}
          </span>
        </div>
        <div className="size-10 rounded-full flex items-center justify-center bg-white/[0.015] border border-white/[0.05] group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
          <ChevronRight className="size-5 text-tier-3 group-hover:text-tier-1" />
        </div>
      </div>
    </div>
  );
}
