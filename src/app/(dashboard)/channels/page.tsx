"use client";

import { useState } from "react";
import { 
  Kanban, 
  Table as TableIcon, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ExternalLink,
  TrendingUp,
  User,
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
    <div className="max-w-[1600px] mx-auto flex flex-col gap-10 animate-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Layers className="size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-headline font-extrabold tracking-tight">Growth Pipeline</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Multi-Channel Expansion Control</span>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{platforms.length} active leads</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group w-64 mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9 h-11 bg-white/[0.03] border-white/[0.05] rounded-xl font-medium focus-visible:ring-primary/30" 
            />
          </div>
          <Button variant="outline" className="glass-card font-bold gap-2 h-11 border-white/10 px-6 rounded-xl">
            <Filter className="size-4" /> Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 h-11 px-6 rounded-xl shadow-xl shadow-primary/20">
            <Plus className="size-5" /> New Lead
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban" onValueChange={(v) => setView(v as any)} className="w-full">
        <div className="mb-8">
          <TabsList className="bg-white/[0.02] p-1.5 border border-white/[0.05] rounded-2xl h-auto">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold px-6 py-2.5 gap-2 text-xs uppercase tracking-widest">
              <Kanban className="size-3.5" /> Pipeline View
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold px-6 py-2.5 gap-2 text-xs uppercase tracking-widest">
              <TableIcon className="size-3.5" /> Registry View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kanban" className="mt-0 outline-none">
          <div className="flex gap-6 overflow-x-auto pb-10 min-h-[70vh] custom-scrollbar px-1">
            {STAGES.map((stage) => {
              const items = platforms.filter(p => p.currentStage === stage);
              return (
                <div key={stage} className="flex flex-col gap-4 min-w-[300px] w-[300px]">
                  <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary/40" />
                      {stage}
                    </h3>
                    <Badge variant="outline" className="bg-white/5 border-none text-[10px] font-bold text-muted-foreground/60 px-1.5 py-0">
                      {items.length}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {items.length === 0 ? (
                      <div className="h-24 border-2 border-dashed border-white/[0.03] rounded-2xl flex items-center justify-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">Void</span>
                      </div>
                    ) : (
                      items.map(p => (
                        <div key={p.id} className="glass-card p-5 rounded-2xl flex flex-col gap-4 group cursor-pointer active:scale-95 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{p.name}</span>
                              <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1">
                                <Globe className="size-2.5" /> {p.market}
                              </span>
                            </div>
                            {p.priority === "High" && (
                              <div className="p-1 rounded-md bg-accent/10 border border-accent/20">
                                <Star className="size-3 text-accent fill-accent" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline" className="text-[9px] font-bold bg-white/5 border-none text-muted-foreground/80 py-0 uppercase tracking-tighter">{p.type}</Badge>
                          </div>

                          <div className="flex items-center justify-between mt-1 pt-4 border-t border-white/[0.03]">
                            <div className="flex items-center gap-2">
                              <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-black text-primary">
                                {p.owner.charAt(0)}
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground/70">{p.owner.split(' ')[0]}</span>
                            </div>
                            <div className={cn(
                              "size-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                              p.fitScore >= 8 ? "bg-green-500 shadow-green-500/40" : "bg-amber-500 shadow-amber-500/40"
                            )} />
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="ghost" className="h-14 border-2 border-dashed border-white/[0.03] hover:border-primary/20 hover:bg-primary/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-all">
                      <Plus className="size-4 mr-2" /> Add Objective
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-0 outline-none">
          <div className="premium-panel rounded-[2rem] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/[0.05]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Platform Lead</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Classification</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Geo Market</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Current Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Strategic Rank</th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group cursor-pointer">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center font-headline font-bold text-primary group-hover:border-primary/30 transition-all">
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold tracking-tight text-white group-hover:text-primary transition-colors">{p.name}</span>
                          <span className="text-[10px] font-bold text-muted-foreground/60">Owner: {p.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className="bg-white/5 border-none text-[10px] font-black uppercase tracking-tighter text-muted-foreground/80 px-2">{p.type}</Badge>
                    </td>
                    <td className="p-6 text-xs font-bold text-white/80">{p.market}</td>
                    <td className="p-6">
                      <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-widest rounded-lg px-2.5 py-1",
                        p.currentStage === "Live" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-primary/10 text-primary border border-primary/20"
                      )}>
                        {p.currentStage}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className={cn(
                        "font-black uppercase text-[9px] tracking-[0.2em] rounded-md px-2 border",
                        p.priority === "High" ? "border-accent/30 text-accent bg-accent/5" : "border-white/10 text-muted-foreground/60 bg-white/5"
                      )}>
                        {p.priority}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-white/5 hover:text-white">
                          <ExternalLink className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-white/5 hover:text-white">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
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
