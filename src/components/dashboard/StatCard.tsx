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
    <div className={cn("glass-card p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:bg-card/80 transition-all cursor-default", className)}>
      <div className="flex items-center justify-between">
        <div className={cn("p-2.5 rounded-xl bg-muted/50 transition-colors group-hover:bg-primary/10", iconColor)}>
          <Icon className="size-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            trendUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-headline font-bold">{value}</span>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110">
        <Icon className="size-20" />
      </div>
    </div>
  );
}