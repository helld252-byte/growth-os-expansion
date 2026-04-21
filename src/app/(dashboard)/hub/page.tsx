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
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { hubSections } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { label: "All Assets", icon: Library },
  { label: "Brand", icon: Briefcase },
  { label: "Product", icon: Tag },
  { label: "Legal", icon: ShieldCheck },
  { label: "FAQs", icon: MessageCircle },
];

export default function HubPage() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Content Copied",
      description: "Asset content saved to clipboard.",
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-6 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-extrabold tracking-tight mb-1">Company Hub</h1>
          <p className="text-muted-foreground text-sm">Strategic library for brand expansion resources</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 h-9 px-4 rounded-lg text-[10px]">
          <Plus className="size-4" /> New Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search hub..." 
              className="pl-8 h-8 bg-muted/30 border-none rounded-lg text-[11px]" 
            />
          </div>

          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <Button 
                key={cat.label}
                variant="ghost" 
                className="justify-start gap-2 h-9 px-2.5 hover:bg-muted/50 rounded-lg font-bold text-xs text-muted-foreground first:bg-primary/10 first:text-primary"
              >
                <cat.icon className="size-3.5" /> {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Resource Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hubSections.map((section) => (
            <div key={section.id} className="glass-card group p-4 rounded-xl flex flex-col gap-3 border border-white/5 hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black uppercase text-[8px] tracking-widest px-1.5 py-0">
                  {section.category}
                </Badge>
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground font-bold uppercase">
                  <Clock className="size-2.5" /> {section.lastUpdated}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-headline font-bold group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                  {section.content}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg h-7 font-bold gap-1.5 border-white/5 bg-muted/30 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all flex-1 text-[10px]"
                  onClick={() => copyToClipboard(section.content)}
                >
                  <Copy className="size-3" /> Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg h-7 w-7 border border-white/5 bg-muted/30"
                >
                  <ExternalLink className="size-3" />
                </Button>
              </div>
            </div>
          ))}

          {/* Quick Pitch Card */}
          <div className="glass-card group p-5 rounded-xl flex flex-col gap-3 border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent col-span-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary text-white font-black uppercase text-[8px] tracking-widest px-2">Featured</Badge>
              <FileText className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-headline font-bold text-white mb-1">Standard Brand Pitch</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Our modular systems redefine spatial efficiency for enterprises. We provide the backbone for modern retail and wholesale operations."
              </p>
            </div>
            <Button 
              className="mt-1 bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 self-start rounded-lg px-4 h-8 text-[10px]"
              onClick={() => copyToClipboard("Our modular systems redefine spatial efficiency...")}
            >
              <Copy className="size-3" /> Copy Full Pitch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
