import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Online' | 'Offline' | 'Occupied' | 'Free' | 'Maintenance' | 'Connected' | 'Disconnected' | 'Active' | 'Archived' | 'Critical' | 'Warning' | 'Info' | 'Normal';
  className?: string;
}

export function StatusIndicator({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    Online: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Online' },
    Offline: { color: 'bg-red-500/10 text-red-600 border-red-500/20', label: 'Offline' },
    Occupied: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Occupied' },
    Free: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Free' },
    Maintenance: { color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', label: 'Maintenance' },
    Connected: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Connected' },
    Disconnected: { color: 'bg-red-500/10 text-red-600 border-red-500/20', label: 'Disconnected' },
    Active: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Active' },
    Archived: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', label: 'Archived' },
    Critical: { color: 'bg-red-500/10 text-red-600 border-red-500/20', label: 'Critical' },
    Warning: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', label: 'Warning' },
    Info: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Info' },
    Normal: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Normal' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium border',
        config.color,
        className
      )}
    >
      <span className="relative flex h-2 w-2 mr-1.5">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          status === 'Online' || status === 'Connected' || status === 'Active' ? "bg-green-400" :
          status === 'Critical' ? "bg-red-400" :
          status === 'Warning' ? "bg-yellow-400" : ""
        )} />
        <span className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          status === 'Online' || status === 'Connected' || status === 'Active' || status === 'Free' || status === 'Normal' ? "bg-green-500" :
          status === 'Offline' || status === 'Disconnected' || status === 'Critical' ? "bg-red-500" :
          status === 'Warning' || status === 'Maintenance' ? "bg-yellow-500" :
          status === 'Occupied' || status === 'Info' ? "bg-blue-500" : "bg-gray-500"
        )} />
      </span>
      {config.label}
    </Badge>
  );
}
