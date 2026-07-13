"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Globe,
  ArrowLeft,
  Clock,
  Zap,
  LayoutGrid,
  Loader2,
  Bookmark,
  SquareCheck,
  CheckCircle2,
  X,
  Shield,
  Target,
  Ghost
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
import { Textarea } from "@/components/ui/textarea";
import { useCollection, useMemoFirebase, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

type FilterStatus = 'all' | 'rangeme' | 'applied' | 'waiting' | 'approved' | 'rejected' | 'no-response' | 'high-priority';

const BUSINESS_MODELS = ["Wholesale", "B2B", "Dropshipping", "BTC", "B2B + Dropshipping", "Marketplace", "Partnership"];
const BUSINESS_TYPES = [
  "Marketplace",
  "Wholesale Marketplace",
  "Distributor",
  "Retailer",
  "Broker",
  "Buying Group",
  "Foodservice Distributor",
  "Sales Agency",
  "Importer",
  "Corporate Procurement",
  "Licensing Partner"
];

export default function PlatformsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = getFirestore();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const opportunitiesRef = useMemoFirebase(() => collection(firestore, 'growth_opportunities'), [firestore]);
  const { data: opportunities, isLoading } = useCollection(opportunitiesRef);

  const [newOp, setNewOp] = useState({
    name: "",
    type: "Wholesale Marketplace",
    businessModel: "Wholesale",
    source: "Google",
    market: "Global",
    priority: "Medium",
    currentStage: "Not Started",
    nextStep: "Initial Outreach",
    dueDate: "",
    notes: ""
  });

  const handleAddPlatform = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please authenticate to initialize platforms.",
      });
      return;
    }
    
    const docData = {
      ...newOp,
      ownerId: user.uid,
      dateStarted: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString(),
      productsUploaded: false,
      salesStarted: false,
      blockers: "",
      contactPerson: "",
      contactRole: "",
      contactEmail: "",
      website: "",
      portalUrl: "",
      supportEmail: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      estimatedValue: 0,
      fitScore: 5,
      riskLevel: "Medium"
    };

    addDocumentNonBlocking(opportunitiesRef, docData);
    setIsAddOpen(false);
    setNewOp({
      name: "",
      type: "Wholesale Marketplace",
      businessModel: "Wholesale",
      source: "Google",
      market: "Global",
      priority: "Medium",
      currentStage: "Not Started",
      nextStep: "Initial Outreach",
      dueDate: "",
      notes: ""
    });
    toast({
      title: "Opportunity Initialized",
      description: `${docData.name} has been added to the registry.`,
    });
  };

  const filteredPlatforms = (opportunities || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'rangeme') return p.source === 'RangeMe';
    if (activeFilter === 'applied') return p.currentStage === 'Applied';
    if (activeFilter === 'waiting') return p.currentStage === 'In Review';
    if (activeFilter === 'approved') return p.currentStage === 'Approved';
    if (activeFilter === 'rejected') return p.currentStage === 'Rejected';
    if (activeFilter === 'no-response') return p.currentStage === 'No Response';
    if (activeFilter === 'high-priority') return p.priority === 'High';
    return true;
  });

  const counts = {
    'all': (opportunities || []).length,
    'rangeme': (opportunities || []).filter(p => p.source === 'RangeMe').length,
    'applied': (opportunities || []).filter(p => p.currentStage === 'Applied').length,
    'waiting': (opportunities || []).filter(p => p.currentStage === 'In Review').length,
    'approved': (opportunities || []).filter(p => p.currentStage === 'Approved').length,
    'rejected': (opportunities || []).filter(p => p.currentStage === 'Rejected').length,
    'no-response': (opportunities || []).filter(p => p.currentStage === 'No Response').length,
    'high-priority': (opportunities || []).filter(p => p.priority === 'High').length,
  };

  return (
    <div className="max-w-[1400px] mx-auto flex gap-12 animate-in fade-in duration-700">
      <aside className="w-64 shrink-0 flex flex-col gap-10">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Return to Base
        </Link>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4 px-4 mb-2">Filter Opportunities</h3>
            <nav className="flex flex-col gap-1">
              <FilterButton 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')}
                icon={Globe}
                label="All Opportunities"
                count={counts['all']}
              />
              <FilterButton 
                active={activeFilter === 'rangeme'} 
                onClick={() => setActiveFilter('rangeme')}
                icon={Bookmark}
                label="From RangeMe"
                count={counts['rangeme']}
              />
              <FilterButton 
                active={activeFilter === 'applied'} 
                onClick={() => setActiveFilter('applied')}
                icon={SquareCheck}
                label="Applied"
                count={counts['applied']}
              />
              <FilterButton 
                active={activeFilter === 'waiting'} 
                onClick={() => setActiveFilter('waiting')}
                icon={Clock}
                label="Waiting"
                count={counts['waiting']}
              />
              <FilterButton 
                active={activeFilter === 'approved'} 
                onClick={() => setActiveFilter('approved')}
                icon={CheckCircle2}
                label="Approved"
                count={counts['approved']}
              />
              <FilterButton 
                active={activeFilter === 'no-response'} 
                onClick={() => setActiveFilter('no-response')}
                icon={Ghost}
                label="No Response"
                count={counts['no-response']}
              />
              <FilterButton 
                active={activeFilter === 'rejected'} 
                onClick={() => setActiveFilter('rejected')}
                icon={X}
                label="Rejected"
                count={counts['rejected']}
              />
              <FilterButton 
                active={activeFilter === 'high-priority'} 
                onClick={() => setActiveFilter('high-priority')}
                icon={Shield}
                label="High Priority"
                count={counts['high-priority']}
              />
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Opportunities</h1>
            <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-2xl">
              Manage wholesale, retail, and global digital channel scaling across tactical operational zones.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities..." 
                className="pl-11 h-11 bg-white/[0.02] border-border rounded-xl font-medium text-[13px] focus-visible:ring-primary/20 placeholder:text-tier-3 transition-all text-tier-1" 
              />
            </div>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-lg shadow-primary/20">
                  <Plus className="size-4 mr-2" /> Add Platform
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background/95 backdrop-blur-2xl border-border rounded-2xl sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">New Strategic Platform</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Platform Name</Label>
                    <Input 
                      value={newOp.name}
                      onChange={(e) => setNewOp({...newOp, name: e.target.value})}
                      placeholder="e.g. Amazon Europe" 
                      className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase tracking-widest text-tier-3">Business Type</Label>
                      <Select value={newOp.type} onValueChange={(v) => setNewOp({...newOp, type: v})}>
                        <SelectTrigger className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover/95 backdrop-blur-xl border-border">
                          {BUSINESS_TYPES.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase tracking-widest text-tier-3">Business Model</Label>
                      <Select value={newOp.businessModel} onValueChange={(v) => setNewOp({...newOp, businessModel: v})}>
                        <SelectTrigger className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover/95 backdrop-blur-xl border-border">
                          {BUSINESS_MODELS.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase tracking-widest text-tier-3">Discovery Source</Label>
                      <Select value={newOp.source} onValueChange={(v) => setNewOp({...newOp, source: v})}>
                        <SelectTrigger className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover/95 backdrop-blur-xl border-border">
                          <SelectItem value="RangeMe">RangeMe</SelectItem>
                          <SelectItem value="Google">Google</SelectItem>
                          <SelectItem value="AI">AI Search</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase tracking-widest text-tier-3">Priority</Label>
                      <Select value={newOp.priority} onValueChange={(v) => setNewOp({...newOp, priority: v})}>
                        <SelectTrigger className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase tracking-widest text-tier-3">Target Market</Label>
                      <Input 
                        value={newOp.market}
                        onChange={(e) => setNewOp({...newOp, market: e.target.value})}
                        placeholder="e.g. EU, US" 
                        className="bg-secondary/50 border-border h-12 rounded-xl text-tier-1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase tracking-widest text-tier-3">Target Date</Label>
                      <DatePicker value={newOp.dueDate} onChange={(v) => setNewOp({...newOp, dueDate: v})} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">About / Description</Label>
                    <Textarea 
                      value={newOp.notes}
                      onChange={(e) => setNewOp({...newOp, notes: e.target.value})}
                      placeholder="Enter strategic overview..." 
                      className="bg-secondary/50 border-border min-h-[100px] rounded-xl text-tier-1 p-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleAddPlatform}
                    disabled={!newOp.name}
                    className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Initialize Platform
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="h-72 flex flex-col items-center justify-center gap-4 opacity-50">
              <Loader2 className="size-8 text-primary animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-3">Syncing Cloud Database</span>
            </div>
          ) : filteredPlatforms.length === 0 ? (
            <div className="h-72 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 opacity-30">
              <LayoutGrid className="size-12 text-tier-3" />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-tier-3">No matching opportunities found</span>
            </div>
          ) : (
            filteredPlatforms.map((p) => (
              <Link key={p.id} href={`/channels/${p.id}`} className="block group">
                <PlatformListItem platform={p} />
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
        "h-11 justify-start gap-4 px-4 rounded-xl transition-all relative group",
        active 
          ? "bg-secondary text-tier-1 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] hover:bg-secondary" 
          : "text-tier-3 hover:bg-secondary/50 hover:text-tier-1"
      )}
    >
      <Icon className={cn("size-4.5", active ? "text-primary" : "text-tier-3 group-hover:text-tier-2")} />
      <span className={cn("text-[13px] tracking-tight font-medium", active ? "text-tier-1" : "")}>{label}</span>
      <span className={cn(
        "ml-auto text-[11px] font-bold tabular-nums",
        active ? "text-primary" : "text-tier-4"
      )}>
        {count}
      </span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />}
    </Button>
  );
}

