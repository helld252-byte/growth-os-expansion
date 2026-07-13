"use client";

import { use, useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Edit3, 
  Clock, 
  Coffee,
  Calendar,
  Plus,
  Zap,
  Loader2,
  X,
  Mail,
  ShieldCheck,
  ChevronRight,
  Globe,
  Building2,
  MapPin,
  Phone,
  FileText,
  Upload,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
  Instagram,
  Target
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
import { useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking, useCollection } from "@/firebase";
import { doc, getFirestore, serverTimestamp, collection, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

export default function CafeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = getFirestore();

  const [isEditOpen, setIsAddOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  const docRef = useMemoFirebase(() => doc(firestore, 'partners', id), [firestore, id]);
  const { data: cafe, isLoading } = useDoc(docRef);

  const tasksQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'tasks'), where('growthOpportunityId', '==', id));
  }, [firestore, id]);
  const { data: cafeTasks } = useCollection(tasksQuery);

  const [editData, setEditData] = useState<any>(null);

  const historyItems = useMemo(() => {
    if (!cafe) return [];
    
    const journalItems = (cafe.journal || []).map((j: any) => ({
      date: new Date(j.date),
      user: j.user,
      content: j.content,
      type: 'note'
    }));

    const completedTasks = (cafeTasks || [])
      .filter(t => t.status === 'Completed')
      .map(t => ({
        date: t.updatedAt ? (t.updatedAt.toDate ? t.updatedAt.toDate() : new Date(t.updatedAt)) : new Date(t.dueDate || Date.now()),
        user: "System",
        content: `Step Verified: ${t.title}`,
        type: 'task'
      }));

    return [...journalItems, ...completedTasks].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [cafe, cafeTasks]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Retrieving Intel...</span>
      </div>
    );
  }

  if (!cafe) return notFound();

  const handleOpenEdit = () => {
    setEditData({
      name: cafe.name,
      status: cafe.status || "Prospect",
      priority: cafe.priority || "Medium",
      nextStep: cafe.nextStep || "",
      dueDate: cafe.dueDate || "",
      address: cafe.address || "",
      phone: cafe.phone || "",
      website: cafe.website || "",
      instagram: cafe.instagram || "",
      owner: cafe.contact || "",
      locations: cafe.locationsCount || 1,
      notes: cafe.notes || ""
    });
    setIsAddOpen(true);
  };

  const handleUpdate = () => {
    if (!docRef || !editData) return;
    updateDocumentNonBlocking(docRef, {
      ...editData,
      contact: editData.owner,
      locationsCount: Number(editData.locations),
      updatedAt: serverTimestamp(),
    });
    setIsAddOpen(false);
    toast({
      title: "Mission Calibration Updated",
      description: "Cafe parameters have been synchronized with the cloud registry.",
    });
  };

  const handleAddNote = () => {
    if (!docRef || !newNote || !user) return;
    const journalEntry = {
      date: new Date().toISOString(),
      user: user.displayName || "System Operator",
      content: newNote,
    };
    const updatedJournal = [journalEntry, ...(cafe.journal || [])];
    updateDocumentNonBlocking(docRef, { journal: updatedJournal });
    setNewNote("");
    setIsNoteOpen(false);
    toast({ title: "Field Note Recorded" });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Live': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Negotiation': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-6">
          <Link href="/cafes" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-tier-3 hover:text-tier-1 transition-colors w-fit group">
            <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> Cafe Vertical
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-semibold tracking-tight text-tier-1">{cafe.name}</h1>
              <div className="flex gap-2">
                <Badge variant="outline" className={cn("px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-lg", getStatusStyles(cafe.status))}>
                  {cafe.status}
                </Badge>
                <Badge variant="outline" className="px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-lg border-accent/20 text-accent/80 bg-accent/5">
                  {cafe.priority || 'Medium'} Priority
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[13px] font-medium text-tier-3">
              <span className="flex items-center gap-1.5"><Coffee className="size-4" /> {cafe.locationsCount || 1} Unit(s)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleOpenEdit} className="h-10 px-4 rounded-xl border border-white/[0.05] text-tier-2 hover:text-tier-1 text-[12px] font-semibold uppercase tracking-wider">
            <Edit3 className="size-4 mr-2" /> Recalibrate
          </Button>
          {cafe.website && (
            <Button asChild className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-[12px] font-semibold uppercase tracking-wider shadow-lg shadow-primary/20">
              <a href={cafe.website.startsWith('http') ? cafe.website : `https://${cafe.website}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 mr-2" /> Visit Site
              </a>
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="premium-panel p-8 rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="size-16 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Current Tactical Objective</span>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl font-semibold text-tier-1 tracking-tight leading-snug">
                  {cafe.nextStep || "Initializing growth protocols."}
                </h2>
                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-tier-4">Target Date</span>
                  <div className="flex items-center gap-2 text-accent font-semibold">
                    <Calendar className="size-4" />
                    <span>{cafe.dueDate || 'Open Timeline'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-tier-4">Hospitality onboarding history</h3>
              <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider text-tier-3 hover:text-primary">
                    <Plus className="size-3.5 mr-2" /> New Field Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl">
                  <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Record Field Note</DialogTitle></DialogHeader>
                  <div className="py-4"><Textarea placeholder="Enter interaction summary..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="bg-white/[0.03] border-white/[0.08] min-h-[150px] rounded-xl text-tier-1 p-4" /></div>
                  <DialogFooter><Button onClick={handleAddNote} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest">Commit to History</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.05]">
              {historyItems.length > 0 ? (
                historyItems.map((entry: any, i: number) => (
                  <TimelineEntry key={i} date={entry.date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} user={entry.user} content={entry.content} type={entry.type} />
                ))
              ) : (
                <TimelineEntry date="Initial" user="System" content={cafe.notes || "Operational history synchronized."} type="note" />
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-6 px-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">Company Contact Hub</h3>
              <Building2 className="size-4 text-tier-3" />
            </div>
            <div className="flex flex-col gap-5">
              <ContactField label="Location Address" value={cafe.address} icon={MapPin} />
              <ContactField label="Office Phone" value={cafe.phone} icon={Phone} />
              <ContactField label="Instagram" value={cafe.instagram} icon={Instagram} />
              <ContactField label="Total Locations" value={`${cafe.locationsCount || 1} Unit(s)`} icon={Target} />
              <Separator className="bg-white/[0.04]" />
              {cafe.contact && (
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">Owner / Decision Maker</span>
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">{cafe.contact.charAt(0)}</div>
                    <span className="text-[13px] font-semibold text-tier-1">{cafe.contact}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" className="h-10 rounded-xl border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 transition-all" onClick={() => { if (cafe.website) window.open(cafe.website, '_blank'); }}>Open Site</Button>
              <Button onClick={() => setIsNoteOpen(true)} className="h-10 rounded-xl bg-primary/20 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Log Interaction</Button>
            </div>
          </div>
          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-tier-4">About Cafe</h3>
            <p className="text-[13px] text-tier-2 leading-relaxed font-medium">{cafe.notes || "No detailed profile recorded."}</p>
          </section>
        </div>
      </div>

      {editData && (
        <Dialog open={isEditOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[600px]">
            <DialogHeader><DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Mission Calibration</DialogTitle></DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Cafe Name</Label><Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-tier-1" /></div>
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Status</Label><Select value={editData.status} onValueChange={(v) => setEditData({...editData, status: v})}><SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{['Prospect', 'Contacted', 'Trial', 'Negotiation', 'Live'].map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Objective</Label><Input value={editData.nextStep} onChange={(e) => setEditData({...editData, nextStep: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-tier-1" /></div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Target Date</Label>
                  <DatePicker value={editData.dueDate} onChange={(v) => setEditData({...editData, dueDate: v})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Owner</Label><Input value={editData.owner} onChange={(e) => setEditData({...editData, owner: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl" /></div>
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Locations Count</Label><Input type="number" value={editData.locations} onChange={(e) => setEditData({...editData, locations: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Instagram Handle</Label><Input value={editData.instagram} onChange={(e) => setEditData({...editData, instagram: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl" /></div>
                <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">Website</Label><Input value={editData.website} onChange={(e) => setEditData({...editData, website: e.target.value})} className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl" /></div>
              </div>
              <div className="grid gap-2"><Label className="text-[10px] uppercase tracking-widest text-tier-3">About / Notes</Label><Textarea value={editData.notes} onChange={(e) => setEditData({...editData, notes: e.target.value})} className="bg-white/[0.03] border-white/[0.08] min-h-[100px] rounded-xl" /></div>
            </div>
            <DialogFooter><Button onClick={handleUpdate} className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest">Synchronize Mission</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ContactField({ label, value, icon: Icon }: { label: string, value?: string, icon: any }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-2.5 text-tier-3"><Icon className="size-3.5" /><span className="text-[10px] font-bold uppercase tracking-widest">{label}</span></div>
      <span className="text-[12px] font-semibold text-tier-1 truncate max-w-[150px]">{value}</span>
    </div>
  );
}

function TimelineEntry({ date, user, content, type }: { date: string, user: string, content: string, type: 'note' | 'task' }) {
  return (
    <div className="flex flex-col gap-2 pl-8 relative">
      <div className="absolute left-0 top-1.5 size-[23px] rounded-full bg-background border-2 border-white/[0.08] flex items-center justify-center">
        {type === 'task' ? (<div className="size-full rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="size-3 text-emerald-500" /></div>) : (<div className="size-1.5 rounded-full bg-primary" />)}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-tier-2">{user}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">{date}</span>
      </div>
      <p className="text-[14px] text-tier-3 leading-relaxed font-medium text-justify">{content}</p>
    </div>
  );
}