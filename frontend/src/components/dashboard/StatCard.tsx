import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'critical';
}

const variantStyles = {
  default: {
    card: 'bg-card',
    icon: 'bg-secondary text-secondary-foreground',
    value: 'text-foreground',
  },
  primary: {
    card: 'bg-card border-l-4 border-l-primary',
    icon: 'bg-primary/10 text-primary',
    value: 'text-primary',
  },
  success: {
    card: 'bg-card border-l-4 border-l-status-normal',
    icon: 'bg-status-normal-bg text-status-normal',
    value: 'text-status-normal',
  },
  warning: {
    card: 'bg-card border-l-4 border-l-status-warning',
    icon: 'bg-status-warning-bg text-status-warning',
    value: 'text-status-warning',
  },
  critical: {
    card: 'bg-card border-l-4 border-l-status-critical',
    icon: 'bg-status-critical-bg text-status-critical',
    value: 'text-status-critical',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'rounded-xl p-5 shadow-md transition-all duration-300 hover:shadow-lg animate-fade-in',
        styles.card
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn('mt-2 text-3xl font-bold tracking-tight', styles.value)}>{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-status-normal' : 'text-status-critical'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last hour</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-xl p-3', styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
