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
      title: "Copied to clipboard",
      description: "You can now paste this into your application form.",
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight mb-2">Company Hub</h1>
          <p className="text-muted-foreground text-lg">Central library for brand assets and application resources</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 h-11 px-6 rounded-xl">
          <Plus className="size-5" /> New Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search hub..." 
              className="pl-10 h-10 bg-muted/30 border-none rounded-xl" 
            />
          </div>

          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <Button 
                key={cat.label}
                variant="ghost" 
                className="justify-start gap-3 h-10 px-3 hover:bg-muted/50 rounded-xl font-bold text-muted-foreground first:bg-primary/10 first:text-primary"
              >
                <cat.icon className="size-4" /> {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Resource Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hubSections.map((section) => (
            <div key={section.id} className="glass-card group p-6 rounded-2xl flex flex-col gap-4 border border-white/5 hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[10px] tracking-widest px-2 py-0.5">
                  {section.category}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                  <Clock className="size-3" /> Updated {section.lastUpdated}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-headline font-bold group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {section.content}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg h-9 font-bold gap-2 border-white/5 bg-muted/30 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all flex-1"
                  onClick={() => copyToClipboard(section.content)}
                >
                  <Copy className="size-4" /> Copy Content
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg h-9 w-9 border border-white/5 bg-muted/30"
                >
                  <ExternalLink className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Special Quick Pitch Card */}
          <div className="glass-card group p-6 rounded-2xl flex flex-col gap-4 border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent col-span-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary text-white font-bold uppercase text-[10px] tracking-widest">Featured</Badge>
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold text-white mb-2">Standard Brand Pitch</h3>
              <p className="text-muted-foreground leading-relaxed">
                "Our modular systems redefine spatial efficiency for high-growth enterprises. With verified certifications across US and EU markets, we provide the backbone for modern retail and wholesale operations."
              </p>
            </div>
            <Button 
              className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold gap-2 self-start rounded-xl px-6 h-11"
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