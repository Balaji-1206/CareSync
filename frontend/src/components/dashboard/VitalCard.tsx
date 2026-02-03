import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  color: 'heart' | 'temp' | 'rr' | 'spo2' | 'ecg';
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  animate?: boolean;
}

const colorConfig = {
  heart: {
    bg: 'bg-vital-heart/10',
    text: 'text-vital-heart',
    border: 'border-vital-heart/20',
  },
  temp: {
    bg: 'bg-vital-temp/10',
    text: 'text-vital-temp',
    border: 'border-vital-temp/20',
  },
  rr: {
    bg: 'bg-vital-rr/10',
    text: 'text-vital-rr',
    border: 'border-vital-rr/20',
  },
  spo2: {
    bg: 'bg-vital-spo2/10',
    text: 'text-vital-spo2',
    border: 'border-vital-spo2/20',
  },
  ecg: {
    bg: 'bg-vital-ecg/10',
    text: 'text-vital-ecg',
    border: 'border-vital-ecg/20',
  },
};

export function VitalCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  status,
  lastUpdated,
  animate = false,
}: VitalCardProps) {
  const config = colorConfig[color];

  return (
    <div
      className={cn(
        'vital-card border',
        config.border,
        status === 'critical' && 'shadow-critical blink-critical'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn('rounded-lg p-2', config.bg)}>
          <Icon className={cn('h-5 w-5', config.text, animate && color === 'heart' && 'animate-heartbeat')} />
        </div>
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            status === 'normal' && 'bg-status-normal',
            status === 'warning' && 'bg-status-warning animate-pulse',
            status === 'critical' && 'bg-status-critical blink-critical'
          )}
        />
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className={cn('text-3xl font-bold font-mono', config.text)}>{value}</span>
        <span className={cn('ml-1 text-sm', config.text)}>{unit}</span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      {/* Last Updated */}
      <p className="mt-2 text-xs text-muted-foreground/60">
        Updated {new Date(lastUpdated).toLocaleTimeString()}
      </p>
    </div>
  );
}
