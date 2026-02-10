export type PatientStatus = 'normal' | 'warning' | 'critical';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  bedNumber: string;
  status: PatientStatus;
  admissionDate: string;
  diagnosis: string;
  deviceBattery?: number; // Battery percentage (0-100)
  device?: {
    deviceId: string;
    deviceType: string;
    connectionStatus: 'online' | 'offline';
    sensors: string[];
    lastUpdate?: string;
  };
  vitals?: {
    heartRate: number;
    temperature: number;
    respirationRate: number;
    spo2: number;
    lastUpdated: string;
  };
}

export interface ICUBed {
  id: string;
  bedNumber: string;
  isOccupied: boolean;
  patientId?: string;
  ward: string;
}

export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  patientId?: string;
  patientName?: string;
  timestamp: string;
  isRead: boolean;
}

export interface NurseTask {
  id: string;
  title: string;
  bedNumber: string;
  patientId?: string;
  priority: 'low' | 'medium' | 'high';
  dueInMinutes: number;
  notes?: string;
}

export const patients: Patient[] = [
  {
    id: 'P001',
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    bedNumber: 'ICU-101',
    status: 'normal',
    admissionDate: '2024-01-10',
    diagnosis: 'Post-cardiac surgery recovery',
    deviceBattery: 85,
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    bedNumber: 'ICU-102',
    status: 'warning',
    admissionDate: '2024-01-12',
    diagnosis: 'Respiratory distress syndrome',
    deviceBattery: 45,
    vitals: {
      heartRate: 95,
      temperature: 37.8,
      respirationRate: 22,
      spo2: 93,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P003',
    name: 'Michael Chen',
    age: 58,
    gender: 'Male',
    bedNumber: 'ICU-103',
    status: 'critical',
    admissionDate: '2024-01-14',
    diagnosis: 'Acute myocardial infarction',
    deviceBattery: 92,
    vitals: {
      heartRate: 110,
      temperature: 38.5,
      respirationRate: 28,
      spo2: 88,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P004',
    name: 'Emily Davis',
    age: 72,
    gender: 'Female',
    bedNumber: 'ICU-104',
    status: 'normal',
    admissionDate: '2024-01-08',
    diagnosis: 'Post-stroke monitoring',
    deviceBattery: 68,
    vitals: {
      heartRate: 68,
      temperature: 36.5,
      respirationRate: 16,
      spo2: 97,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P005',
    name: 'Robert Wilson',
    age: 55,
    gender: 'Male',
    bedNumber: 'ICU-105',
    status: 'warning',
    admissionDate: '2024-01-13',
    diagnosis: 'Severe pneumonia',
    deviceBattery: 22,
    vitals: {
      heartRate: 88,
      temperature: 38.2,
      respirationRate: 24,
      spo2: 91,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P006',
    name: 'Lisa Anderson',
    age: 40,
    gender: 'Female',
    bedNumber: 'ICU-106',
    status: 'normal',
    admissionDate: '2024-01-11',
    diagnosis: 'Post-surgical recovery',
    deviceBattery: 95,
    vitals: {
      heartRate: 75,
      temperature: 36.9,
      respirationRate: 16,
      spo2: 99,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P007',
    name: 'James Brown',
    age: 68,
    gender: 'Male',
    bedNumber: 'ICU-107',
    status: 'critical',
    admissionDate: '2024-01-15',
    diagnosis: 'Septic shock',
    deviceBattery: 58,
    vitals: {
      heartRate: 125,
      temperature: 39.2,
      respirationRate: 30,
      spo2: 85,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P008',
    name: 'Patricia Taylor',
    age: 50,
    gender: 'Female',
    bedNumber: 'ICU-108',
    status: 'normal',
    admissionDate: '2024-01-09',
    diagnosis: 'Diabetic ketoacidosis recovery',
    deviceBattery: 78,
    vitals: {
      heartRate: 70,
      temperature: 36.7,
      respirationRate: 16,
      spo2: 96,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P009',
    name: 'Olivia Martin',
    age: 61,
    gender: 'Female',
    bedNumber: 'ICU-109',
    status: 'warning',
    admissionDate: '2024-01-15',
    diagnosis: 'COPD Exacerbation',
    deviceBattery: 18,
    vitals: {
      heartRate: 102,
      temperature: 37.9,
      respirationRate: 26,
      spo2: 90,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: 'P010',
    name: 'Daniel Park',
    age: 47,
    gender: 'Male',
    bedNumber: 'ICU-110',
    status: 'normal',
    admissionDate: '2024-01-16',
    diagnosis: 'Post-operative monitoring',
    deviceBattery: 100,
    vitals: {
      heartRate: 76,
      temperature: 36.6,
      respirationRate: 16,
      spo2: 99,
      lastUpdated: new Date().toISOString(),
    },
  },
];

export const icuBeds: ICUBed[] = [
  { id: 'B001', bedNumber: 'ICU-101', isOccupied: true, patientId: 'P001', ward: 'Cardiac ICU' },
  { id: 'B002', bedNumber: 'ICU-102', isOccupied: true, patientId: 'P002', ward: 'Respiratory ICU' },
  { id: 'B003', bedNumber: 'ICU-103', isOccupied: true, patientId: 'P003', ward: 'Cardiac ICU' },
  { id: 'B004', bedNumber: 'ICU-104', isOccupied: true, patientId: 'P004', ward: 'Neuro ICU' },
  { id: 'B005', bedNumber: 'ICU-105', isOccupied: true, patientId: 'P005', ward: 'General ICU' },
  { id: 'B006', bedNumber: 'ICU-106', isOccupied: true, patientId: 'P006', ward: 'Surgical ICU' },
  { id: 'B007', bedNumber: 'ICU-107', isOccupied: true, patientId: 'P007', ward: 'General ICU' },
  { id: 'B008', bedNumber: 'ICU-108', isOccupied: true, patientId: 'P008', ward: 'Medical ICU' },
  { id: 'B009', bedNumber: 'ICU-109', isOccupied: true, patientId: 'P009', ward: 'General ICU' },
  { id: 'B010', bedNumber: 'ICU-110', isOccupied: true, patientId: 'P010', ward: 'Cardiac ICU' },
  { id: 'B011', bedNumber: 'ICU-111', isOccupied: false, ward: 'Surgical ICU' },
  { id: 'B012', bedNumber: 'ICU-112', isOccupied: false, ward: 'Neuro ICU' },
];

const PATIENTS_STORAGE_KEY = 'caresync.patients.v1';
const BEDS_STORAGE_KEY = 'caresync.beds.v1';

const readStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getPatients = (): Patient[] => {
  const stored = readStorage<Patient[]>(PATIENTS_STORAGE_KEY, []);
  const merged = new Map<string, Patient>();
  patients.forEach((patient) => merged.set(patient.id, patient));
  stored.forEach((patient) => merged.set(patient.id, patient));
  return Array.from(merged.values());
};

export const addPatient = (patient: Patient) => {
  const stored = readStorage<Patient[]>(PATIENTS_STORAGE_KEY, []);
  const next = [...stored.filter((p) => p.id !== patient.id), patient];
  writeStorage(PATIENTS_STORAGE_KEY, next);
  return patient;
};

export const getIcuBeds = (): ICUBed[] => {
  const stored = readStorage<ICUBed[]>(BEDS_STORAGE_KEY, []);
  return stored.length > 0 ? stored : icuBeds;
};

export const setIcuBeds = (beds: ICUBed[]) => {
  writeStorage(BEDS_STORAGE_KEY, beds);
};

export const upsertBed = (bed: ICUBed) => {
  const beds = getIcuBeds();
  const index = beds.findIndex((b) => b.bedNumber === bed.bedNumber);
  const next = index >= 0
    ? beds.map((b) => (b.bedNumber === bed.bedNumber ? { ...b, ...bed } : b))
    : [...beds, bed];
  setIcuBeds(next);
  return next;
};

export const notifications: Notification[] = [
  {
    id: 'N001',
    type: 'critical',
    message: 'SpO₂ dropped below 88%',
    patientId: 'P003',
    patientName: 'Michael Chen',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: 'N002',
    type: 'critical',
    message: 'Respiration rate elevated above normal',
    patientId: 'P007',
    patientName: 'James Brown',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: 'N003',
    type: 'warning',
    message: 'Heart rate elevated above normal',
    patientId: 'P002',
    patientName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    isRead: true,
  },
  {
    id: 'N004',
    type: 'warning',
    message: 'Temperature rising - fever detected',
    patientId: 'P005',
    patientName: 'Robert Wilson',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    isRead: true,
  },
  {
    id: 'N005',
    type: 'info',
    message: 'Vitals stabilized after treatment',
    patientId: 'P004',
    patientName: 'Emily Davis',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    isRead: true,
  },
];

// Nurse assignment mapping and profiles for role-based views
export const nurseAssignments: Record<string, string[]> = {
  'nurse@hospital.com': ['ICU-101', 'ICU-104', 'ICU-107'],
  'nurse1@hospital.com': ['ICU-102', 'ICU-105', 'ICU-109', 'ICU-110'],
};

export const nurseProfiles: {
  email: string;
  name: string;
  phone: string;
  department: string;
  shift: string;
  supervisor: string;
}[] = [
  {
    email: 'nurse@hospital.com',
    name: 'Alexis Carter, RN',
    phone: '+1 (555) 214-8877',
    department: 'Cardiac ICU',
    shift: 'Day (7a - 7p)',
    supervisor: 'Dr. John Smith',
  },
  {
    email: 'nurse1@hospital.com',
    name: 'Priya Nair, RN',
    phone: '+1 (555) 330-1221',
    department: 'Respiratory ICU',
    shift: 'Night (7p - 7a)',
    supervisor: 'Dr. Sarah Lee',
  },
];

export const nurseTasks: NurseTask[] = [
  {
    id: 'T001',
    title: 'Recheck vitals and SpO₂ probe',
    bedNumber: 'ICU-101',
    patientId: 'P001',
    priority: 'high',
    dueInMinutes: 10,
    notes: 'Probe reading intermittently low; verify placement.',
  },
  {
    id: 'T002',
    title: 'Administer scheduled antibiotics',
    bedNumber: 'ICU-104',
    patientId: 'P004',
    priority: 'medium',
    dueInMinutes: 30,
    notes: 'Confirm no allergy; log administration time.',
  },
  {
    id: 'T003',
    title: 'Turn patient and document skin check',
    bedNumber: 'ICU-107',
    patientId: 'P007',
    priority: 'high',
    dueInMinutes: 45,
    notes: 'Use two-person assist; check sacrum and heels.',
  },
  {
    id: 'T004',
    title: 'Update handoff notes for next shift',
    bedNumber: 'ICU-105',
    priority: 'low',
    dueInMinutes: 90,
    notes: 'Summarize response to respiratory therapy.',
  },
];

// Generate ECG data points
export const generateECGData = (points: number = 100): { time: number; value: number }[] => {
  const data = [];
  for (let i = 0; i < points; i++) {
    const t = i / 10;
    // Simulate ECG waveform
    let value = 0;
    const cycle = t % 1;
    
    if (cycle < 0.1) {
      value = Math.sin(cycle * 31.4) * 0.1; // P wave
    } else if (cycle >= 0.15 && cycle < 0.2) {
      value = -0.1; // Q
    } else if (cycle >= 0.2 && cycle < 0.25) {
      value = 1; // R peak
    } else if (cycle >= 0.25 && cycle < 0.3) {
      value = -0.2; // S
    } else if (cycle >= 0.35 && cycle < 0.5) {
      value = Math.sin((cycle - 0.35) * 20.9) * 0.15; // T wave
    } else {
      value = 0;
    }
    
    data.push({ time: i, value: value + (Math.random() - 0.5) * 0.02 });
  }
  return data;
};

// Generate vital history data
export const generateVitalHistory = (hours: number = 24): {
  heartRate: { time: string; value: number }[];
  temperature: { time: string; value: number }[];
  spo2: { time: string; value: number }[];
  respirationRate: { time: string; value: number }[];
} => {
  const now = new Date();
  const data = {
    heartRate: [] as { time: string; value: number }[],
    temperature: [] as { time: string; value: number }[],
    spo2: [] as { time: string; value: number }[],
    respirationRate: [] as { time: string; value: number }[],
  };

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    data.heartRate.push({
      time: timeStr,
      value: 70 + Math.floor(Math.random() * 20) - 10,
    });
    
    data.temperature.push({
      time: timeStr,
      value: 36.5 + Math.random() * 1.5,
    });
    
    data.spo2.push({
      time: timeStr,
      value: 95 + Math.floor(Math.random() * 5),
    });
    
    data.respirationRate.push({
      time: timeStr,
      value: 16 + Math.floor(Math.random() * 10),
    });
  }

  return data;
};
