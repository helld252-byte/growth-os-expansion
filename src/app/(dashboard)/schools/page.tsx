"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  GraduationCap,
  ArrowLeft,
  Clock,
  ShieldAlert,
  Zap,
  LayoutGrid,
  Filter,
  Star,
  Loader2,
  CheckCircle2,
  FlaskConical
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

type SchoolFilter = 'active' | 'pilot' | 'needs-action' | 'approved' | 'all';

export default function SchoolsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = getFirestore();
  const [activeFilter, setActiveFilter] = useState<SchoolFilter>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const partnersRef = useMemoFirebase(() => collection(firestore, 'partners'), [firestore]);
  const { data: partners, isLoading } = useCollection(partnersRef);

  const [newSchool, setNewSchool] = useState({
    name: "",
    type: "School",
    status: "Prospect",
    contact: "",
    impactScore: 5,
    notes: ""
  });

  const handleAddSchool = () => {
    if (!user || !newSchool.name) return;

    const docData = {
      ...newSchool,
      ownerId: user.uid,
      lastContact: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(partnersRef, docData);
    setIsAddOpen(false);
    setNewSchool({
      name: "",
      type: "School",
      status: "Prospect",
      contact: "",
      impactScore: 5,
      notes: ""
    });
    
    toast({
      title: "School Vertical Entry Created",
      description: `"${docData.name}" has been recorded in the education pipeline.`,
    });
  };

  const filtered = (partners || []).filter(p => {
    const isType = p.type === 'School';
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!isType || !matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return p.status === 'Active';
    if (activeFilter === 'pilot') return p.status === 'Pilot';
    if (activeFilter === 'approved') return p.status === 'Approved';
    if (activeFilter === 'needs-action') return ['Prospect', 'Contacted', 'Sample Sent'].includes(p.status);
    return true;
  });

  const counts = {
    'active': (partners || []).filter(p => p.type === 'School' && p.status === 'Active').length,
    'pilot': (partners || []).filter(p => p.type === 'School' && p.status === 'Pilot').length,
    'approved': (partners || []).filter(p => p.type === 'School' && p.status === 'Approved').length,
    'needs-action': (partners || []).filter(p => p.type === 'School' && ['Prospect', 'Contacted', 'Sample Sent'].includes(p.status)).length,
    'all': (partners || []).filter(p => p.type === 'School').length
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
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 px-3 mb-1">Vertical Filters</h3>
            <nav className="flex flex-col gap-1.5">
              <FilterButton 
                active={activeFilter === 'active'} 
                onClick={() => setActiveFilter('active')}
                icon={CheckCircle2}
                label="Active Units"
                count={counts['active']}
              />
              <FilterButton 
                active={activeFilter === 'pilot'} 
                onClick={() => setActiveFilter('pilot')}
                icon={FlaskConical}
                label="Pilot Ops"
                count={counts['pilot']}
              />
              <FilterButton 
                active={activeFilter === 'needs-action'} 
                onClick={() => setActiveFilter('needs-action')}
                icon={Clock}
                label="Pipeline"
                count={counts['needs-action']}
              />
              <FilterButton 
                active={activeFilter === 'approved'} 
                onClick={() => setActiveFilter('approved')}
                icon={ShieldAlert}
                label="Approved"
                count={counts['approved']}
              />
              <FilterButton 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')}
                icon={LayoutGrid}
                label="All Schools"
                count={counts['all']}
              />
            </nav>
          </div>
        </div>

        <div className="mt-auto">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary/20 hover:bg-primary text-tier-1 font-semibold text-[11px] uppercase tracking-wider h-11 rounded-xl transition-all shadow-lg active-glow border border-primary/20">
                <Plus className="size-4 mr-2" /> Add School
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">New Education Partnership</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">School Name</Label>
                  <Input 
                    value={newSchool.name}
                    onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                    placeholder="e.g. St. Jude's Academy" 
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Status</Label>
                    <Select value={newSchool.status} onValueChange={(v) => setNewSchool({...newSchool, status: v})}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-xl border-white/[0.1]">
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Sample Sent">Sample Sent</SelectItem>
                        <SelectItem value="Pilot">Pilot</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Fit Score</Label>
                    <Input 
                      type="number"
                      value={newSchool.impactScore}
                      onChange={(e) => setNewSchool({...newSchool, impactScore: Number(e.target.value)})}
                      className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddSchool}
                  disabled={!newSchool.name}
                  className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest"
                >
                  Authorize School
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight text-tier-1">School Systems</h1>
            <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-2xl">
              Targeting lunch programs, private school networks, and district-level food service partnerships.
            </p>
          </div>
          <div className="relative group w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools..." 
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
              <GraduationCap className="size-12 text-tier-3" />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-tier-3">No school units found</span>
            </div>
          ) : (
            filtered.map((p) => (
              <Link key={p.id} href={`/schools/${p.id}`}>
                <SchoolListItem school={p} />
              </Link>
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
          ? "bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary shadow-sm" 
          : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1"
      )}
    >
      <Icon className={cn("size-4.5", active ? "text-primary" : "text-tier-3 group-hover:text-tier-2")} />
      <span className={cn("text-[13px] tracking-tight font-medium", active ? "text-primary" : "")}>{label}</span>
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

function SchoolListItem({ school }: { school: any }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Pilot': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'Approved': return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      default: return "bg-slate-500/10 text-slate-100 border-slate-500/20";
    }
  };

  return (
    <div className="premium-panel p-6 rounded-2xl flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all active:scale-[0.995]">
      <div className="flex items-center gap-7">
        <div className="size-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-tier-3 group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <GraduationCap className="size-6" />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-semibold tracking-tight text-tier-1 group-hover:text-primary transition-colors">
              {school.name}
            </h3>
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-tier-1 px-2.5 py-0.5 border border-white/[0.1] rounded-md bg-white/[0.05]">
              Score: {school.impactScore}/10
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Badge variant="outline" className={cn("border px-3 py-0.5 h-auto text-[10px] font-medium uppercase tracking-[0.12em] rounded-lg flex items-center gap-2 transition-all", getStatusStyles(school.status))}>
              <span className={cn("size-1.5 rounded-full", school.status === 'Active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-current")} />
              {school.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Star className="size-4 text-amber-500" />
              <span className="text-[12px] font-medium tracking-tight text-tier-1 opacity-90">Education Strategic</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 mb-1.5">Decision Maker</span>
          <span className="text-[14px] font-medium tracking-tight text-tier-2">
            {school.contact || 'N/A'}
          </span>
        </div>
        <div className="size-10 rounded-full flex items-center justify-center bg-white/[0.015] border border-white/[0.05] group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
          <ChevronRight className="size-5 text-tier-3 group-hover:text-tier-1" />
        </div>
      </div>
    </div>
  );
}
