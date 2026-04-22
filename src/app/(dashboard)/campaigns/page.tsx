
"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Megaphone,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCollection, useMemoFirebase, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const performanceData = [
  { name: 'W1', reach: 120000 },
  { name: 'W2', reach: 250000 },
  { name: 'W3', reach: 380000 },
  { name: 'W4', reach: 450000 },
];

export default function CampaignEnginePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const firestore = getFirestore();
  const { user } = useUser();
  const campaignsRef = useMemoFirebase(() => collection(firestore, 'campaigns'), [firestore]);
  const { data: campaigns, isLoading } = useCollection(campaignsRef);

  const filteredCampaigns = (campaigns || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBudget = filteredCampaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalReach = filteredCampaigns.reduce((acc, c) => acc + (c.reach || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-white/[0.03]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
              <Megaphone className="size-5.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold tracking-tight text-tier-1">Campaign Engine</h1>
              <span className="text-[10px] font-bold text-tier-4 uppercase tracking-[0.25em] mt-1">Growth Marketing Velocity</span>
            </div>
          </div>
          <p className="text-tier-2 text-[14px] font-medium leading-relaxed max-w-xl">
            Execute marketing initiatives, track creator outreach, and manage seasonal pushes across all growth channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-tier-3 group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives..." 
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] rounded-xl text-[13px] font-medium placeholder:text-tier-3 text-tier-1 focus-visible:ring-primary/20 transition-all" 
            />
          </div>
          <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
            <Plus className="size-4 mr-2" /> Launch Campaign
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 premium-panel p-8 rounded-3xl flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-tier-4">Aggregated Reach Performance</h3>
              <span className="text-[14px] text-tier-2 font-medium">Monthly trajectory across all active initiatives</span>
            </div>
            <TrendingUp className="size-4 text-emerald-500" />
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                <Area type="monotone" dataKey="reach" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          <StatBox label="Active Budget" value={`$${(totalBudget / 1000).toFixed(1)}k`} trend="+12%" icon={Target} />
          <StatBox label="Total Reach" value={`${(totalReach / 1000000).toFixed(1)}M`} trend="+5.4%" icon={Users} />
          <StatBox label="Avg ROAS" value="4.2x" trend="+0.8x" icon={TrendingUp} />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-tier-4">Active Registry</h2>
          <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider text-tier-3 hover:text-primary">
            <Filter className="size-3.5 mr-2" /> Filter Registry
          </Button>
        </div>

        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="h-48 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-tier-4 text-[11px] font-bold uppercase tracking-widest">
            No Active Campaigns
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="premium-panel p-6 rounded-2xl flex flex-col gap-6 group hover:border-primary/40 transition-all cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-tier-1 group-hover:text-primary transition-colors leading-tight">
                      {campaign.name}
                    </h3>
                    <Badge variant="outline" className="w-fit bg-white/[0.03] border-white/[0.08] text-[9px] font-bold uppercase tracking-wider text-tier-3">
                      {campaign.type}
                    </Badge>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                    campaign.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    {campaign.status}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-tier-4">
                    <span>Budget Allocation</span>
                    <span className="text-tier-2">${(campaign.spend/1000).toFixed(1)}k / ${(campaign.budget/1000).toFixed(1)}k</span>
                  </div>
                  <Progress value={(campaign.spend / campaign.budget) * 100} className="h-1.5 bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.03]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Reach</span>
                    <span className="text-[14px] font-semibold text-tier-1">{(campaign.reach/1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Conversions</span>
                    <span className="text-[14px] font-semibold text-tier-1">{campaign.conversions}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-tier-3" />
                    <span className="text-[11px] font-medium text-tier-3">{campaign.startDate}</span>
                  </div>
                  <ArrowUpRight className="size-4 text-tier-4 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, trend, icon: Icon }: any) {
  return (
    <div className="premium-panel p-5 rounded-2xl flex items-center gap-5 group hover:border-primary/20 transition-all">
      <div className="size-11 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-tier-3 group-hover:text-primary group-hover:bg-primary/5 transition-all">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-tier-4">{label}</span>
        <div className="flex items-baseline gap-2.5 mt-1">
          <span className="text-xl font-bold text-tier-1">{value}</span>
          <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
        </div>
      </div>
    </div>
  );
}
