"use client";

import { useState } from "react";
import { 
  Kanban, 
  Table as TableIcon, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Star,
  Layers,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { platforms } from "@/lib/mock-data";
import { PlatformStage } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGES: PlatformStage[] = [
  'Not Started',
  'Research',
  'Applied',
  'In Review',
  'Approved',
  'Onboarding',
  'Live'
];

export default function ChannelsPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700">
      {/* Context Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Layers className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-extrabold tracking-tight">Growth Pipeline</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
              Manage active leads, applications, and expansion opportunities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group w-40">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground group-focus-within:text-primary" />
            <Input 
              placeholder="Search leads..." 
              className="pl-7 h-8 bg-white/[0.03] border-white/[0.05] rounded-lg font-medium text-[10px] focus-visible:ring-primary/30" 
            />
          </div>
          <Button variant="outline" className="h-8 font-bold gap-1.5 border-white/10 px-3 rounded-lg text-[9px] uppercase tracking-wider">
            <Filter className="size-3" /> Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 h-8 px-4 rounded-lg shadow-lg text-[9px] uppercase tracking-wider">
            <Plus className="size-3.5" /> New Lead
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban" onValueChange={(v) => setView(v as any)} className="w-full">
        <div className="mb-4">
          <TabsList className="bg-white/[0.02] p-1 border border-white/[0.05] rounded-xl h-auto">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg font-bold px-4 py-1.5 gap-2 text-[9px] uppercase tracking-widest">
              <Kanban className="size-3" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg font-bold px-4 py-1.5 gap-2 text-[9px] uppercase tracking-widest">
              <TableIcon className="size-3" /> Registry
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kanban" className="mt-0 outline-none">
          <div className="flex gap-4 overflow-x-auto pb-6 min-h-[60vh] custom-scrollbar px-1">
            {STAGES.map((stage) => {
              const items = platforms.filter(p => p.currentStage === stage);
              return (
                <div key={stage} className="flex flex-col gap-3 min-w-[240px] w-[240px]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                    <h3 className="text-[8px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
                      <span className="size-1 rounded-full bg-primary/40" />
                      {stage}
                    </h3>
                    <Badge variant="outline" className="bg-white/5 border-none text-[8px] font-bold text-muted-foreground/60 px-1.5 py-0">
                      {items.length}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {items.length === 0 ? (
                      <div className="h-16 border border-dashed border-white/[0.03] rounded-xl flex items-center justify-center">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">Empty</span>
                      </div>
                    ) : (
                      items.map(p => (
                        <div key={p.id} className="glass-card p-3.5 rounded-xl flex flex-col gap-2.5 group cursor-pointer active:scale-[0.98] transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-xs tracking-tight group-hover:text-primary transition-colors">{p.name}</span>
                              <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1">
                                <Globe className="size-2" /> {p.market}
                              </span>
                            </div>
                            {p.priority === "High" && (
                              <div className="p-0.5 rounded bg-accent/10 border border-accent/20">
                                <Star className="size-2.5 text-accent fill-accent" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-[7px] font-bold bg-white/5 border-none text-muted-foreground/80 py-0 uppercase tracking-tighter">{p.type}</Badge>
                          </div>

                          <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-white/[0.03]">
                            <div className="flex items-center gap-1.5">
                              <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[7px] font-black text-primary">
                                {p.owner.charAt(0)}
                              </div>
                              <span className="text-[8px] font-bold text-muted-foreground/70">{p.owner.split(' ')[0]}</span>
                            </div>
                            <div className={cn(
                              "size-1 rounded-full",
                              p.fitScore >= 8 ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                            )} />
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="ghost" className="h-9 border border-dashed border-white/[0.03] hover:border-primary/20 hover:bg-primary/5 rounded-xl font-black text-[8px] uppercase tracking-widest text-muted-foreground/40 hover:text-primary">
                      <Plus className="size-3 mr-1.5" /> New Lead
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-0 outline-none">
          <div className="premium-panel rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/[0.05]">
                  <th className="p-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Platform</th>
                  <th className="p-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Type</th>
                  <th className="p-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Market</th>
                  <th className="p-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Stage</th>
                  <th className="p-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Priority</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group cursor-pointer">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="size-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center font-bold text-[10px] text-primary group-hover:border-primary/30">
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold tracking-tight text-[11px] text-white group-hover:text-primary">{p.name}</span>
                          <span className="text-[7px] font-bold text-muted-foreground/60">{p.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-white/5 border-none text-[7px] font-black uppercase tracking-tighter text-muted-foreground/80 px-1.5">{p.type}</Badge>
                    </td>
                    <td className="p-3 text-[10px] font-bold text-white/80">{p.market}</td>
                    <td className="p-3">
                      <Badge className={cn(
                        "font-black text-[7px] uppercase tracking-widest rounded px-1.5 py-0.5",
                        p.currentStage === "Live" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-primary/10 text-primary border border-primary/20"
                      )}>
                        {p.currentStage}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className={cn(
                        "font-black uppercase text-[7px] tracking-[0.15em] rounded px-1.5 border",
                        p.priority === "High" ? "border-accent/30 text-accent bg-accent/5" : "border-white/10 text-muted-foreground/60 bg-white/5"
                      )}>
                        {p.priority}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="size-6 rounded-lg opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-3" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
