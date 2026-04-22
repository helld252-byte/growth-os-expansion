
"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Handshake, 
  Star, 
  MessageSquare, 
  Globe,
  ChevronRight,
  Users,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function PartnershipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const firestore = getFirestore();
  const partnersRef = useMemoFirebase(() => collection(firestore, 'partners'), [firestore]);
  const { data: partners, isLoading } = useCollection(partnersRef);

  const filteredPartners = (partners || []).filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgImpact = filteredPartners.length > 0 
    ? (filteredPartners.reduce((acc, p) => acc + (p.impactScore || 0), 0) / filteredPartners.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/[0.03]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-lg shadow-accent/10">
              <Handshake className="size-5.5 text-accent" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Strategic Partnerships</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Global Ecosystem Command</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-xl">
            Cultivate relationships with influencers, industry communities, and co-branding partners to drive organic growth.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-accent transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ecosystem..." 
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] rounded-xl text-[13px] font-medium placeholder:text-tier-3 text-tier-1 focus-visible:ring-accent/20 transition-all" 
            />
          </div>
          <Button className="h-10 px-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-accent/20">
            <Plus className="size-4 mr-2" /> New Connection
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Partners" value={filteredPartners.length} icon={Users} />
        <MetricCard label="Active Reach" value="1.2M" icon={Globe} />
        <MetricCard label="In Negotiation" value={filteredPartners.filter(p => p.status === 'Negotiating').length} icon={Handshake} />
        <MetricCard label="Impact Score" value={avgImpact} icon={Star} />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-tier-4 px-2">Ecosystem Directory</h2>
        
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="h-48 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-tier-4 text-[11px] font-bold uppercase tracking-widest">
            No Strategic Partners
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="premium-panel p-8 rounded-3xl flex flex-col gap-6 group hover:border-accent/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex gap-5">
                    <div className="size-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-tier-3 group-hover:text-accent group-hover:bg-accent/5 transition-all">
                      <Handshake className="size-7" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-xl font-bold text-tier-1 group-hover:text-accent transition-colors tracking-tight">
                        {partner.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-white/[0.03] border-white/[0.08] text-[9px] font-bold uppercase tracking-wider text-tier-3">
                          {partner.type}
                        </Badge>
                        <span className="text-[11px] text-tier-4 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Star className="size-3 text-amber-500" /> {partner.impactScore}/10 Impact
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                    partner.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                    partner.status === 'Negotiating' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                    "bg-slate-500/10 text-slate-300 border-slate-500/20"
                  )}>
                    {partner.status}
                  </div>
                </div>

                <div className="p-5 bg-white/[0.015] border border-white/[0.04] rounded-2xl flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tier-4">Latest Intel</span>
                  <p className="text-[14px] text-tier-2 font-medium leading-relaxed italic">
                    "{partner.notes}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-6 border-t border-white/[0.03]">
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Primary Contact</span>
                      <span className="text-[13px] font-semibold text-tier-1">{partner.contact}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Last Contact</span>
                      <span className="text-[13px] font-semibold text-tier-1">{partner.lastContact}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="size-10 rounded-xl border border-white/[0.04] text-tier-3 hover:text-accent hover:bg-accent/5">
                      <MessageSquare className="size-4.5" />
                    </Button>
                    <Button className="h-10 px-6 rounded-xl bg-white/[0.03] border border-white/[0.08] text-tier-2 hover:bg-white/[0.06] text-[11px] font-bold uppercase tracking-wider">
                      Intel Report <ChevronRight className="size-3.5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }: any) {
  return (
    <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-white/[0.03] group hover:border-accent/20 transition-all">
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-tier-4">{label}</span>
        <span className="text-2xl font-bold text-tier-1 tracking-tight">{value}</span>
      </div>
      <Icon className="size-5 text-tier-4 group-hover:text-accent transition-colors" />
    </div>
  );
}
