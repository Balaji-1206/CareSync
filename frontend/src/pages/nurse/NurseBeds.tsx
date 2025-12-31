import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, User, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { patients as allPatients, icuBeds as allBeds, nurseAssignments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/status-badge';
import { getAuth } from '@/hooks/use-auth';

export default function NurseBeds() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'occupied' | 'available'>('all');
  const auth = getAuth();
  const assignedBedNumbers = useMemo(() => nurseAssignments[auth?.email || 'nurse@hospital.com'] || [], [auth]);

  const icuBeds = useMemo(() => allBeds.filter((b) => assignedBedNumbers.includes(b.bedNumber)), [assignedBedNumbers]);
  const patients = useMemo(() => allPatients.filter((p) => assignedBedNumbers.includes(p.bedNumber)), [assignedBedNumbers]);

  const filteredBeds = icuBeds.filter((bed) => {
    if (filter === 'all') return true;
    if (filter === 'occupied') return bed.isOccupied;
    if (filter === 'available') return !bed.isOccupied;
    return true;
  });

  const stats = {
    total: icuBeds.length,
    occupied: icuBeds.filter((b) => b.isOccupied).length,
    available: icuBeds.filter((b) => !b.isOccupied).length,
  };

  const occupancyRate = stats.total ? Math.round((stats.occupied / stats.total) * 100) : 0;

  const filterOptions: { value: 'all' | 'occupied' | 'available'; label: string }[] = [
    { value: 'all', label: 'All Assigned Beds' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'available', label: 'Available' },
  ];

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Assigned ICU Bed Management</h1>
          <p className="text-muted-foreground mt-1">Overview of assigned ICU beds</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl bg-card p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Assigned Beds</p>
              <BedDouble className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${occupancyRate}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{occupancyRate}% occupancy</p>
          </div>

          <div className="rounded-xl bg-card border-l-4 border-l-primary p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Occupied</p>
              <User className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.occupied}</p>
            <p className="mt-2 text-xs text-muted-foreground">Patients admitted</p>
          </div>

          <div className="rounded-xl bg-card border-l-4 border-l-status-normal p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Available</p>
              <BedDouble className="h-5 w-5 text-status-normal" />
            </div>
            <p className="text-3xl font-bold text-status-normal">{stats.available}</p>
            <p className="mt-2 text-xs text-muted-foreground">Ready for admission</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex rounded-lg border bg-card p-1">
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
              </button>
            ))}
          </div>
        </div>

        {/* Bed Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBeds.map((bed) => {
            const patient = patients.find((p) => p.id === bed.patientId);
            return (
              <div
                key={bed.id}
                onClick={() => patient && navigate(`/patients/${patient.id}`)}
                className={cn(
                  'rounded-xl border p-5 transition-all duration-300 hover:shadow-lg',
                  bed.isOccupied ? 'border-primary/20 bg-card cursor-pointer hover:border-primary/40' : 'border-status-normal/20 bg-status-normal-bg/30'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', bed.isOccupied ? 'bg-primary/10' : 'bg-status-normal/10')}>
                      {bed.isOccupied ? <User className="h-6 w-6 text-primary" /> : <BedDouble className="h-6 w-6 text-status-normal" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{bed.bedNumber}</p>
                      <p className="text-xs text-muted-foreground">{bed.ward}</p>
                    </div>
                  </div>
                  <span className={cn('h-3 w-3 rounded-full', bed.isOccupied ? 'bg-primary' : 'bg-status-normal')} />
                </div>

                {bed.isOccupied && patient ? (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <StatusBadge status={patient.status} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{patient.diagnosis}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">HR: <span className="font-mono font-medium">{patient.vitals.heartRate}</span></span>
                      <span className="text-muted-foreground">SpO₂: <span className="font-mono font-medium">{patient.vitals.spo2}%</span></span>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-status-normal">Available</p>
                    <p className="text-xs text-muted-foreground">Ready for patient admission</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
