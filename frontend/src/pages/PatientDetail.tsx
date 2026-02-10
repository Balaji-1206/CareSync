import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Thermometer,
  Gauge,
  Wind,
  Activity,
  Calendar,
  User,
  BedDouble,
  Clock,
  Cpu,
  Wifi,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { VitalCard } from '@/components/dashboard/VitalCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { ECGChart } from '@/components/charts/ECGChart';
import { VitalChart } from '@/components/charts/VitalChart';
import { getPatients, generateVitalHistory } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vitalHistory, setVitalHistory] = useState(generateVitalHistory(24));
  const [liveVitals, setLiveVitals] = useState<
    | {
        heartRate: number;
        temperature: number;
        respirationRate: number;
        spo2: number;
        lastUpdated: string;
      }
    | null
  >(null);
  const patients = getPatients();
  const patient = patients.find((p) => p.id === id);

  // Fetch real vitals history for P001
  useEffect(() => {
    if (id !== 'P001') {
      // For non-P001 patients, use mock history
      const interval = setInterval(() => {
        setVitalHistory(generateVitalHistory(24));
      }, 30000);
      return () => clearInterval(interval);
    }

    // For P001, fetch real vitals from history endpoint
    const fetchRealVitalsHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/vitals/history/P001?limit=100`);
        const result = await response.json();

        if (result.success && result.data && Array.isArray(result.data)) {
          // Transform backend data to chart format
          const chartData = result.data
            .reverse() // Reverse to get chronological order
            .map((entry: any) => {
              const timestamp = new Date(entry.recordedAt);
              const timeStr = timestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              });

              return {
                time: timeStr,
                hr: entry.vitals?.HR?.value || 0,
                spo2: entry.vitals?.SpO2?.value || 0,
                temp: entry.vitals?.Temp?.value || 0,
                rr: entry.vitals?.RR?.value || 0
              };
            });

          setVitalHistory({
            heartRate: chartData.map(d => ({ time: d.time, value: d.hr })),
            respirationRate: chartData.map(d => ({ time: d.time, value: d.rr })),
            temperature: chartData.map(d => ({ time: d.time, value: d.temp })),
            spo2: chartData.map(d => ({ time: d.time, value: d.spo2 }))
          });
        }
      } catch (error) {
        console.error('Error fetching vitals history:', error);
      }
    };

    fetchRealVitalsHistory();

    // Refetch history every 30 seconds for updates
    const interval = setInterval(fetchRealVitalsHistory, 30000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (id !== 'P001') return;

    let isActive = true;

    const fetchVitals = async () => {
      try {
        await fetch(`${api.baseUrl}/api/vitals/external/p001`);

        const latestRes = await fetch(`${api.baseUrl}/api/vitals/latest/P001`);
        const latest = await latestRes.json();

        if (!isActive || !latest?.success || !latest?.data) return;

        setLiveVitals({
          heartRate: latest.data.HR?.value ?? 0,
          temperature: latest.data.Temp?.value ?? 0,
          respirationRate: latest.data.RR?.value ?? 0,
          spo2: latest.data.SpO2?.value ?? 0,
          lastUpdated: latest.data.HR?.time || latest.timestamp || new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to fetch external vitals', error);
      }
    };

    fetchVitals();
    const interval = setInterval(fetchVitals, 10000);
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [id]);

  if (!patient) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Patient not found</p>
            <Button onClick={() => navigate('/patients')} className="mt-4">
              Back to Patients
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const deviceInfo = {
    deviceId: patient.device?.deviceId ?? `DEV-${id ?? 'UNKNOWN'}`,
    deviceType: patient.device?.deviceType ?? 'ICU Vital Monitoring Unit',
    microcontroller: 'ESP32',
    connectionStatus: patient.device?.connectionStatus ?? (Math.random() > 0.2 ? 'online' as const : 'offline' as const),
    sensors: patient.device?.sensors ?? ['HR', 'SpO₂', 'Temp', 'RR'],
    lastUpdate: patient.device?.lastUpdate
      ? new Date(patient.device.lastUpdate)
      : new Date(Date.now() - Math.floor(Math.random() * 5 * 60 * 1000)),
  };

  const vitals = liveVitals || patient.vitals;
  const lastUpdatedLabel = vitals?.lastUpdated
    ? new Date(vitals.lastUpdated).toLocaleTimeString()
    : '—';

  const formatDuration = (ms: number) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    const parts: string[] = [];
    if (days) parts.push(`${days}d`);
    if (hours || days) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    return parts.join(' ');
  };

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case 'heartRate':
        return value < 60 || value > 100 ? (value < 50 || value > 120 ? 'critical' : 'warning') : 'normal';
      case 'temperature':
        return value < 36 || value > 37.5 ? (value < 35 || value > 38.5 ? 'critical' : 'warning') : 'normal';
      case 'spo2':
        return value < 95 ? (value < 90 ? 'critical' : 'warning') : 'normal';
      case 'respirationRate':
        return value < 12 || value > 20 ? (value < 8 || value > 30 ? 'critical' : 'warning') : 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/patients')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold ${
                  patient.status === 'normal'
                    ? 'bg-status-normal/10 text-status-normal'
                    : patient.status === 'warning'
                    ? 'bg-status-warning/10 text-status-warning'
                    : 'bg-status-critical/10 text-status-critical'
                }`}
              >
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
                  <StatusBadge status={patient.status} size="lg" showPulse={patient.status === 'critical'} />
                </div>
                <p className="text-muted-foreground mt-1">{patient.diagnosis}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-xl bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono font-medium text-primary">{patient.id}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <BedDouble className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{patient.bedNumber}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{patient.age} yrs, {patient.gender}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Device */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monitoring Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {/* Compact info row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono font-medium">{deviceInfo.deviceId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{deviceInfo.deviceType}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium ${deviceInfo.connectionStatus === 'online' ? 'text-status-normal' : 'text-status-critical'}`}>
                    {deviceInfo.connectionStatus === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Sensors left, Last update right */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {deviceInfo.sensors.map((s) => (
                    <Badge key={s} variant="outline" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vitals Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <VitalCard
            title="Heart Rate"
            value={vitals?.heartRate ?? '—'}
            unit="BPM"
            icon={Heart}
            color="heart"
            status={vitals ? getVitalStatus('heartRate', vitals.heartRate) : 'normal'}
            lastUpdated={vitals?.lastUpdated}
            animate
          />
          <VitalCard
            title="Temperature"
            value={vitals ? vitals.temperature.toFixed(1) : '—'}
            unit="°C"
            icon={Thermometer}
            color="temp"
            status={vitals ? getVitalStatus('temperature', vitals.temperature) : 'normal'}
            lastUpdated={vitals?.lastUpdated}
          />
          <VitalCard
            title="Respiration Rate"
            value={vitals?.respirationRate ?? '—'}
            unit="breaths/min"
            icon={Wind}
            color="rr"
            status={vitals ? getVitalStatus('respirationRate', vitals.respirationRate) : 'normal'}
            lastUpdated={vitals?.lastUpdated}
          />
          <VitalCard
            title="Oxygen Saturation"
            value={vitals?.spo2 ?? '—'}
            unit="%"
            icon={Wind}
            color="spo2"
            status={vitals ? getVitalStatus('spo2', vitals.spo2) : 'normal'}
            lastUpdated={vitals?.lastUpdated}
          />
        </div>

        {/* ECG Chart */}
        <div className="mb-8">
          <ECGChart isLive />
        </div>

        {/* Vital History Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <VitalChart
            title="Heart Rate Trend"
            data={vitalHistory.heartRate}
            color="hsl(350, 80%, 55%)"
            unit="BPM"
          />
          <VitalChart
            title="Respiration Rate Trend"
            data={vitalHistory.respirationRate}
            color="hsl(120, 100%, 40%)"
            unit="breaths/min"
          />
          <VitalChart
            title="Temperature Trend"
            data={vitalHistory.temperature.map((d) => ({
              ...d,
              value: parseFloat(d.value.toFixed(1)),
            }))}
            color="hsl(25, 95%, 55%)"
            unit="°C"
          />
          <VitalChart
            title="SpO₂ Trend"
            data={vitalHistory.spo2}
            color="hsl(175, 70%, 45%)"
            unit="%"
          />
        </div>

        {/* Patient Info */}
        <div className="mt-8 rounded-xl bg-card p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground mb-4">Patient Information</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Calendar className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Admission Date</p>
                <p className="text-sm font-medium">{new Date(patient.admissionDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Activity className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diagnosis</p>
                <p className="text-sm font-medium">{patient.diagnosis}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <BedDouble className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ICU Bed</p>
                <p className="text-sm font-medium">{patient.bedNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Update</p>
                <p className="text-sm font-medium">
                  {lastUpdatedLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
