import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BedDouble, AlertCircle, Activity, Clock, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { NotificationItem } from '@/components/dashboard/NotificationItem';
import { BedStatusCard } from '@/components/dashboard/BedStatusCard';
import { patients as allPatients, icuBeds as allBeds, notifications as allNotifications, nurseAssignments, nurseTasks } from '@/data/mockData';
import { getAuth } from '@/hooks/use-auth';

export default function NurseDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const auth = getAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const assignedBedNumbers = useMemo(() => {
    const email = auth?.email || 'nurse@hospital.com';
    return nurseAssignments[email] || [];
  }, [auth]);

  const icuBeds = useMemo(() => allBeds.filter((b) => assignedBedNumbers.includes(b.bedNumber)), [assignedBedNumbers]);
  const patients = useMemo(
    () => allPatients.filter((p) => assignedBedNumbers.includes(p.bedNumber)),
    [assignedBedNumbers]
  );
  const notifications = useMemo(
    () => allNotifications.filter((n) => !n.patientId || patients.some((p) => p.id === n.patientId)),
    [patients]
  );

  const tasks = useMemo(
    () => nurseTasks.filter((task) => assignedBedNumbers.includes(task.bedNumber)),
    [assignedBedNumbers]
  );

  const stats = {
    totalPatients: patients.length,
    normalPatients: patients.filter((p) => p.status === 'normal').length,
    warningPatients: patients.filter((p) => p.status === 'warning').length,
    criticalPatients: patients.filter((p) => p.status === 'critical').length,
    occupiedBeds: icuBeds.filter((b) => b.isOccupied).length,
    availableBeds: icuBeds.filter((b) => !b.isOccupied).length,
  };

  const criticalPatients = patients.filter((p) => p.status === 'critical');
  const recentNotifications = notifications.slice(0, 4);

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nurse Dashboard</h1>
            <p className="text-muted-foreground mt-1">Assigned beds and patients</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-sm">
            <Clock className="h-5 w-5 text-primary" />
            <div className="text-right">
              <p className="text-sm font-medium text-foreground font-mono">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Patients" value={stats.totalPatients} subtitle="Assigned to you" icon={Users} variant="primary" />
          <StatCard title="Normal Status" value={stats.normalPatients} subtitle="Stable condition" icon={Activity} variant="success" />
          <StatCard title="Warning Status" value={stats.warningPatients} subtitle="Requires attention" icon={TrendingUp} variant="warning" />
          <StatCard title="Critical Status" value={stats.criticalPatients} subtitle="Immediate care needed" icon={AlertCircle} variant="critical" />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Critical Patients */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-card p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-status-critical" />
                  Critical Patients (Assigned)
                </h2>
                <button onClick={() => navigate('/nurse/patients')} className="text-sm text-primary hover:underline">
                  View assigned patients
                </button>
              </div>

              {criticalPatients.length > 0 ? (
                <div className="space-y-3">
                  {criticalPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="flex items-center justify-between rounded-lg border border-status-critical/20 bg-status-critical-bg/30 p-4 cursor-pointer transition-all hover:shadow-md hover:bg-status-critical-bg/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-critical/10 text-status-critical font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.bedNumber} • {patient.diagnosis}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status="critical" showPulse />
                        <p className="mt-1 text-xs text-muted-foreground">SpO₂: {patient.vitals.spo2}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Activity className="h-12 w-12 text-status-normal mb-3" />
                  <p className="text-sm font-medium text-foreground">All assigned patients stable</p>
                  <p className="text-xs text-muted-foreground">No critical alerts at this time</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="space-y-6">
            <div className="rounded-xl bg-card p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Alerts</h2>
                <button onClick={() => navigate('/nurse/notifications')} className="text-sm text-primary hover:underline">
                  View assigned alerts
                </button>
              </div>
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => notification.patientId && navigate(`/patients/${notification.patientId}`)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Shift Tasks</h2>
                <span className="text-xs text-muted-foreground">{tasks.length} assigned</span>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const patient = patients.find((p) => p.id === task.patientId);
                  return (
                    <div key={task.id} className="rounded-lg border p-3 bg-muted/40">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.bedNumber}
                            {patient ? ` • ${patient.name}` : ''}
                          </p>
                        </div>
                        <span
                          className={
                            task.priority === 'high'
                              ? 'text-xs font-semibold text-status-critical'
                              : task.priority === 'medium'
                              ? 'text-xs font-semibold text-status-warning'
                              : 'text-xs font-semibold text-muted-foreground'
                          }
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Due in {task.dueInMinutes} min</span>
                        {task.notes && <span className="line-clamp-1">{task.notes}</span>}
                      </div>
                    </div>
                  );
                })}

                {tasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">No tasks for your assigned beds.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bed Availability */}
        <div className="mt-8">
          <div className="rounded-xl bg-card p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-primary" />
                  Assigned ICU Bed Status
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{stats.occupiedBeds} occupied • {stats.availableBeds} available</p>
              </div>
              <button onClick={() => navigate('/nurse/beds')} className="text-sm text-primary hover:underline">Manage assigned beds</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {icuBeds.slice(0, 12).map((bed) => {
                const patient = patients.find((p) => p.id === bed.patientId);
                return <BedStatusCard key={bed.id} bed={bed} patientName={patient?.name} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
