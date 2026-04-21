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
    <div className="max-w-[1440px] mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Context Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-white/[0.03]">
        <div className="flex items-center gap-5">
          <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Layers className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight">Growth Pipeline</h1>
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
              Manage active leads, applications, and expansion opportunities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9 h-9 bg-white/[0.03] border-white/[0.05] rounded-lg font-medium text-[11px] focus-visible:ring-primary/30" 
            />
          </div>
          <Button variant="outline" className="h-9 font-bold gap-2 border-white/10 px-4 rounded-lg text-[10px] uppercase tracking-wider">
            <Filter className="size-4" /> Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 h-9 px-5 rounded-lg shadow-lg text-[10px] uppercase tracking-wider">
            <Plus className="size-4" /> New Lead
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban" onValueChange={(v) => setView(v as any)} className="w-full">
        <div className="mb-6">
          <TabsList className="bg-white/[0.02] p-1.5 border border-white/[0.05] rounded-xl h-auto">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg font-bold px-5 py-2 gap-2 text-[10px] uppercase tracking-widest">
              <Kanban className="size-3.5" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg font-bold px-5 py-2 gap-2 text-[10px] uppercase tracking-widest">
              <TableIcon className="size-3.5" /> Registry
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kanban" className="mt-0 outline-none">
          <div className="flex gap-5 overflow-x-auto pb-8 min-h-[60vh] custom-scrollbar px-1">
            {STAGES.map((stage) => {
              const items = platforms.filter(p => p.currentStage === stage);
              return (
                <div key={stage} className="flex flex-col gap-4 min-w-[280px] w-[280px]">
                  <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary/40" />
                      {stage}
                    </h3>
                    <Badge variant="outline" className="bg-white/5 border-none text-[9px] font-bold text-muted-foreground/60 px-2 py-0.5">
                      {items.length}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {items.length === 0 ? (
                      <div className="h-20 border border-dashed border-white/[0.03] rounded-xl flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Empty</span>
                      </div>
                    ) : (
                      items.map(p => (
                        <div key={p.id} className="glass-card p-4.5 rounded-xl flex flex-col gap-3 group cursor-pointer active:scale-[0.98] transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{p.name}</span>
                              <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5">
                                <Globe className="size-3" /> {p.market}
                              </span>
                            </div>
                            {p.priority === "High" && (
                              <div className="p-1 rounded bg-accent/10 border border-accent/20">
                                <Star className="size-3 text-accent fill-accent" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline" className="text-[9px] font-bold bg-white/5 border-none text-muted-foreground/80 py-0.5 uppercase tracking-tighter">{p.type}</Badge>
                          </div>

                          <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/[0.03]">
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary">
                                {p.owner.charAt(0)}
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground/70">{p.owner.split(' ')[0]}</span>
                            </div>
                            <div className={cn(
                              "size-1.5 rounded-full",
                              p.fitScore >= 8 ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                            )} />
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="ghost" className="h-11 border border-dashed border-white/[0.03] hover:border-primary/20 hover:bg-primary/5 rounded-xl font-black text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-primary">
                      <Plus className="size-4 mr-2" /> New Lead
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
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Platform</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Type</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Market</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Stage</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Priority</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center font-bold text-[11px] text-primary group-hover:border-primary/30">
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold tracking-tight text-xs text-white group-hover:text-primary">{p.name}</span>
                          <span className="text-[9px] font-bold text-muted-foreground/60">{p.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-white/5 border-none text-[9px] font-black uppercase tracking-tighter text-muted-foreground/80 px-2 py-0.5">{p.type}</Badge>
                    </td>
                    <td className="p-4 text-[11px] font-bold text-white/80">{p.market}</td>
                    <td className="p-4">
                      <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-widest rounded px-2 py-1",
                        p.currentStage === "Live" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-primary/10 text-primary border border-primary/20"
                      )}>
                        {p.currentStage}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn(
                        "font-black uppercase text-[9px] tracking-[0.15em] rounded px-2 py-0.5 border",
                        p.priority === "High" ? "border-accent/30 text-accent bg-accent/5" : "border-white/10 text-muted-foreground/60 bg-white/5"
                      )}>
                        {p.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" className="size-7 rounded-lg opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>
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
