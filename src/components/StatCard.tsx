import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status: 'good' | 'warning' | 'danger';
  subtitle?: string;
}

const statusStyles = {
  good: { icon: 'bg-success/10 text-success', border: 'border-l-success' },
  warning: { icon: 'bg-warning/10 text-warning', border: 'border-l-warning' },
  danger: { icon: 'bg-destructive/10 text-destructive', border: 'border-l-destructive' },
};

export function StatCard({ title, value, unit, icon: Icon, status, subtitle }: StatCardProps) {
  const s = statusStyles[status];
  return (
    <div className={cn("bg-card rounded-lg border p-4 border-l-4 animate-slide-up", s.border)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("p-2 rounded-lg", s.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
