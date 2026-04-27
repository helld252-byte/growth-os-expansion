"use client";

import { use, useState } from "react";
import { 
  ArrowLeft, 
  ExternalLink, 
  Edit3, 
  Clock, 
  Globe,
  Calendar,
  User,
  Plus,
  Zap,
  Loader2,
  Trash2,
  X,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking } from "@/firebase";
import { doc, getFirestore, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function PlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = getFirestore();

  const [isEditOpen, setIsAddOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  const docRef = useMemoFirebase(() => doc(firestore, 'growth_opportunities', id), [firestore, id]);
  const { data: platform, isLoading } = useDoc(docRef);

  // Edit State
  const [editData, setEditData] = useState<any>(null);
  const [reqInput, setReqInput] = useState("");

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

  const handleOpenEdit = () => {
    setEditData({
      name: platform.name,
      currentStage: platform.currentStage,
      priority: platform.priority,
      nextStep: platform.nextStep,
      dueDate: platform.dueDate || "",
      requirements: platform.requirements || [],
    });
    setIsAddOpen(true);
  };

  const handleUpdate = () => {
    if (!docRef || !editData) return;
    updateDocumentNonBlocking(docRef, {
      ...editData,
      updatedAt: serverTimestamp(),
    });
    setIsAddOpen(false);
    toast({
      title: "Mission Calibration Updated",
      description: "Platform parameters have been synchronized with the cloud registry.",
    });
  };

  const handleAddNote = () => {
    if (!docRef || !newNote || !user) return;
    const journalEntry = {
      date: new Date().toISOString(),
      user: user.displayName || "System Operator",
      content: newNote,
    };
    const updatedJournal = [journalEntry, ...(platform.journal || [])];
    updateDocumentNonBlocking(docRef, {
      journal: updatedJournal,
      lastUpdate: serverTimestamp(),
    });
    setNewNote("");
    setIsNoteOpen(false);
    toast({
      title: "Field Note Recorded",
      description: "Mission journal has been updated.",
    });
  };

  const handleToggleRequirement = (req: string) => {
    if (!docRef) return;
    const currentCompleted = platform.completedRequirements || [];
    const isCompleted = currentCompleted.includes(req);
    const newCompleted = isCompleted 
      ? currentCompleted.filter((r: string) => r !== req)
      : [...currentCompleted, req];
    
    updateDocumentNonBlocking(docRef, {
      completedRequirements: newCompleted,
      updatedAt: serverTimestamp(),
    });
  </采访>
  };

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
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors w-fit group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> Platforms
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
              <span className="uppercase tracking-wider text-[11px] font-bold text-primary">{platform.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={handleOpenEdit}
            className="h-10 px-4 rounded-xl border border-white/[0.05] text-tier-2 hover:text-tier-1 text-[12px] font-semibold uppercase tracking-wider"
          >
            <Edit3 className="size-4 mr-2" /> Recalibrate
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
                  {platform.nextStep || "Initializing growth protocols."}
                </h2>
                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-tier-4">Target Date</span>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <Calendar className="size-4" />
                    <span>{platform.dueDate || 'Open Timeline'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MISSION JOURNAL */}
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Mission Journal</h3>
              <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider text-tier-3 hover:text-primary">
                    <Plus className="size-3.5 mr-2" /> New Field Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Record Field Note</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea 
                      placeholder="Enter operational update or contact summary..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="bg-white/[0.03] border-white/[0.08] min-h-[150px] rounded-xl text-tier-1 p-4"
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddNote} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest">
                      Commit to Journal
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.05]">
              {(platform.journal && platform.journal.length > 0) ? (
                platform.journal.map((entry: any, i: number) => (
                  <TimelineEntry 
                    key={i}
                    date={new Date(entry.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} 
                    user={entry.user} 
                    content={entry.content} 
                  />
                ))
              ) : (
                <TimelineEntry 
                  date={platform.lastUpdate ? new Date(platform.lastUpdate).toLocaleDateString() : 'Initial'} 
                  user="System" 
                  content={platform.notes || "Operational history synchronized. Growth protocols active."} 
                />
              )}
            </div>
          </section>

          {/* PLATFORM ONBOARDING CHECKLIST */}
          {platform.requirements && platform.requirements.length > 0 && (
            <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Platform Onboarding Checklist</h3>
                  <span className="text-[13px] text-tier-2 font-medium">Compliance & validation protocols</span>
                </div>
                <div className="size-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <ShieldCheck className="size-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {platform.requirements.map((req: string, i: number) => {
                  const isChecked = (platform.completedRequirements || []).includes(req);
                  return (
                    <div key={i} className="flex items-center gap-4 py-2 group cursor-pointer" onClick={() => handleToggleRequirement(req)}>
                      <Checkbox 
                        checked={isChecked} 
                        className="size-5 rounded-md border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" 
                      />
                      <span className={cn(
                        "text-[14px] font-medium tracking-tight transition-colors",
                        isChecked ? "text-tier-4 line-through" : "text-tier-2 group-hover:text-tier-1"
                      )}>
                        {req}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>

        {/* SIDEBAR COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="premium-panel p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Metadata Intel</h3>
            <div className="flex flex-col gap-6">
              <InfoRow label="Market Zone" value={platform.market} icon={Globe} />
              <InfoRow label="Mission Start" value={platform.dateStarted} icon={Calendar} />
              <InfoRow label="Last Sync" value={platform.lastUpdate ? new Date(platform.lastUpdate).toLocaleDateString() : 'N/A'} icon={Clock} />
              <InfoRow label="Strategic Fit" value={`${platform.fitScore || 7}/10`} icon={Zap} />
              <Separator className="bg-white/[0.05]" />
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">Primary Contact</span>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    {platform.contactPerson?.charAt(0) || '?'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-tier-1">{platform.contactPerson || 'Unknown Unit'}</span>
                    <span className="text-[12px] text-tier-3 truncate">{platform.contactEmail || 'No secure channel'}</span>
                  </div>
                </div>
                <Button variant="outline" className="h-9 w-full rounded-lg border-white/[0.05] bg-white/[0.02] text-[10px] uppercase font-bold tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
                  <MessageSquare className="size-3.5 mr-2" /> Open Comms
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* EDIT DIALOG */}
      {editData && (
        <Dialog open={isEditOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Mission Calibration</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Platform Name</Label>
                  <Input 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Current Stage</Label>
                  <Select value={editData.currentStage} onValueChange={(v) => setEditData({...editData, currentStage: v})}>
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-tier-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Not Started', 'Research', 'Applied', 'In Review', 'Approved', 'Onboarding', 'Live'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Objective</Label>
                  <Input 
                    value={editData.nextStep}
                    onChange={(e) => setEditData({...editData, nextStep: e.target.value})}
                    className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Target Date</Label>
                  <Input 
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                    className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-tier-1"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-[10px] uppercase tracking-widest text-tier-4 font-bold">Onboarding Strategy</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add requirement (e.g. VAT validation)"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && reqInput) {
                        e.preventDefault();
                        setEditData({...editData, requirements: [...editData.requirements, reqInput]});
                        setReqInput("");
                      }
                    }}
                    className="bg-white/[0.02] border-white/[0.06] h-11 rounded-xl text-sm"
                  />
                  <Button variant="secondary" onClick={() => {
                    if (reqInput) {
                      setEditData({...editData, requirements: [...editData.requirements, reqInput]});
                      setReqInput("");
                    }
                  }} className="rounded-xl h-11 px-4 font-bold uppercase text-[10px] tracking-widest border border-white/[0.05]">Add</Button>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  {editData.requirements.map((req: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] group">
                      <span className="text-[13px] font-medium text-tier-2">{req}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditData({...editData, requirements: editData.requirements.filter((_: any, i: number) => i !== idx)})}
                        className="size-7 rounded-lg text-tier-4 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                  {editData.requirements.length === 0 && (
                    <span className="text-[11px] text-tier-4 italic ml-1">No specific requirements defined.</span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button onClick={handleUpdate} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                Synchronize Mission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
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
      <span className="text-[13px] font-semibold text-tier-1 text-right">{value || 'N/A'}</span>
    </div>
  );
}
