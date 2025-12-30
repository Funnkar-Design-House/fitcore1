import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'success' | 'danger';
  delay?: number;
}

const variantStyles = {
  default: 'border-border',
  primary: 'border-primary/30 hover:border-primary/50',
  warning: 'border-warning/30 hover:border-warning/50',
  success: 'border-success/30 hover:border-success/50',
  danger: 'border-destructive/30 hover:border-destructive/50',
};

const iconStyles = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary/20 text-primary',
  warning: 'bg-warning/20 text-warning',
  success: 'bg-success/20 text-success',
  danger: 'bg-destructive/20 text-destructive',
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', delay = 0 }: StatCardProps) {
  return (
    <div 
      className={`stat-card ${variantStyles[variant]} animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground animate-count">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`rounded-xl p-2 flex items-center justify-center ${iconStyles[variant]}`} style={{ minWidth: 32, minHeight: 32 }}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
