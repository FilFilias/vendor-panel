
import { cn } from "~/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  indicator?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, icon, indicator, className }: StatCardProps) {
  return (
    <div className={cn("stat-card  dark:bg-gray-800 dark:text-white", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <h3 className="text-2xl font-bold">{value}</h3>
        {indicator && <div className="text-sm">{indicator}</div>}
      </div>
    </div>
  );
}
