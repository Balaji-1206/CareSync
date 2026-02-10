import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Battery, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { getPatients, type PatientStatus, nurseAssignments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { getAuth } from '@/hooks/use-auth';

export default function NursePatients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');
  const auth = getAuth();
  const allPatients = getPatients();

  const getBatteryIcon = (battery: number) => {
    if (battery >= 80) return BatteryFull;
    if (battery >= 40) return BatteryMedium;
    if (battery >= 20) return BatteryLow;
    return Battery;
  };

  const getBatteryColor = (battery: number) => {
    if (battery >= 60) return 'text-green-500';
    if (battery >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const assignedBedNumbers = useMemo(() => nurseAssignments[auth?.email || 'nurse@hospital.com'] || [], [auth]);
  const patients = useMemo(
    () => allPatients.filter((p) => assignedBedNumbers.includes(p.bedNumber)),
    [allPatients, assignedBedNumbers]
  );

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.bedNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions: { value: PatientStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Patients' },
    { value: 'normal', label: 'Normal' },
    { value: 'warning', label: 'Warning' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Assigned Patients</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor patients assigned to you</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or bed number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex rounded-lg border bg-card p-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    statusFilter === option.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="rounded-xl bg-card shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age / Gender</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ICU Bed</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Device</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vitals</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="cursor-pointer transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4"><span className="text-sm font-mono font-medium text-primary">{patient.id}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold', patient.status === 'normal' && 'bg-status-normal/10 text-status-normal', patient.status === 'warning' && 'bg-status-warning/10 text-status-warning', patient.status === 'critical' && 'bg-status-critical/10 text-status-critical')}>
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.diagnosis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-foreground">{patient.age} yrs / {patient.gender}</span></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-sm font-medium">{patient.bedNumber}</span></td>
                    <td className="px-6 py-4"><StatusBadge status={patient.status} showPulse={patient.status === 'critical'} /></td>
                    <td className="px-6 py-4">
                      {patient.deviceBattery !== undefined && (() => {
                        const BatteryIcon = getBatteryIcon(patient.deviceBattery);
                        return (
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <BatteryIcon className={cn('h-6 w-6', getBatteryColor(patient.deviceBattery))} />
                              {patient.deviceBattery < 20 && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className={cn('text-xs font-semibold', getBatteryColor(patient.deviceBattery))}>
                                {patient.deviceBattery}%
                              </span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden mt-0.5">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    patient.deviceBattery >= 60 ? 'bg-green-500' :
                                    patient.deviceBattery >= 30 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  )}
                                  style={{ width: `${patient.deviceBattery}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-xs">
                        <div><span className="text-muted-foreground">HR: </span><span className="font-mono font-medium">{patient.vitals?.heartRate ?? '—'}</span></div>
                        <div><span className="text-muted-foreground">SpO₂: </span><span className="font-mono font-medium">{patient.vitals?.spo2 ?? '—'}{patient.vitals ? '%' : ''}</span></div>
                        <div><span className="text-muted-foreground">Temp: </span><span className="font-mono font-medium">{patient.vitals ? `${patient.vitals.temperature.toFixed(1)}°C` : '—'}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><ChevronRight className="h-5 w-5 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No patients found</p>
              <p className="text-xs text-muted-foreground">No assigned patients match your filters</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
