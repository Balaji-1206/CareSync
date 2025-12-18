import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Filter, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NotificationItem } from '@/components/dashboard/NotificationItem';
import { Button } from '@/components/ui/button';
import { notifications as allNotifications, type Notification, patients as allPatients, nurseAssignments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { getAuth } from '@/hooks/use-auth';

type NotificationFilter = 'all' | 'unread' | 'critical' | 'warning' | 'info';

export default function NurseNotifications() {
  const navigate = useNavigate();
  const auth = getAuth();
  const assignedBedNumbers = useMemo(() => nurseAssignments[auth?.email || 'nurse@hospital.com'] || [], [auth]);
  const assignedPatients = useMemo(() => allPatients.filter((p) => assignedBedNumbers.includes(p.bedNumber)).map((p) => p.id), [assignedBedNumbers]);

  const initialNotifications = useMemo(
    () => allNotifications.filter((n) => !n.patientId || assignedPatients.includes(n.patientId)),
    [assignedPatients]
  );

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filterOptions: { value: NotificationFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'critical', label: 'Critical' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
  ];

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Assigned Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-wrap rounded-lg border bg-card p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  filter === option.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {option.label}
                {option.value === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="rounded-xl bg-card shadow-md overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="p-4">
                  <NotificationItem
                    notification={notification}
                    onClick={() => {
                      if (notification.patientId) {
                        navigate(`/patients/${notification.patientId}`);
                      }
                      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)));
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">You're all caught up for assigned patients!</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
