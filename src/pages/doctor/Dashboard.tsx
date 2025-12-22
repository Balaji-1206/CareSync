import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BedDouble,
  AlertCircle,
  Activity,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { NotificationItem } from '@/components/dashboard/NotificationItem';
import { BedStatusCard } from '@/components/dashboard/BedStatusCard';
import { patients, icuBeds, notifications } from '@/data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
              ICU Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time monitoring of all ICU patients
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
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            subtitle="Currently in ICU"
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Normal Status"
            value={stats.normalPatients}
            subtitle="Stable condition"
            icon={Activity}
            variant="success"
          />
          <StatCard
            title="Warning Status"
            value={stats.warningPatients}
            subtitle="Requires attention"
            icon={TrendingUp}
            variant="warning"
          />
          <StatCard
            title="Critical Status"
            value={stats.criticalPatients}
            subtitle="Immediate care needed"
            icon={AlertCircle}
            variant="critical"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* CRITICAL PATIENTS */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card/90 backdrop-blur border border-status-critical/20 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-status-critical" />
                  Critical Patients
                </h2>
                <button
                  onClick={() => navigate('/patients')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="p-4 space-y-3">
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
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-status-critical/10 text-status-critical font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.bedNumber} • {patient.diagnosis}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status="critical" showPulse />
                        <p className="mt-1 text-xs text-muted-foreground">
                          SpO₂: {patient.vitals.spo2}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="h-12 w-12 mx-auto text-status-normal mb-3" />
                    <p className="font-medium">All patients stable</p>
                    <p className="text-xs text-muted-foreground">
                      No critical alerts at this time
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ALERTS */}
          <div>
            <div className="rounded-2xl bg-card/90 backdrop-blur border border-border/60 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <h2 className="text-lg font-semibold">Recent Alerts</h2>
                <button
                  onClick={() => navigate('/notifications')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="p-4 space-y-3">
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
          </div>
        </div>

        {/* BED STATUS */}
        <div className="rounded-2xl bg-card/90 backdrop-blur border border-border/60 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" />
                ICU Bed Status
              </h2>
              <p className="text-sm text-muted-foreground">
                {stats.occupiedBeds} occupied • {stats.availableBeds} available
              </p>
            </div>
            <button
              onClick={() => navigate('/beds')}
              className="text-sm font-medium text-primary hover:underline"
            >
              Manage beds
            </button>
          </div>

          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
    </MainLayout>
  );
}
