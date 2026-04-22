
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
  X
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
    const resourceRef = doc(firestore, 'company_resources', resourceId);
    deleteDocumentNonBlocking(resourceRef);
    toast({
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
    <div className="max-w-[1440px] mx-auto flex flex-col gap-6 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Library className="size-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-tier-1">Intelligence Hub</h1>
            <p className="text-[11px] text-tier-2 font-medium uppercase tracking-[0.15em]">
              Strategic library for company profile, brand expansion, and sales materials.
            </p>
          </div>
        </div>

        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold gap-1.5 h-10 px-6 rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-lg shadow-primary/20">
              <Plus className="size-4" /> New Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[650px] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">Record Strategic Asset</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Asset Title</Label>
                  <Input 
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="e.g. Master Company Identity" 
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
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Address</Label>
                    <Input 
                      value={newResource.address}
                      onChange={(e) => setNewResource({...newResource, address: e.target.value})}
                      placeholder="Street, City, Country" 
                      className="bg-white/[0.03] border-white/[0.08] h-10 rounded-xl text-tier-1 text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Phone</Label>
                    <Input 
                      value={newResource.phone}
                      onChange={(e) => setNewResource({...newResource, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000" 
                      className="bg-white/[0.03] border-white/[0.08] h-10 rounded-xl text-tier-1 text-sm"
                    />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Tax ID / Registration</Label>
                    <Input 
                      value={newResource.taxId}
                      onChange={(e) => setNewResource({...newResource, taxId: e.target.value})}
                      placeholder="VAT / EIN / Company Number" 
                      className="bg-white/[0.03] border-white/[0.08] h-10 rounded-xl text-tier-1 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label className="text-[10px] uppercase tracking-widest text-tier-3">Asset Content / Description</Label>
                <Textarea 
                  value={newResource.content}
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  placeholder="Enter strategic content, mission statements, or detailed info..." 
                  className="bg-white/[0.03] border-white/[0.08] min-h-[120px] rounded-xl text-tier-1 p-4"
                />
              </div>

              <div className="grid gap-3">
                <Label className="text-[10px] uppercase tracking-widest text-tier-3">Strategic Links & Files</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Link Label (e.g. Sales Deck)" 
                    value={linkInput.label}
                    onChange={(e) => setLinkInput({...linkInput, label: e.target.value})}
                    className="bg-white/[0.03] border-white/[0.08] h-10 rounded-xl text-xs"
                  />
                  <Input 
                    placeholder="URL (https://...)" 
                    value={linkInput.url}
                    onChange={(e) => setLinkInput({...linkInput, url: e.target.value})}
                    className="bg-white/[0.03] border-white/[0.08] h-10 rounded-xl text-xs"
                  />
                  <Button variant="secondary" onClick={handleAddLink} className="h-10 px-4 rounded-xl text-[10px] uppercase font-bold">Add</Button>
                </div>
                {newResource.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newResource.links.map((link, idx) => (
                      <Badge key={idx} variant="secondary" className="pl-3 pr-1 py-1 gap-2 rounded-lg bg-white/5 border-white/10 group">
                        <span className="text-[10px]">{link.label}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-4 rounded-full hover:bg-rose-500/20 hover:text-rose-400"
                          onClick={() => removeLink(idx)}
                        >
                          <X className="size-2.5" />
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
                Synchronize Asset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter library..." 
              className="pl-10 h-11 bg-white/[0.02] border-white/[0.06] rounded-xl text-[13px] font-medium text-tier-1 placeholder:text-tier-4 focus-visible:ring-primary/20" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 px-3 mb-2">Resource Types</h3>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCategory("All Assets")}
              className={cn(
                "justify-start gap-4 h-10 px-3.5 rounded-lg transition-all text-[13px] font-medium",
                selectedCategory === "All Assets" 
                  ? "bg-primary/10 text-primary" 
                  : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1"
              )}
            >
              <Library className={cn("size-4.5", selectedCategory === "All Assets" ? "text-primary" : "text-tier-3")} /> 
              All Assets
            </Button>
            {categoryOptions.map((cat) => (
              <Button 
                key={cat.label}
                variant="ghost" 
                onClick={() => setSelectedCategory(cat.label)}
                className={cn(
                  "justify-start gap-4 h-10 px-3.5 rounded-lg transition-all text-[13px] font-medium",
                  selectedCategory === cat.label 
                    ? "bg-primary/10 text-primary" 
                    : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1"
                )}
              >
                <cat.icon className={cn("size-4.5", selectedCategory === cat.label ? "text-primary" : "text-tier-3")} /> 
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          {isLoading ? (
            <div className="col-span-2 flex flex-col items-center justify-center h-64 gap-4 opacity-50">
              <Loader2 className="size-8 text-primary animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Retrieving Assets...</span>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="col-span-2 h-64 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 opacity-30">
              <Library className="size-10" />
              <span className="text-[11px] font-bold uppercase tracking-widest">No Intelligence Assets Recorded</span>
            </div>
          ) : (
            filteredResources.map((section) => (
              <div key={section.id} className={cn(
                "premium-panel p-6 rounded-2xl flex flex-col gap-5 group transition-all",
                section.category === "Company Profile" ? "border-primary/40 bg-primary/5 shadow-primary/10" : "hover:border-primary/30"
              )}>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={cn(
                    "font-medium uppercase text-[9px] tracking-wider px-2.5 py-0.5 rounded-lg",
                    section.category === "Company Profile" ? "bg-primary text-white border-primary" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {section.category}
                  </Badge>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-tier-3 font-semibold uppercase tracking-wider">
                      <Clock className="size-3.5" /> {section.lastUpdatedAt ? new Date(section.lastUpdatedAt).toLocaleDateString() : 'Recent'}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteResource(section.id, section.title)}
                      className="size-7 rounded-lg text-tier-4 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-tier-1 tracking-tight">
                      {section.title}
                    </h3>
                    <p className="text-[14px] text-tier-2 leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>

                  {section.category === "Company Profile" && (
                    <div className="flex flex-col gap-3 p-4 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                      {section.address && (
                        <div className="flex items-start gap-3 text-[12px]">
                          <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-tier-2">{section.address}</span>
                        </div>
                      )}
                      {section.phone && (
                        <div className="flex items-center gap-3 text-[12px]">
                          <Phone className="size-3.5 text-primary shrink-0" />
                          <span className="text-tier-2">{section.phone}</span>
                        </div>
                      )}
                      {section.taxId && (
                        <div className="flex items-center gap-3 text-[12px]">
                          <Hash className="size-3.5 text-primary shrink-0" />
                          <span className="text-tier-2">Tax ID: {section.taxId}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {section.links && section.links.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-tier-4">Strategic Assets & Files</span>
                      <div className="flex flex-wrap gap-2">
                        {section.links.map((link: any, idx: number) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="h-8 rounded-lg border-white/[0.08] bg-white/[0.02] hover:bg-primary/10 hover:border-primary/30 transition-all px-3"
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="size-3 text-primary" />
                              <span className="text-[10px] font-semibold">{link.label}</span>
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/[0.04]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-xl h-10 font-semibold gap-2.5 bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 hover:bg-primary/10 hover:text-primary transition-all flex-1 text-[11px] uppercase tracking-wider"
                    onClick={() => copyToClipboard(section.content)}
                  >
                    <Copy className="size-4" /> Copy Description
                  </Button>
                </div>
              </div>
            )
          ))}

          {/* Featured Strategy Section */}
          <div className="premium-panel p-8 rounded-2xl flex flex-col gap-5 border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent col-span-1 md:col-span-2 shadow-2xl group">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary text-white font-semibold uppercase text-[10px] tracking-[0.15em] px-3 py-0.5 rounded-lg shadow-lg shadow-primary/20">Featured Strategic Asset</Badge>
              <FileText className="size-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-tier-1 tracking-tight">Standard Brand Pitch</h3>
              <p className="text-[15px] text-tier-2 leading-relaxed font-medium">
                "Our modular systems redefine spatial efficiency for enterprises. We provide the backbone for modern retail and wholesale operations. Scaling growth through strategic multi-channel execution."
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-bold gap-2.5 rounded-xl px-8 h-11 text-[11px] uppercase tracking-wider transition-all shadow-xl shadow-primary/20 active:scale-95"
                onClick={() => copyToClipboard("Our modular systems redefine spatial efficiency for enterprises...")}
              >
                <Copy className="size-4" /> Copy Full Pitch
              </Button>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-widest">Master Blueprint v2.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
