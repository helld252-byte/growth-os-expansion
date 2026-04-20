"use client";

import { 
  AlertCircle, 
  Ban, 
  Clock, 
  Star, 
  Trophy, 
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Calendar,
  User,
  ArrowRight,
  Sparkles
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
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-headline font-extrabold tracking-tight mb-2">Command Center</h1>
        <p className="text-muted-foreground text-lg">Mission Control for Growth Operations</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Needs Attention" 
          value={3} 
          icon={AlertCircle} 
          iconColor="text-amber-500"
          trend="+2 since yesterday"
        />
        <StatCard 
          label="Blocked Opportunities" 
          value={blocked.length} 
          icon={Ban} 
          iconColor="text-red-500" 
        />
        <StatCard 
          label="High Priority" 
          value={highPriority.length} 
          icon={Star} 
          iconColor="text-primary" 
          trendUp={true}
          trend="85% Fit Score"
        />
        <StatCard 
          label="New Wins" 
          value={1} 
          icon={Trophy} 
          iconColor="text-accent" 
          trend="This Month"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Feed: High Priority Opportunities */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold flex items-center gap-2">
              <Star className="size-5 text-primary fill-primary" />
              Strategic Priorities
            </h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-bold" asChild>
              <Link href="/channels">View All Channels <ArrowUpRight className="ml-1 size-4" /></Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {highPriority.map((p) => (
              <div key={p.id} className="glass-card group hover:bg-card/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center font-headline font-bold text-primary group-hover:scale-110 transition-transform">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="size-3" /> {p.owner}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> {p.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end md:items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Stage</span>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 font-bold">
                      {p.currentStage}
                    </Badge>
                  </div>
                  
                  <div className="hidden md:flex flex-col items-start w-48">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Next Step</span>
                    <p className="text-xs font-medium truncate w-full">{p.nextStep}</p>
                  </div>

                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <MoreVertical className="size-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="flex flex-col gap-8">
          {/* Overdue Tasks */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <Clock className="size-5 text-red-500" />
                Overdue
              </h2>
              <Badge variant="destructive" className="font-bold">{overdueTasks.length}</Badge>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden border border-red-500/20">
              {overdueTasks.map((t, i) => (
                <div key={t.id} className={cn(
                  "p-4 flex flex-col gap-2 hover:bg-red-500/5 transition-colors cursor-pointer group",
                  i !== overdueTasks.length - 1 && "border-b border-white/5"
                )}>
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-sm group-hover:text-red-400 transition-colors">{t.title}</span>
                    <Badge variant="outline" className="text-[10px] text-red-500 border-red-500/30 font-bold">Overdue</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {t.dueDate}</span>
                    <span className="flex items-center gap-1"><User className="size-3" /> {t.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Wins */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-headline font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              Recent Wins
            </h2>
            <div className="glass-card p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Trophy className="size-5 text-accent" />
                </div>
                <h3 className="font-bold">Amazon Europe Live</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                First order received within 2 weeks of approval. Fit score verified at 9/10. Scaling operations.
              </p>
              <Button size="sm" className="w-full bg-accent hover:bg-accent/80 text-white font-bold gap-2">
                View Case Study <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
