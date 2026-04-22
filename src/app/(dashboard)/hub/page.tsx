
"use client";

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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";

const categories = [
  { label: "All Assets", icon: Library },
  { label: "Brand", icon: Briefcase },
  { label: "Product", icon: Tag },
  { label: "Legal", icon: ShieldCheck },
  { label: "FAQs", icon: MessageCircle },
];

export default function HubPage() {
  const { toast } = useToast();
  const firestore = getFirestore();
  const resourcesRef = useMemoFirebase(() => collection(firestore, 'company_resources'), [firestore]);
  const { data: resources, isLoading } = useCollection(resourcesRef);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Content Copied",
      description: "Asset content saved to clipboard.",
    });
  };

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
              Strategic library for brand expansion, legal documents, and sales materials.
            </p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold gap-1.5 h-10 px-6 rounded-xl text-[11px] uppercase tracking-wider transition-all">
          <Plus className="size-4" /> New Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Filter library..." 
              className="pl-10 h-11 bg-white/[0.02] border-white/[0.06] rounded-xl text-[13px] font-medium text-tier-1 placeholder:text-tier-4 focus-visible:ring-primary/20" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-tier-4 px-3 mb-2">Resource Types</h3>
            {categories.map((cat, idx) => (
              <Button 
                key={cat.label}
                variant="ghost" 
                className={cn(
                  "justify-start gap-4 h-10 px-3.5 rounded-lg transition-all text-[13px] font-medium",
                  idx === 0 
                    ? "bg-primary/10 text-primary" 
                    : "text-tier-2 hover:bg-white/[0.03] hover:text-tier-1"
                )}
              >
                <cat.icon className={cn("size-4.5", idx === 0 ? "text-primary" : "text-tier-3")} /> 
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 flex items-center justify-center h-48">
              <Loader2 className="size-8 text-primary animate-spin" />
            </div>
          ) : !resources || resources.length === 0 ? (
            <div className="col-span-2 h-48 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-tier-4 text-[11px] font-bold uppercase tracking-widest">
              No Intelligence Assets Recorded
            </div>
          ) : (
            resources.map((section) => (
              <div key={section.id} className="premium-panel p-6 rounded-2xl flex flex-col gap-5 group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-medium uppercase text-[9px] tracking-wider px-2.5 py-0.5 rounded-lg">
                    {section.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-[10px] text-tier-3 font-semibold uppercase tracking-wider">
                    <Clock className="size-3.5" /> {section.lastUpdatedAt ? new Date(section.lastUpdatedAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <h3 className="text-base font-semibold text-tier-1 group-hover:text-primary transition-colors tracking-tight">
                    {section.title}
                  </h3>
                  <p className="text-[14px] text-tier-2 leading-relaxed line-clamp-3 font-medium">
                    {section.content}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/[0.04]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-xl h-10 font-semibold gap-2.5 bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 hover:bg-primary/10 hover:text-primary transition-all flex-1 text-[11px] uppercase tracking-wider"
                    onClick={() => copyToClipboard(section.content)}
                  >
                    <Copy className="size-4" /> Copy Content
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-10 w-10 border border-white/[0.05] bg-white/[0.02] text-tier-3 hover:text-tier-1 hover:border-white/10"
                  >
                    <ExternalLink className="size-4.5" />
                  </Button>
                </div>
              </div>
            ))
          )}

          <div className="premium-panel p-8 rounded-2xl flex flex-col gap-5 border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent col-span-1 md:col-span-2 shadow-2xl">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary text-white font-semibold uppercase text-[10px] tracking-[0.15em] px-3 py-0.5 rounded-lg">Featured Strategic Asset</Badge>
              <FileText className="size-6 text-primary" />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-tier-1 tracking-tight">Standard Brand Pitch</h3>
              <p className="text-[15px] text-tier-2 leading-relaxed font-medium">
                "Our modular systems redefine spatial efficiency for enterprises. We provide the backbone for modern retail and wholesale operations."
              </p>
            </div>
            <Button 
              className="mt-2 bg-primary hover:bg-primary/90 text-white font-semibold gap-2.5 self-start rounded-xl px-8 h-11 text-[11px] uppercase tracking-wider transition-all shadow-xl shadow-primary/20"
              onClick={() => copyToClipboard("Our modular systems redefine spatial efficiency...")}
            >
              <Copy className="size-4" /> Copy Full Pitch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
