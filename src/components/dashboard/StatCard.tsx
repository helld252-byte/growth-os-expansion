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
    <div className={cn("glass-card p-5 rounded-xl flex flex-col gap-3 relative overflow-hidden group border-white/[0.03] hover:border-primary/20", className)}>
      <div className="flex items-center justify-between relative z-10">
        <div className={cn("p-2 rounded-lg bg-white/[0.015] border border-white/[0.03] transition-colors", iconColor)}>
          <Icon className="size-4" />
        </div>
        {trend && (
          <span className={cn(
            "text-[9px] font-semibold px-2 py-0.5 rounded-full border",
            trendUp 
              ? "bg-green-500/5 text-green-500/70 border-green-500/10" 
              : "bg-red-500/5 text-red-500/70 border-red-500/10"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        <span className="text-[9px] text-muted-foreground/40 font-semibold uppercase tracking-widest mt-1">{label}</span>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-[0.01] rotate-12 transition-transform group-hover:scale-110 group-hover:opacity-[0.02] text-white">
        <Icon className="size-24" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}