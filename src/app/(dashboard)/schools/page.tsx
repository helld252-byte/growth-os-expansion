
"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  GraduationCap, 
  Star, 
  MessageSquare, 
  ChevronRight,
  Users,
  Loader2,
  Calendar
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
import { useToast } from "@/hooks/use-toast";

export default function SchoolsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const firestore = getFirestore();
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

  const filtered = (partners || []).filter(p => 
    p.type === 'School' && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/[0.03]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
              <GraduationCap className="size-5.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold tracking-tight text-tier-1">School Systems Vertical</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Lunch Programs & Private Education</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-xl">
            Targeting lunch programs, private school networks, and district-level food service partnerships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school systems..." 
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] rounded-xl text-[13px] font-medium placeholder:text-tier-3 text-tier-1 focus-visible:ring-primary/20 transition-all" 
            />
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                <Plus className="size-4 mr-2" /> Add School Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">New Education Partnership</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">School/District Name</Label>
                  <Input 
                    value={newSchool.name}
                    onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                    placeholder="e.g. St. Jude's Academy" 
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Current Status</Label>
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
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Fit Score (1-10)</Label>
                    <Input 
                      type="number"
                      min="1"
                      max="10"
                      value={newSchool.impactScore}
                      onChange={(e) => setNewSchool({...newSchool, impactScore: Number(e.target.value)})}
                      className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Primary Contact</Label>
                  <Input 
                    value={newSchool.contact}
                    onChange={(e) => setNewSchool({...newSchool, contact: e.target.value})}
                    placeholder="Principal or Food Service Director" 
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Intel/Notes</Label>
                  <Input 
                    value={newSchool.notes}
                    onChange={(e) => setNewSchool({...newSchool, notes: e.target.value})}
                    placeholder="Dietary requirements or enrollment data" 
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddSchool}
                  disabled={!newSchool.name}
                  className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest"
                >
                  Authorize School Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-48 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-tier-4 text-[11px] font-bold uppercase tracking-widest">
          No entries found in this vertical
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((entry) => (
            <VerticalCard key={entry.id} entry={entry} icon={GraduationCap} />
          ))}
        </div>
      )}
    </div>
  );
}

function VerticalCard({ entry, icon: Icon }: any) {
  return (
    <div className="premium-panel p-8 rounded-3xl flex flex-col gap-6 group hover:border-primary/30 transition-all cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex gap-5">
          <div className="size-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-tier-3 group-hover:text-primary group-hover:bg-primary/5 transition-all">
            <Icon className="size-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-bold text-tier-1 group-hover:text-primary transition-colors tracking-tight">
              {entry.name}
            </h3>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-white/[0.03] border-white/[0.08] text-[9px] font-bold uppercase tracking-wider text-tier-3">
                {entry.type}
              </Badge>
              <span className="text-[11px] text-tier-4 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Star className="size-3 text-amber-500" /> {entry.impactScore}/10 Score
              </span>
            </div>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
          entry.status === 'Active' || entry.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
          entry.status === 'Pilot' || entry.status === 'Trial' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
          "bg-slate-500/10 text-slate-300 border-slate-500/20"
        )}>
          {entry.status}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-6 border-t border-white/[0.03]">
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Primary Contact</span>
            <span className="text-[13px] font-semibold text-tier-1">{entry.contact || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Last Interaction</span>
            <span className="text-[13px] font-semibold text-tier-1">{entry.lastContact}</span>
          </div>
        </div>
        <ChevronRight className="size-5 text-tier-4 group-hover:text-primary transition-all group-hover:translate-x-1" />
      </div>
    </div>
  );
}
