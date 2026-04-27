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
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { useCollection, useMemoFirebase, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

const performanceData = [
  { name: 'W1', reach: 120000 },
  { name: 'W2', reach: 250000 },
  { name: 'W3', reach: 380000 },
  { name: 'W4', reach: 450000 },
];

export default function CampaignEnginePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const firestore = getFirestore();
  const campaignsRef = useMemoFirebase(() => collection(firestore, 'campaigns'), [firestore]);
  const { data: campaigns, isLoading } = useCollection(campaignsRef);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "Awareness",
    status: "Active",
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleLaunchCampaign = () => {
    if (!user || !newCampaign.name) return;

    const docData = {
      ...newCampaign,
      budget: Number(newCampaign.budget),
      spend: 0,
      reach: 0,
      conversions: 0,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(campaignsRef, docData);
    setIsAddOpen(false);
    setNewCampaign({
      name: "",
      type: "Awareness",
      status: "Active",
      budget: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    
    toast({
      title: "Initiative Launched",
      description: `"${docData.name}" has been synchronized with the Campaign Engine.`,
    });
  };

  const filteredCampaigns = (campaigns || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBudget = filteredCampaigns.reduce((acc, c) => acc + (Number(c.budget) || 0), 0);
  const totalReach = filteredCampaigns.reduce((acc, c) => acc + (Number(c.reach) || 0), 0);

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
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
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                <Plus className="size-4 mr-2" /> Launch Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/[0.1] rounded-2xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight text-tier-1">New Marketing Initiative</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest text-tier-3">Campaign Name</Label>
                  <Input 
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="e.g. Q4 Peak Season Push" 
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Type</Label>
                    <Select value={newCampaign.type} onValueChange={(v) => setNewCampaign({...newCampaign, type: v})}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-xl border-white/[0.1]">
                        <SelectItem value="Paid Ads">Paid Ads</SelectItem>
                        <SelectItem value="Creator Outreach">Creator Outreach</SelectItem>
                        <SelectItem value="Awareness">Awareness</SelectItem>
                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                        <SelectItem value="Promotion">Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Budget ($)</Label>
                    <Input 
                      type="number"
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign({...newCampaign, budget: Number(e.target.value)})}
                      className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-tier-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">Start Date</Label>
                    <DatePicker 
                      value={newCampaign.startDate}
                      onChange={(v) => setNewCampaign({...newCampaign, startDate: v})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest text-tier-3">End Date</Label>
                    <DatePicker 
                      value={newCampaign.endDate}
                      onChange={(v) => setNewCampaign({...newCampaign, endDate: v})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleLaunchCampaign}
                  disabled={!newCampaign.name}
                  className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-widest"
                >
                  Deploy Initiative
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                    <span className="text-tier-2">${((campaign.spend || 0)/1000).toFixed(1)}k / ${((campaign.budget || 0)/1000).toFixed(1)}k</span>
                  </div>
                  <Progress value={campaign.budget > 0 ? ((campaign.spend || 0) / campaign.budget) * 100 : 0} className="h-1.5 bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.03]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Reach</span>
                    <span className="text-[14px] font-semibold text-tier-1">{((campaign.reach || 0)/1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tier-4">Conversions</span>
                    <span className="text-[14px] font-semibold text-tier-1">{campaign.conversions || 0}</span>
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
