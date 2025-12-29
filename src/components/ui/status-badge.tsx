import { cn } from '@/lib/utils';
import type { PatientStatus } from '@/data/mockData';

interface StatusBadgeProps {
  status: PatientStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

const statusConfig = {
  normal: {
    label: 'Normal',
    className: 'status-normal',
  },
  warning: {
    label: 'Warning',
    className: 'status-warning',
  },
  critical: {
    label: 'Critical',
    className: 'status-critical',
  },
};

const sizeConfig = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export function StatusBadge({ status, size = 'md', showPulse = false }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'status-badge',
        config.className,
        sizeConfig[size],
        status === 'critical' && showPulse && 'blink-critical'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'normal' && 'bg-status-normal',
          status === 'warning' && 'bg-status-warning',
          status === 'critical' && 'bg-status-critical'
        )}
      />
      {config.label}
    </span>
  );
}
