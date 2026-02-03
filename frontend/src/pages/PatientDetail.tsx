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
import { patients, generateVitalHistory } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vitalHistory, setVitalHistory] = useState(generateVitalHistory(24));
  const deviceInfo = {
    deviceId: `DEV-${id ?? 'UNKNOWN'}`,
    deviceType: 'ICU Vital Monitoring Unit',
    microcontroller: 'ESP32',
    connectionStatus: Math.random() > 0.2 ? 'online' as const : 'offline' as const,
    sensors: ['HR', 'SpO₂', 'Temp', 'RR'],
    lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 5 * 60 * 1000)),
  };

  const patient = patients.find((p) => p.id === id);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setVitalHistory(generateVitalHistory(24));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
            value={patient.vitals.heartRate}
            unit="BPM"
            icon={Heart}
            color="heart"
            status={getVitalStatus('heartRate', patient.vitals.heartRate)}
            lastUpdated={patient.vitals.lastUpdated}
            animate
          />
          <VitalCard
            title="Temperature"
            value={patient.vitals.temperature.toFixed(1)}
            unit="°C"
            icon={Thermometer}
            color="temp"
            status={getVitalStatus('temperature', patient.vitals.temperature)}
            lastUpdated={patient.vitals.lastUpdated}
          />
          <VitalCard
            title="Respiration Rate"
            value={patient.vitals.respirationRate}
            unit="breaths/min"
            icon={Wind}
            color="rr"
            status={getVitalStatus('respirationRate', patient.vitals.respirationRate)}
            lastUpdated={patient.vitals.lastUpdated}
          />
          <VitalCard
            title="Oxygen Saturation"
            value={patient.vitals.spo2}
            unit="%"
            icon={Wind}
            color="spo2"
            status={getVitalStatus('spo2', patient.vitals.spo2)}
            lastUpdated={patient.vitals.lastUpdated}
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
                  {new Date(patient.vitals.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
