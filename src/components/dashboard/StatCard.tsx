import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  iconColor?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, className, iconColor }: StatCardProps) {
  return (
    <div className={cn("glass-card p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group", className)}>
      <div className="flex items-center justify-between relative z-10">
        <div className={cn("p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] transition-colors group-hover:border-primary/30", iconColor)}>
          <Icon className="size-3.5" />
        </div>
        {trend && (
          <span className={cn(
            "text-[8px] font-bold px-1.5 py-0.5 rounded-full border",
            trendUp 
              ? "bg-green-500/10 text-green-400 border-green-500/20" 
              : "bg-red-500/10 text-red-400 border-red-500/20"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-xl font-headline font-bold tracking-tight">{value}</span>
        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="absolute -right-3 -bottom-3 opacity-[0.015] rotate-12 transition-transform group-hover:scale-110 group-hover:opacity-[0.03]">
        <Icon className="size-20" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
