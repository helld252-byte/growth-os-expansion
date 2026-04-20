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
  ChevronRight,
  TrendingUp,
  User,
  Star
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
    <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight mb-2">Growth Channels</h1>
          <p className="text-muted-foreground text-lg">Manage expansion pipelines and strategic partnerships</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/5 bg-muted/30 font-bold gap-2">
            <Filter className="size-4" /> Filter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
            <Plus className="size-4" /> Add Opportunity
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban" onValueChange={(v) => setView(v as any)} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-muted/50 p-1 border border-white/5 rounded-xl">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg font-bold px-4 py-2 gap-2">
              <Kanban className="size-4" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg font-bold px-4 py-2 gap-2">
              <TableIcon className="size-4" /> Table
            </TabsTrigger>
          </TabsList>

          <div className="relative group w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search channels..." 
              className="pl-10 h-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50" 
            />
          </div>
        </div>

        <TabsContent value="kanban" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 min-w-[1200px] overflow-x-auto pb-8 custom-scrollbar">
            {STAGES.map((stage) => {
              const items = platforms.filter(p => p.currentStage === stage);
              return (
                <div key={stage} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                      {stage}
                      <span className="size-5 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground border border-white/5">
                        {items.length}
                      </span>
                    </h3>
                  </div>
                  
                  <div className="kanban-column flex flex-col gap-3">
                    {items.length === 0 ? (
                      <div className="h-20 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        Empty
                      </div>
                    ) : (
                      items.map(p => (
                        <div key={p.id} className="glass-card p-4 rounded-xl flex flex-col gap-3 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{p.name}</span>
                            {p.priority === "High" && <Star className="size-3 text-primary fill-primary shrink-0" />}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-[10px] bg-white/5 border-none px-1.5 py-0 text-muted-foreground">{p.type}</Badge>
                            <Badge variant="outline" className="text-[10px] bg-white/5 border-none px-1.5 py-0 text-muted-foreground">{p.market}</Badge>
                          </div>

                          <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                              <User className="size-3 text-muted-foreground" />
                              <span className="text-[10px] font-bold text-muted-foreground">{p.owner.split(' ')[0]}</span>
                            </div>
                            <TrendingUp className={cn(
                              "size-3",
                              p.fitScore >= 8 ? "text-green-500" : "text-amber-500"
                            )} />
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground hover:text-primary hover:bg-primary/5 border border-dashed border-white/5 rounded-xl font-bold gap-2 py-6">
                      <Plus className="size-4" /> Add Item
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-muted/30">
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Platform</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Type</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Market</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Stage</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Priority</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold group-hover:text-primary transition-colors">{p.name}</span>
                        <span className="text-xs text-muted-foreground">{p.owner}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-white/5 border-none text-muted-foreground font-medium">{p.type}</Badge>
                    </td>
                    <td className="p-4 text-sm font-medium">{p.market}</td>
                    <td className="p-4">
                      <Badge className={cn(
                        "font-bold",
                        p.currentStage === "Live" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                      )}>
                        {p.currentStage}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn(
                        "font-bold uppercase text-[10px] tracking-widest",
                        p.priority === "High" ? "border-red-500/30 text-red-500" : "border-white/10 text-muted-foreground"
                      )}>
                        {p.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="size-8">
                          <ExternalLink className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
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