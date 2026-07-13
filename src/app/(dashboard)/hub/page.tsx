"use client";

import { useState } from "react";
import { 
  Library, 
  Search, 
  Plus, 
  Copy, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Tag, 
  MessageCircle,
  Clock,
  Briefcase,
  Loader2,
  Trash2,
  Building2,
  Phone,
  Hash,
  MapPin,
  Link as LinkIcon,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useMemoFirebase, useUser, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore, serverTimestamp, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

const categoryOptions = [
  { label: "Company Profile", icon: Building2 },
  { label: "Brand", icon: Briefcase },
  { label: "Product", icon: Tag },
  { label: "Legal", icon: ShieldCheck },
  { label: "FAQs", icon: MessageCircle },
  { label: "External Assets", icon: LinkIcon },
];

export default function HubPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = getFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Assets");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Resource State
  const [newResource, setNewResource] = useState({
    title: "",
    category: "Brand",
    content: "",
    address: "",
    phone: "",
    taxId: "",
    links: [] as { label: string; url: string }[]
  });

  const [linkInput, setLinkInput] = useState({ label: "", url: "" });

  const resourcesRef = useMemoFirebase(() => collection(firestore, 'company_resources'), [firestore]);
  const { data: resources, isLoading } = useCollection(resourcesRef);

  const handleAddLink = () => {
    if (linkInput.label && linkInput.url) {
      setNewResource({
        ...newResource,
        links: [...newResource.links, { ...linkInput }]
      });
      setLinkInput({ label: "", url: "" });
    }
  };

  const removeLink = (index: number) => {
    setNewResource({
      ...newResource,
      links: newResource.links.filter((_, i) => i !== index)
    });
  };

  const handleAddResource = () => {
    if (!user || !newResource.title || !newResource.content) return;

    const docData = {
      ...newResource,
      lastUpdatedByUserId: user.uid,
      lastUpdatedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(resourcesRef, docData);
    setIsAddOpen(false);
    resetForm();
    
    toast({
      title: "Asset Recorded",
      description: `"${docData.title}" has been synchronized with the Intelligence Hub.`,
    });
  };

  const resetForm = () => {
    setNewResource({ 
      title: "", 
      category: "Brand", 
      content: "",
      address: "",
      phone: "",
      taxId: "",
      links: []
    });
    setLinkInput({ label: "", url: "" });
  };

  const handleDeleteResource = (resourceId: string, title: string) => {
    if (!window.confirm(`Decommission strategic asset "${title}"?`)) return;
    const resourceRef = doc(firestore, 'company_resources', resourceId);
    deleteDocumentNonBlocking(resourceRef);
    toast({
      variant: "destructive",
      title: "Asset Decommissioned",
      description: `"${title}" has been removed from the registry.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Content Copied",
      description: "Asset content saved to clipboard.",
    });
  };

  const filteredResources = (resources || []).filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Assets" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.03]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg active-glow">
              <Library className="size-5.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Intelligence Hub</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Strategic Asset Registry</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-2xl">
            Central repository for company profiles, brand guidelines, and tactical sales materials. Use these assets to ensure mission consistency.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2.5 h-11 px-8 rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-xl shadow-primary/20">
              <Plus className="size-4" /> Record Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[650px] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">New Strategic Asset</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Asset Title</Label>
                  <Input 
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="e.g. Master Pitch Deck v3" 
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Category</Label>
                  <Select value={newResource.category} onValueChange={(v) => setNewResource({...newResource, category: v})}>
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-xl border-white/[0.1]">
                      {categoryOptions.map(opt => (
                        <SelectItem key={opt.label} value={opt.label}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newResource.category === "Company Profile" && (
                <div className="grid grid-cols-2 gap-4 p-4 border border-white/[0.05] rounded-xl bg-white/[0.01]">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Official Address</Label>
                    <Input 
                      value={newResource.address}
                      onChange={(e) => setNewResource({...newResource, address: e.target.value})}
                      placeholder="Full business address" 
                      className="bg-white/[0.02] border-white/[0.08] h-10 rounded-xl text-tier-1 text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Primary Phone</Label>
                    <Input 
                      value={newResource.phone}
                      onChange={(e) => setNewResource({...newResource, phone: e.target.value})}
                      placeholder="Support line" 
                      className="bg-white/[0.02] border-white/[0.08] h-10 rounded-xl text-tier-1 text-sm"
                    />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Tax ID / Business Registration</Label>
                    <Input 
                      value={newResource.taxId}
                      onChange={(e) => setNewResource({...newResource, taxId: e.target.value})}
                      placeholder="VAT / EIN / Registration Number" 
                      className="bg-white/[0.02] border-white/[0.08] h-10 rounded-xl text-tier-1 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label className="text-[10px] uppercase tracking-widest text-tier-3">Strategic Content</Label>
                <Textarea 
                  value={newResource.content}
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  placeholder="Paste mission statements, FAQs, or boilerplate copy here..." 
                  className="bg-white/[0.03] border-white/[0.08] min-h-[150px] rounded-xl text-tier-1 p-4"
                />
              </div>

              <div className="grid gap-3">
                <Label className="text-[10px] uppercase tracking-widest text-tier-3">Reference Links</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Link Name" 
                    value={linkInput.label}
                    onChange={(e) => setLinkInput({...linkInput, label: e.target.value})}
                    className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-xs"
                  />
                  <Input 
                    placeholder="URL (https://...)" 
                    value={linkInput.url}
                    onChange={(e) => setLinkInput({...linkInput, url: e.target.value})}
                    className="bg-white/[0.03] border-white/[0.08] h-11 rounded-xl text-xs"
                  />
                  <Button variant="secondary" onClick={handleAddLink} className="h-11 px-6 rounded-xl text-[10px] uppercase font-bold">Add</Button>
                </div>
                {newResource.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newResource.links.map((link, idx) => (
                      <Badge key={idx} variant="outline" className="pl-3 pr-1 py-1 gap-2 rounded-lg bg-white/[0.02] border-white/[0.1] text-tier-2">
                        <span className="text-[10px] font-bold">{link.label}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-5 rounded-full hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                          onClick={() => removeLink(idx)}
                        >
                          <X className="size-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddResource}
                disabled={!newResource.title || !newResource.content}
                className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest"
              >
                Synchronize Mission Asset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 flex flex-col gap-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..." 
              className="pl-11 h-11 bg-white/[0.02] border-white/[0.05] rounded-xl text-[13px] font-medium text-tier-1 focus-visible:ring-primary/20 transition-all" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-tier-4 px-3 mb-2">Resource Index</h3>
            <FilterButton 
              active={selectedCategory === "All Assets"} 
              onClick={() => setSelectedCategory("All Assets")}
              icon={Library}
              label="All Strategic Intel"
            />
            {categoryOptions.map((cat) => (
              <FilterButton 
                key={cat.label}
                active={selectedCategory === cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                icon={cat.icon}
                label={cat.label}
              />
            ))}
          </div>

          <div className="premium-panel p-6 rounded-2xl flex flex-col gap-5 border-emerald-500/20 bg-emerald-500/5 mt-auto shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">System Tip</span>
              <Sparkles className="size-4 text-emerald-500" />
            </div>
            <p className="text-[12px] font-medium text-tier-2 leading-relaxed">
              Use "Copy Description" to quickly populate outreach emails or platform application forms.
            </p>
          </div>
        </aside>

        <div className="lg:col-span-9 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-full h-72 flex flex-col items-center justify-center gap-4 opacity-40">
                <Loader2 className="size-10 text-primary animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-tier-3">Scanning Registry...</span>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="col-span-full h-72 border border-dashed border-white/[0.05] rounded-3xl flex flex-col items-center justify-center gap-4 opacity-30">
                <Library className="size-14 text-tier-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-tier-4">No matching assets found</span>
              </div>
            ) : (
              filteredResources.map((asset) => (
                <div key={asset.id} className={cn(
                  "premium-panel p-7 rounded-3xl flex flex-col gap-6 group transition-all relative overflow-hidden",
                  asset.category === "Company Profile" ? "border-primary/20 bg-primary/5" : "hover:bg-white/[0.02]"
                )}>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn(
                      "font-bold uppercase text-[9px] tracking-widest px-3 py-0.5 rounded-lg border",
                      asset.category === "Company Profile" ? "bg-primary text-white border-primary" : "bg-white/5 text-tier-3 border-white/10"
                    )}>
                      {asset.category}
                    </Badge>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-tier-4 font-bold uppercase tracking-widest">
                        <Clock className="size-3.5" /> {asset.lastUpdatedAt ? new Date(asset.lastUpdatedAt).toLocaleDateString() : 'Active'}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteResource(asset.id, asset.title)}
                        className="size-8 rounded-lg text-tier-4 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-tier-1 tracking-tight group-hover:text-primary transition-colors leading-tight">
                        {asset.title}
                      </h3>
                      <p className="text-[14px] text-tier-3 leading-relaxed font-medium text-justify">
                        {asset.content}
                      </p>
                    </div>

                    {asset.category === "Company Profile" && (
                      <div className="flex flex-col gap-3 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl shadow-inner">
                        {asset.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-[12px] font-semibold text-tier-2 leading-snug">{asset.address}</span>
                          </div>
                        )}
                        {asset.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="size-3.5 text-primary shrink-0" />
                            <span className="text-[12px] font-semibold text-tier-2">{asset.phone}</span>
                          </div>
                        )}
                        {asset.taxId && (
                          <div className="flex items-center gap-3">
                            <Hash className="size-3.5 text-primary shrink-0" />
                            <span className="text-[12px] font-bold text-tier-2 uppercase tracking-tight">ID: {asset.taxId}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {asset.links && asset.links.length > 0 && (
                      <div className="flex flex-col gap-3 pt-2">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Operational Links</span>
                        <div className="flex flex-wrap gap-2">
                          {asset.links.map((link: any, idx: number) => (
                            <Button 
                              key={idx} 
                              variant="outline" 
                              size="sm" 
                              asChild
                              className="h-9 rounded-xl border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all px-4"
                            >
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <ExternalLink className="size-3.5 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/[0.04]">
                    <Button 
                      variant="ghost" 
                      className="rounded-xl h-10 font-bold gap-2.5 bg-white/[0.02] border border-white/[0.05] hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all flex-1 text-[10px] uppercase tracking-[0.15em]"
                      onClick={() => copyToClipboard(asset.content)}
                    >
                      <Copy className="size-4" /> Copy Strategic Text
                    </Button>
                  </div>
                </div>
              )
            ))}

            {/* Premium Highlight Card */}
            <div className="premium-panel p-10 rounded-[32px] flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border-primary/20 col-span-full shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <FileText className="size-64 text-primary" />
              </div>
              <div className="flex items-center gap-10 relative z-10">
                <div className="size-20 rounded-3xl bg-white border border-white/[0.1] flex items-center justify-center shadow-2xl shadow-primary/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500">
                  <ShieldCheck className="size-10 text-primary" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-primary text-white font-bold uppercase text-[10px] tracking-[0.25em] px-4 py-1 rounded-full shadow-lg shadow-primary/20">Featured Intel</Badge>
                    <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.2em]">Master Strategy Blueprint v2.8</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-tier-1 tracking-tight leading-none">Core Business Operating System</h3>
                    <p className="text-[15px] text-tier-2 leading-relaxed font-medium max-w-2xl text-justify">
                      "We architect high-fidelity growth systems for modern multi-channel enterprises. Our vision is to provide the tactical backbone for global retail, wholesale, and direct-to-consumer expansion."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 mt-10 lg:mt-0 relative z-10 shrink-0">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white font-bold gap-3 rounded-2xl px-10 h-14 text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 active:scale-95"
                  onClick={() => copyToClipboard("We architect high-fidelity growth systems for modern multi-channel enterprises...")}
                >
                  <Copy className="size-5" /> Copy Master Pitch
                </Button>
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-bold text-tier-4 uppercase tracking-widest">Verified Global Identity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "h-11 justify-start gap-4 px-4 rounded-xl transition-all relative group",
        active 
          ? "bg-primary/10 text-primary shadow-sm hover:bg-primary/15" 
          : "text-tier-3 hover:bg-white/[0.03] hover:text-tier-1"
      )}
    >
      <Icon className={cn("size-4.5", active ? "text-primary" : "text-tier-4 group-hover:text-tier-2")} />
      <span className={cn("text-[13px] tracking-tight font-semibold", active ? "text-primary" : "")}>{label}</span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />}
    </Button>
  );
}
