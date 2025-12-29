import { AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const typeConfig = {
  critical: {
    icon: AlertCircle,
    className: 'border-l-status-critical bg-status-critical-bg/50',
    iconClass: 'text-status-critical',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-l-status-warning bg-status-warning-bg/50',
    iconClass: 'text-status-warning',
  },
  info: {
    icon: Info,
    className: 'border-l-primary bg-primary/5',
    iconClass: 'text-primary',
  },
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-lg border-l-4 p-4 transition-all duration-200 cursor-pointer hover:shadow-md',
        config.className,
        !notification.isRead && 'ring-1 ring-primary/20'
      )}
    >
      <div className={cn('mt-0.5', config.iconClass)}>
        <Icon className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium', !notification.isRead && 'text-foreground')}>
            {notification.message}
          </p>
          {!notification.isRead && (
            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
        
        {notification.patientName && (
          <p className="text-sm text-muted-foreground mt-0.5">
            Patient: {notification.patientName}
          </p>
        )}
        
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}