function PlatformListItem({ platform }: { platform: any }) {
  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'Live':
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'In Review':
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Approved':
        return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case 'Applied':
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'Research':
        return "bg-slate-500/20 text-slate-100 border-slate-500/40";
      case 'Rejected':
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case 'No Response':
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case 'Onboarding':
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-100 border-zinc-500/30";
    }
  };

  return (
    <div className="premium-panel p-6 rounded-2xl flex items-center justify-between group hover:bg-secondary/30 hover:border-border cursor-pointer transition-all active:scale-[0.995]">
      <div className="flex items-center gap-7">
        <div className="size-12 rounded-xl bg-secondary/30 border border-border flex items-center justify-center text-tier-3 group-hover:text-tier-1 transition-all">
          <Globe className="size-6" />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-semibold tracking-tight text-tier-1 group-hover:text-primary transition-colors">
              {platform.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-tier-2 px-2.5 py-0.5 border border-border rounded-md bg-secondary/30">
                {platform.businessModel}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-tier-2 px-2.5 py-0.5 border border-border rounded-md bg-secondary/30">
                {platform.type}
              </span>
              {platform.source && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 border border-primary/20 rounded-md bg-primary/5">
                  {platform.source}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Badge 
              variant="outline" 
              className={cn(
                "border px-3 py-0.5 h-auto text-[10px] font-medium uppercase tracking-[0.12em] rounded-lg flex items-center gap-2 transition-all",
                getStageStyles(platform.currentStage)
              )}
            >
              <span className={cn("size-1.5 rounded-full", platform.currentStage === 'Live' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-current")} />
              {platform.currentStage}
            </Badge>
            <div className="flex items-center gap-2">
              <Zap className={cn("size-4", platform.priority === 'High' ? "text-accent" : "text-tier-3")} />
              <span className="text-[12px] font-medium tracking-tight text-tier-2 opacity-90">{platform.priority} Priority</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 mb-1.5">Target Action</span>
          <span className="text-[14px] font-medium tracking-tight text-tier-2">
            {platform.nextStep}
          </span>
        </div>
        
        <div className="size-10 rounded-full flex items-center justify-center bg-secondary/20 border border-border group-hover:bg-secondary transition-all">
          <ChevronRight className="size-5 text-tier-3 group-hover:text-tier-1" />
        </div>
      </div>
    </div>
  );
}
