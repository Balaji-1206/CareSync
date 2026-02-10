import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BedDouble,
  AlertCircle,
  Activity,
  Clock,
  TrendingUp,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Bell,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { NotificationItem } from '@/components/dashboard/NotificationItem';
import { BedStatusCard } from '@/components/dashboard/BedStatusCard';
import {
  getPatients,
  getIcuBeds,
  notifications as allNotifications,
  nurseAssignments,
  nurseTasks,
} from '@/data/mockData';
import { getAuth } from '@/hooks/use-auth';

export default function NurseDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const auth = getAuth();
  const allPatients = getPatients();
  const allBeds = getIcuBeds();

  /* ---------------- BATTERY HELPERS ---------------- */

  const getBatteryIcon = (battery: number) => {
    if (battery >= 80) return BatteryFull;
    if (battery >= 40) return BatteryMedium;
    if (battery >= 20) return BatteryLow;
    return Battery;
  };

  const getBatteryColor = (battery: number) => {
    if (battery >= 60) return 'text-emerald-600';
    if (battery >= 30) return 'text-amber-500';
    return 'text-rose-600';
  };

  /* ---------------- CLOCK ---------------- */

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------- DATA ---------------- */

  const assignedBedNumbers = useMemo(() => {
    const email = auth?.email || 'nurse@hospital.com';
    return nurseAssignments[email] || [];
  }, [auth]);

  const icuBeds = useMemo(
    () => allBeds.filter((b) => assignedBedNumbers.includes(b.bedNumber)),
    [allBeds, assignedBedNumbers]
  );

  const patients = useMemo(
    () => allPatients.filter((p) => assignedBedNumbers.includes(p.bedNumber)),
    [allPatients, assignedBedNumbers]
  );

  const notifications = useMemo(
    () =>
      allNotifications.filter(
        (n) => !n.patientId || patients.some((p) => p.id === n.patientId)
      ),
    [patients]
  );

  const tasks = useMemo(
    () => nurseTasks.filter((t) => assignedBedNumbers.includes(t.bedNumber)),
    [assignedBedNumbers]
  );

  /* ---------------- STATS ---------------- */

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
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-muted/30">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Nurse Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Assigned beds and patients overview
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card/80 backdrop-blur px-4 py-3 border border-border/60 shadow-sm">
            <Clock className="h-5 w-5 text-primary" />
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold font-mono">
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

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Patients" value={stats.totalPatients} subtitle="Assigned to you" icon={Users} variant="primary" />
          <StatCard title="Normal Status" value={stats.normalPatients} subtitle="Stable condition" icon={Activity} variant="success" />
          <StatCard title="Warning Status" value={stats.warningPatients} subtitle="Requires attention" icon={TrendingUp} variant="warning" />
          <StatCard title="Critical Status" value={stats.criticalPatients} subtitle="Immediate care needed" icon={AlertCircle} variant="critical" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-5">
            {/* CRITICAL PATIENTS */}
            <div className="rounded-2xl bg-card/90 backdrop-blur border border-status-critical/20 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-status-critical" />
                  Critical Patients
                </h2>
                <button
                  onClick={() => navigate('/nurse/patients')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="p-4 space-y-2">
                {criticalPatients.length > 0 ? (
                  criticalPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="
                        flex items-center justify-between
                        rounded-xl border border-status-critical/20
                        bg-status-critical-bg/20
                        px-4 py-3
                        cursor-pointer
                        transition
                        hover:bg-status-critical-bg/30
                        hover:shadow-sm
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-status-critical/10 flex items-center justify-center font-bold text-status-critical">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.bedNumber} • {patient.diagnosis}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {typeof patient.deviceBattery === 'number' && (
                          <div className="flex items-center gap-2">
                            {(() => {
                              const BatteryIcon = getBatteryIcon(patient.deviceBattery!);
                              return <BatteryIcon className={getBatteryColor(patient.deviceBattery!)} />;
                            })()}
                            <span className={`text-xs font-semibold ${getBatteryColor(patient.deviceBattery!)}`}>
                              {patient.deviceBattery}%
                            </span>
                          </div>
                        )}
                        <div className="text-right">
                          <StatusBadge status="critical" showPulse />
                          <p className="text-xs text-muted-foreground mt-1">
                            SpO₂: {patient.vitals?.spo2 ?? '—'}{patient.vitals ? '%' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="h-12 w-12 mx-auto text-status-normal mb-3" />
                    <p className="font-medium">All assigned patients stable</p>
                    <p className="text-xs text-muted-foreground">
                      No critical alerts at this time
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BED STATUS */}
            <div className="rounded-2xl bg-card/90 backdrop-blur border border-border/60 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-primary" />
                    Assigned ICU Bed Status
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {stats.occupiedBeds} occupied • {stats.availableBeds} available
                  </p>
                </div>
                <button
                  onClick={() => navigate('/nurse/beds')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Manage
                </button>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                {icuBeds.slice(0, 12).map((bed) => {
                  const patient = patients.find((p) => p.id === bed.patientId);
                  return (
                    <BedStatusCard
                      key={bed.id}
                      bed={bed}
                      patientName={patient?.name}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-5">
            {/* ALERTS */}
            <div className="rounded-2xl bg-card/90 backdrop-blur border border-border/60 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Alerts
                </h2>
                <button
                  onClick={() => navigate('/nurse/notifications')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="p-4 space-y-3 max-h-[320px] overflow-auto">
                {recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() =>
                      notification.patientId &&
                      navigate(`/patients/${notification.patientId}`)
                    }
                  />
                ))}
              </div>
            </div>

            {/* TASKS */}
            <div className="rounded-2xl bg-card/90 backdrop-blur border border-border/60 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <h2 className="text-lg font-semibold">Shift Tasks</h2>
                <span className="text-xs text-muted-foreground">
                  {tasks.length} assigned
                </span>
              </div>

              <div className="p-4 space-y-3">
                {tasks.map((task) => {
                  const patient = patients.find((p) => p.id === task.patientId);
                  return (
                    <div
                      key={task.id}
                      className="rounded-xl border bg-muted/40 px-4 py-3 transition hover:bg-muted/60"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.bedNumber}
                            {patient ? ` • ${patient.name}` : ''}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border">
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Due in {task.dueInMinutes} min</span>
                        {task.notes && <span className="line-clamp-1">{task.notes}</span>}
                      </div>
                    </div>
                  );
                })}

                {tasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    No tasks for your assigned beds.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
