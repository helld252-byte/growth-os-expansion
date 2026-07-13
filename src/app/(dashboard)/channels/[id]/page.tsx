
"use client";

import { use, useState, useMemo } from "react";
import { 
  ArrowLeft, 
  ExternalLink, 
  Edit3, 
  Globe,
  Calendar,
  Plus,
  Zap,
  Loader2,
  Mail,
  ShieldCheck,
  Building2,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Link2,
  FileText,
  Upload,
  Target,
  Trash2
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
import { useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking, useCollection, deleteDocumentNonBlocking } from "@/firebase";
import { doc, getFirestore, serverTimestamp, collection, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

export default function PlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const firestore = getFirestore();

  const [isEditOpen, setIsAddOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  
  // Note Date/Time State
  const [noteDate, setNoteDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [noteTime, setNoteTime] = useState<string>(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

  const docRef = useMemoFirebase(() => doc(firestore, 'growth_opportunities', id), [firestore, id]);
  const { data: platform, isLoading } = useDoc(docRef);

  const tasksQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'tasks'), where('growthOpportunityId', '==', id));
  }, [firestore, id]);
  const { data: platformTasks } = useCollection(tasksQuery);

  const [editData, setEditData] = useState<any>(null);

  const historyItems = useMemo(() => {
    if (!platform) return [];
    
    const journalItems = (platform.journal || []).map((j: any) => ({
      date: new Date(j.date),
      user: j.user,
      content: j.content,
      type: 'note'
    }));

    const completedTasks = (platformTasks || [])
      .filter(t => t.status === 'Completed')
      .map(t => ({
        date: t.updatedAt ? (t.updatedAt.toDate ? t.updatedAt.toDate() : new Date(t.updatedAt)) : new Date(t.dueDate || Date.now()),
        user: "System",
        content: `Step Verified: ${t.title}`,
        type: 'task'
      }));

    return [...journalItems, ...completedTasks].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [platform, platformTasks]);

  const daysUntil = useMemo(() => {
    if (!platform?.dueDate) return null;
    const target = new Date(platform.dueDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [platform?.dueDate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Retrieving Intel...</span>
      </div>
    );
  }

  if (!platform) return notFound();

  const handleOpenEdit = () => {
    setEditData({
      name: platform.name,
      currentStage: platform.currentStage,
      priority: platform.priority,
      nextStep: platform.nextStep,
      dueDate: platform.dueDate || "",
      requirements: platform.requirements || [],
      website: platform.website || "",
      portalUrl: platform.portalUrl || "",
      supportEmail: platform.supportEmail || "",
      contactPerson: platform.contactPerson || "",
      contactRole: platform.contactRole || "",
      lastContactDate: platform.lastContactDate || "",
      commStatus: platform.commStatus || "No outreach",
      notes: platform.notes || "",
      source: platform.source || "Google",
      rejectionReason: platform.rejectionReason || "",
      rejectionLessons: platform.rejectionLessons || ""
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to decommission this platform? This action is permanent.")) {
      deleteDocumentNonBlocking(docRef);
      router.push('/channels');
      toast({
        variant: "destructive",
        title: "Mission Decommissioned",
        description: "Platform has been removed from the registry.",
      });
    }
  };

  const handleAddNote = () => {
    if (!docRef || !newNote || !user) return;
    const firstName = user.displayName?.split(' ')[0] || "Mikhail";
    const combinedDate = new Date(`${noteDate}T${noteTime}:00`);

    const journalEntry = {
      date: combinedDate.toISOString(),
      user: firstName,
      content: newNote,
    };
    const updatedJournal = [journalEntry, ...(platform.journal || [])];
    updateDocumentNonBlocking(docRef, {
      journal: updatedJournal,
      lastUpdate: serverTimestamp(),
    });
    setNewNote("");
    setNoteDate(new Date().toISOString().split('T')[0]);
    setNoteTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    setIsNoteOpen(false);
    toast({ title: "Field Note Recorded" });
  };

  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'Live': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'In Review': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Approved': return "bg-violet-500/10 text-violet-500 border-violet-500/20";
      case 'Rejected': return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-6">
          <Link href="/channels" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors w-fit group">
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
                {platform.source && (
                  <Badge className="bg-primary/5 text-primary border-primary/10 text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-lg">
                    {platform.source} Source
                  </Badge>
                )}
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
          <Button variant="ghost" onClick={handleOpenEdit} className="h-10 px-4 rounded-xl border border-border text-tier-2 hover:bg-secondary/50 hover:text-tier-1 text-[12px] font-semibold uppercase tracking-wider">
            <Edit3 className="size-4 mr-2" /> Recalibrate
          </Button>
          <Button variant="ghost" onClick={handleDelete} className="h-10 px-4 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/5 text-[12px] font-semibold uppercase tracking-wider">
            <Trash2 className="size-4 mr-2" /> Decommission
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
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="premium-panel p-8 rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-sm relative overflow-hidden group">
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
                  <div className="flex items-center gap-2 text-tier-1 font-semibold">
                    <Calendar className="size-4 text-primary" />
                    <span>{platform.dueDate || 'Open Timeline'}</span>
                  </div>
                  {daysUntil !== null && (
                    <span className={cn(
                      "text-[11px] font-bold mt-1 uppercase tracking-wider",
                      daysUntil < 0 ? "text-rose-500" : daysUntil <= 7 ? "text-amber-500" : "text-emerald-500"
                    )}>
                      {daysUntil < 0 ? `${Math.abs(daysUntil)} Days Overdue` : daysUntil === 0 ? "Due Today" : `${daysUntil} Days Remaining`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Activity Timeline</h3>
              <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider text-tier-3 hover:bg-secondary/50 hover:text-primary transition-all">
                    <Plus className="size-3.5 mr-2" /> New Field Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-2xl border-border rounded-2xl sm:max-w-[500px]">
                  <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Record Field Note</DialogTitle></DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[10px] uppercase tracking-widest text-tier-3">Date</Label>
                        <DatePicker value={noteDate} onChange={setNoteDate} />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] uppercase tracking-widest text-tier-3">Time</Label>
                        <Input type="time" value={noteTime} onChange={(e) => setNoteTime(e.target.value)} className="bg-secondary/50 border-border h-11 rounded-xl text-tier-1" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] uppercase tracking-widest text-tier-3">Interaction Summary</Label>
                      <Textarea placeholder="Enter operational update..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="bg-secondary/50 border-border min-h-[150px] rounded-xl text-tier-1 p-4" />
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleAddNote} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest">Commit to History</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {historyItems.length > 0 ? (
                historyItems.map((entry: any, i: number) => (
                  <TimelineEntry key={i} date={entry.date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} user={entry.user} content={entry.content} type={entry.type} />
                ))
              ) : (
                <TimelineEntry date="Initial" user="System" content={platform.notes || "Operational history synchronized."} type="note" />
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-6 px-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Contact Hub</h3>
              <Building2 className="size-4 text-tier-3" />
            </div>
            <div className="flex flex-col gap-5">
              <ContactField label="Official Website" value={platform.website} icon={Globe} link={platform.website} />
              <ContactField label="Supplier Portal" value={platform.portalUrl} icon={Link2} link={platform.portalUrl} />
              <ContactField label="Discovery Source" value={platform.source || "Google"} icon={Target} />
              <Separator className="bg-border" />
              {platform.contactPerson && (
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">Primary Contact</span>
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">{platform.contactPerson.charAt(0)}</div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-tier-1">{platform.contactPerson}</span>
                      <span className="text-[11px] text-tier-3">{platform.contactRole || 'Decision Maker'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <section className="flex flex-col gap-4 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">About Platform</h3>
            <p className="text-[14px] text-tier-2 leading-relaxed font-medium">
              {platform.notes || "No detailed profile recorded for this opportunity."}
            </p>
          </section>
        </div>
      </div>

      {editData && (
        <Dialog open={isEditOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-background/95 backdrop-blur-2xl border-border rounded-2xl sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Mission Calibration</DialogTitle></DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Platform Name</Label><Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="bg-secondary/50 border-border h-11 rounded-xl" /></div>
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Stage</Label><Select value={editData.currentStage} onValueChange={(v) => setEditData({...editData, currentStage: v})}><SelectTrigger className="bg-secondary/50 border-border h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{['Not Started', 'Research', 'Applied', 'In Review', 'Approved', 'Rejected', 'Onboarding', 'Live'].map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Source</Label><Select value={editData.source} onValueChange={(v) => setEditData({...editData, source: v})}><SelectTrigger className="bg-secondary/50 border-border h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{['RangeMe', 'Google', 'AI', 'LinkedIn', 'Referral', 'Other'].map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Target Date</Label><DatePicker value={editData.dueDate} onChange={(v) => setEditData({...editData, dueDate: v})} /></div>
              </div>
              <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">About / Description</Label><Textarea value={editData.notes} onChange={(e) => setEditData({...editData, notes: e.target.value})} className="bg-secondary/50 border-border min-h-[100px] rounded-xl" /></div>
            </div>
            <DialogFooter><Button onClick={handleUpdate} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest">Synchronize Mission</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ContactField({ label, value, icon: Icon, link }: { label: string, value?: string, icon: any, link?: string }) {
  if (!value && !link) return null;
  return (
    <div className="flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-2.5 text-tier-3"><Icon className="size-3.5" /><span className="text-[10px] font-bold uppercase tracking-widest">{label}</span></div>
      {link ? (
        <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-primary hover:underline truncate max-w-[150px]">{value || 'Link'}</a>
      ) : (
        <span className="text-[12px] font-semibold text-tier-1">{value || 'N/A'}</span>
      )}
    </div>
  );
}

function TimelineEntry({ date, user, content, type }: { date: string, user: string, content: string, type: 'note' | 'task' }) {
  return (
    <div className="flex flex-col gap-2 pl-8 relative">
      <div className="absolute left-0 top-1.5 size-[23px] flex items-center justify-center">
        <div className="size-full rounded-full bg-background border border-border absolute inset-0 shadow-sm" />
        <div className={cn(
          "size-[7px] rounded-full transition-all relative z-10",
          type === 'task' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-primary shadow-[0_0_8px_rgba(147,51,234,0.3)]"
        )} />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-tier-2">{user}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">{date}</span>
      </div>
      <p className="text-[14px] text-tier-3 leading-relaxed font-medium">{content}</p>
    </div>
  );
}
