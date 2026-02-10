import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Cpu, Stethoscope, User } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  addPatient,
  getIcuBeds,
  getPatients,
  setIcuBeds,
  type PatientStatus,
} from '@/data/mockData';

const sensorOptions = ['HR', 'SpO₂', 'Temp', 'RR', 'ECG'];

const getNextPatientId = () => {
  const patients = getPatients();
  const maxId = patients.reduce((max, patient) => {
    const match = patient.id.match(/P(\d+)/i);
    if (!match) return max;
    const value = Number(match[1]);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `P${String(maxId + 1).padStart(3, '0')}`;
};

export default function AddDevice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const beds = useMemo(() => getIcuBeds(), []);
  const availableBeds = beds.filter((bed) => !bed.isOccupied);
  const defaultPatientId = useMemo(() => getNextPatientId(), []);

  const [form, setForm] = useState({
    patientId: defaultPatientId,
    name: '',
    age: '',
    gender: 'Female',
    bedNumber: availableBeds[0]?.bedNumber || beds[0]?.bedNumber || '',
    status: 'normal' as PatientStatus,
    admissionDate: new Date().toISOString().slice(0, 10),
    diagnosis: '',
    deviceBattery: '90',
    deviceId: '',
    deviceType: 'ICU Vital Monitoring Unit',
    connectionStatus: 'online' as 'online' | 'offline',
    sensors: new Set(sensorOptions),
  });

  const toggleSensor = (sensor: string) => {
    setForm((prev) => {
      const next = new Set(prev.sensors);
      if (next.has(sensor)) next.delete(sensor);
      else next.add(sensor);
      return { ...prev, sensors: next };
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.patientId.trim() || !form.name.trim() || !form.bedNumber.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please provide patient ID, name, and bed number.',
        variant: 'destructive',
      });
      return;
    }

    if (!form.diagnosis.trim()) {
      toast({
        title: 'Diagnosis required',
        description: 'Provide a diagnosis to complete patient setup.',
        variant: 'destructive',
      });
      return;
    }

    const patientId = form.patientId.trim();
    const deviceId = form.deviceId.trim() || `DEV-${patientId}`;

    addPatient({
      id: patientId,
      name: form.name.trim(),
      age: Number(form.age) || 0,
      gender: form.gender as 'Male' | 'Female',
      bedNumber: form.bedNumber.trim(),
      status: form.status,
      admissionDate: form.admissionDate,
      diagnosis: form.diagnosis.trim(),
      deviceBattery: Number(form.deviceBattery) || undefined,
      device: {
        deviceId,
        deviceType: form.deviceType.trim(),
        connectionStatus: form.connectionStatus,
        sensors: Array.from(form.sensors),
        lastUpdate: new Date().toISOString(),
      },
    });

    const currentBeds = getIcuBeds();
    const existingBed = currentBeds.find((bed) => bed.bedNumber === form.bedNumber.trim());
    if (existingBed) {
      const updatedBeds = currentBeds.map((bed) =>
        bed.bedNumber === form.bedNumber.trim()
          ? { ...bed, isOccupied: true, patientId }
          : bed
      );
      setIcuBeds(updatedBeds);
    } else {
      const nextId = `B${String(currentBeds.length + 1).padStart(3, '0')}`;
      setIcuBeds([
        ...currentBeds,
        {
          id: nextId,
          bedNumber: form.bedNumber.trim(),
          isOccupied: true,
          patientId,
          ward: 'General ICU',
        },
      ]);
    }

    toast({
      title: 'Device added',
      description: `${form.name.trim()} is now linked to ${deviceId}.`,
    });

    navigate(`/patients/${patientId}`);
  };

  return (
    <MainLayout>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3 text-primary">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold tracking-wide uppercase">Device Onboarding</span>
              <Badge variant="secondary" className="uppercase text-[10px] tracking-wide">Step 1 of 2</Badge>
              <Badge variant="outline" className="uppercase text-[10px] tracking-wide">Draft</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-foreground">Add Device & Patient</h1>
              <p className="text-muted-foreground max-w-2xl">
                Capture device setup and patient profile in a structured flow. Once saved, the new patient card and detail view will be available across the app.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/patients')}>
              Back to Patients
            </Button>
            <div className="text-xs text-muted-foreground">Average setup time: 2-3 minutes</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border-border/60 bg-card/80">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Patient ID</p>
                <p className="text-lg font-semibold text-foreground">{form.patientId || '—'}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/80">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Assigned Bed</p>
                <p className="text-lg font-semibold text-foreground">{form.bedNumber || '—'}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/80">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Device Status</p>
                <p className="text-lg font-semibold text-foreground capitalize">{form.connectionStatus}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b bg-card/80">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  placeholder="P123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="45"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bed Number</Label>
                <Select value={form.bedNumber} onValueChange={(value) => setForm({ ...form, bedNumber: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {beds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.bedNumber}>
                        {bed.bedNumber} • {bed.ward} {bed.isOccupied ? '(Occupied)' : '(Available)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as PatientStatus })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={form.admissionDate}
                  onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  placeholder="Primary diagnosis or condition"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b bg-card/80">
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Device Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  value={form.deviceId}
                  onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
                  placeholder={`DEV-${form.patientId || 'P123'}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type</Label>
                <Input
                  id="deviceType"
                  value={form.deviceType}
                  onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <Select
                  value={form.connectionStatus}
                  onValueChange={(value) => setForm({ ...form, connectionStatus: value as 'online' | 'offline' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceBattery">Device Battery (%)</Label>
                <Input
                  id="deviceBattery"
                  type="number"
                  min={0}
                  max={100}
                  value={form.deviceBattery}
                  onChange={(e) => setForm({ ...form, deviceBattery: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Sensors</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {sensorOptions.map((sensor) => (
                    <label key={sensor} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-sm">
                      <Checkbox
                        checked={form.sensors.has(sensor)}
                        onCheckedChange={() => toggleSensor(sensor)}
                      />
                      <span className="font-medium">{sensor}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b bg-card/80">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Review & Create
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Ready to create the patient record?</p>
                <p className="text-sm text-muted-foreground">
                  This will add the patient and device to local storage and open their detail view.
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/patients')}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Create Patient
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="border-b bg-card/80">
                <CardTitle className="text-base">Live Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs uppercase text-muted-foreground">Patient</p>
                  <p className="text-base font-semibold text-foreground">
                    {form.name || 'Unnamed Patient'}
                  </p>
                  <p className="text-xs text-muted-foreground">ID: {form.patientId || '—'} • Bed: {form.bedNumber || '—'}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs uppercase text-muted-foreground">Device</p>
                  <p className="text-sm font-medium text-foreground">{form.deviceId || `DEV-${form.patientId || 'P000'}`}</p>
                  <p className="text-xs text-muted-foreground">{form.deviceType}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={form.connectionStatus === 'online' ? 'secondary' : 'destructive'}>
                      {form.connectionStatus === 'online' ? 'Online' : 'Offline'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Battery: {form.deviceBattery || '—'}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground mb-2">Sensors</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(form.sensors).length > 0 ? (
                      Array.from(form.sensors).map((sensor) => (
                        <Badge key={sensor} variant="outline">
                          {sensor}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No sensors selected</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <p className="text-sm font-semibold text-primary">Tip: Reduce setup time</p>
                <p className="text-xs text-muted-foreground">
                  Keep device IDs aligned with patient IDs (example: DEV-P123) for faster lookup and automatic linking.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
      </div>
    </MainLayout>
  );
}
