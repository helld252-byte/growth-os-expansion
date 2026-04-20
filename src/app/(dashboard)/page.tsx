"use client";

import { 
  AlertCircle, 
  Ban, 
  Clock, 
  Star, 
  Trophy, 
  ArrowUpRight,
  MoreVertical,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Activity,
  ChevronRight
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { platforms, tasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CommandCenter() {
  const highPriority = platforms.filter(p => p.priority === "High");
  const blocked = platforms.filter(p => p.blockers);
  const overdueTasks = tasks.filter(t => t.status === "Overdue");

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-8 animate-in fade-in duration-1000">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary flex items-center justify-center active-glow">
            <Zap className="size-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight">Mission Control</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Operational Status: Optimal</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Performance</span>
            <span className="text-sm font-headline font-bold text-accent">+12.4% vs LY</span>
          </div>
          <Button variant="outline" className="glass-card font-bold border-white/10 gap-2 h-10">
            <Activity className="size-4" /> System Logs
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 h-10 px-5 shadow-lg shadow-primary/20">
            <Sparkles className="size-4 fill-white/20" /> Strategic AI
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Metrics & Overdue (1 Col) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <StatCard 
              label="Urgent Action" 
              value={3} 
              icon={AlertCircle} 
              iconColor="text-amber-500"
              trend="+2 Today"
              trendUp={false}
            />
            <StatCard 
              label="Blocked" 
              value={blocked.length} 
              icon={Ban} 
              iconColor="text-red-500" 
            />
            <StatCard 
              label="Live Wins" 
              value={1} 
              icon={Trophy} 
              iconColor="text-accent" 
              trend="Monthly"
              trendUp={true}
            />
          </div>

          <div className="premium-panel rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="size-4 text-red-500" /> Overdue
              </h2>
              <Badge variant="destructive" className="rounded-md font-bold text-[10px]">{overdueTasks.length}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {overdueTasks.map((t) => (
                <div key={t.id} className="glass-card p-4 rounded-xl flex flex-col gap-2 group cursor-pointer border-red-500/10 hover:border-red-500/30">
                  <span className="font-bold text-xs group-hover:text-red-400 transition-colors leading-tight">{t.title}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">{t.owner.split(' ')[0]}</span>
                    <span className="text-[9px] font-bold text-red-500/80">{t.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Priority Board (2 Cols) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="premium-panel rounded-[2rem] p-8 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-headline font-bold flex items-center gap-3">
                  <Target className="size-6 text-primary" />
                  Execution Priorities
                </h2>
                <p className="text-muted-foreground text-xs mt-1 font-medium">Active high-impact growth opportunities in the pipeline</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 font-bold gap-1" asChild>
                <Link href="/channels">Full Pipeline <ChevronRight className="size-4" /></Link>
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {highPriority.map((p) => (
                <div key={p.id} className="glass-card hover:bg-white/[0.04] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-5">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5 flex items-center justify-center font-headline font-bold text-primary group-hover:scale-105 transition-all">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                        <Badge variant="outline" className="text-[9px] uppercase font-black bg-white/5 border-none text-muted-foreground py-0 tracking-tighter">{p.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                          <User className="size-3" /> {p.owner}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                          <Activity className="size-3" /> {p.fitScore}/10 Fit
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 ml-auto md:ml-0">
                    <div className="flex flex-col items-end min-w-24">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 opacity-60">Pipeline Stage</span>
                      <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold text-[10px] uppercase rounded-lg">
                        {p.currentStage}
                      </Badge>
                    </div>
                    
                    <div className="hidden lg:flex flex-col items-start w-48 border-l border-white/5 pl-6">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 opacity-60">Next Critical Step</span>
                      <p className="text-[11px] font-bold text-white/90 truncate w-full">{p.nextStep}</p>
                    </div>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                      <MoreVertical className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Activity (1 Col) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="premium-panel rounded-3xl p-6 bg-gradient-to-br from-accent/10 via-transparent to-transparent flex flex-col gap-6 border-accent/20">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <Sparkles className="size-4 fill-accent/20" /> Performance Insights
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Amazon EU Scaling</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Velocity has increased by 14% since budget reallocation. Recommendation: Invest an additional $5k in UK Sponsored Products.
                </p>
              </div>
              <div className="h-px bg-white/5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Faire Compliance</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Product upload is 80% complete. Awaiting high-res imagery for the bedroom collection to finalize.
                </p>
              </div>
            </div>
            <Button size="sm" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold rounded-xl gap-2 mt-2 accent-glow">
              Explore Analytics <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="premium-panel rounded-3xl p-6 flex flex-col gap-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</h2>
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="size-2 rounded-full bg-primary mt-1.5 ring-4 ring-primary/10" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-white">Applied to Wayfair US</span>
                    <span className="text-[10px] text-muted-foreground font-medium">2 hours ago • Sarah Chen</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
