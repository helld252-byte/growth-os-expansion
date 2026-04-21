"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  Target, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Download
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { platforms } from "@/lib/mock-data";

const funnelData = [
  { name: 'Research', value: 12, fill: 'hsl(var(--primary))' },
  { name: 'Applied', value: 8, fill: 'hsl(var(--chart-2))' },
  { name: 'In Review', value: 5, fill: 'hsl(var(--chart-3))' },
  { name: 'Approved', value: 3, fill: 'hsl(var(--chart-4))' },
  { name: 'Live', value: 2, fill: 'hsl(var(--accent))' },
];

const growthTrend = [
  { month: 'Oct', apps: 4, live: 1 },
  { month: 'Nov', apps: 6, live: 1 },
  { month: 'Dec', apps: 8, live: 2 },
  { month: 'Jan', apps: 12, live: 3 },
  { month: 'Feb', apps: 15, live: 4 },
  { month: 'Mar', apps: 20, live: 6 },
];

export default function ReportsPage() {
  const liveCount = platforms.filter(p => p.currentStage === "Live").length;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight mb-2">Growth Performance</h1>
          <p className="text-muted-foreground text-lg">Executive visibility and conversion analytics</p>
        </div>
        <Button variant="outline" className="border-white/5 bg-muted/30 font-bold gap-2 h-11 px-6 rounded-xl">
          <Download className="size-5" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Total Active" value={platforms.length} icon={Layers} iconColor="text-primary" />
        <StatCard label="Live Channels" value={liveCount} icon={CheckCircle2} iconColor="text-green-500" />
        <StatCard label="In Pipeline" value={platforms.length - liveCount} icon={Target} iconColor="text-accent" />
        <StatCard label="Blocked" value={1} icon={AlertCircle} iconColor="text-red-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Pipeline Conversion Chart */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold">Pipeline Distribution</h3>
            <Button variant="ghost" size="icon"><MoreVertical className="size-5" /></Button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 8, 8, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Momentum Area Chart */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold">Growth Momentum</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 text-primary font-bold">Applications</Badge>
              <Badge variant="outline" className="border-accent/20 text-accent font-bold">Live</Badge>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrend}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="live" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorLive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
