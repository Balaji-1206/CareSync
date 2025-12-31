// Mock data for Admin Dashboard

// System Overview Stats
export const systemStats = {
  totalBeds: 48,
  occupiedBeds: 32,
  freeBeds: 16,
  maintenanceBeds: 2,
  totalPatients: 32,
  activeAlerts: 7,
  criticalAlerts: 2,
  warningAlerts: 5,
  occupancyPercentage: 66.7,
};

// System Health
export const systemHealth = {
  apiStatus: 'Connected',
  deviceConnectivity: 94.5,
  lastSyncTimestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 mins ago
  activeSensors: 142,
  totalSensors: 150,
  offlineSensors: 8,
  dataLatency: 1.2, // seconds
};

// Ward Information
export const wards = [
  { id: 'CICU', name: 'Cardiac ICU', totalBeds: 16, occupied: 12, free: 4, maintenance: 0 },
  { id: 'SICU', name: 'Surgical ICU', totalBeds: 16, occupied: 10, free: 5, maintenance: 1 },
  { id: 'RICU', name: 'Respiratory ICU', totalBeds: 16, occupied: 10, free: 5, maintenance: 1 },
];

// ICU Bed Details
export const icuBeds = [
  { bedId: 'CICU-001', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1001', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'CICU-002', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1002', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'CICU-003', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1003', deviceStatus: 'Online', lastUpdate: '3 mins ago' },
  { bedId: 'CICU-004', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1004', deviceStatus: 'Offline', lastUpdate: '15 mins ago' },
  { bedId: 'CICU-005', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1005', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'CICU-006', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1006', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'CICU-007', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1007', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'CICU-008', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1008', deviceStatus: 'Online', lastUpdate: '4 mins ago' },
  { bedId: 'CICU-009', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1009', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'CICU-010', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1010', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'CICU-011', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1011', deviceStatus: 'Online', lastUpdate: '3 mins ago' },
  { bedId: 'CICU-012', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Occupied', patientId: 'P-1012', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'CICU-013', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '5 mins ago' },
  { bedId: 'CICU-014', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '10 mins ago' },
  { bedId: 'CICU-015', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '8 mins ago' },
  { bedId: 'CICU-016', ward: 'CICU', wardName: 'Cardiac ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '12 mins ago' },
  
  { bedId: 'SICU-001', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2001', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'SICU-002', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2002', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'SICU-003', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2003', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'SICU-004', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2004', deviceStatus: 'Online', lastUpdate: '3 mins ago' },
  { bedId: 'SICU-005', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2005', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'SICU-006', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2006', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'SICU-007', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2007', deviceStatus: 'Offline', lastUpdate: '22 mins ago' },
  { bedId: 'SICU-008', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2008', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'SICU-009', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2009', deviceStatus: 'Online', lastUpdate: '4 mins ago' },
  { bedId: 'SICU-010', ward: 'SICU', wardName: 'Surgical ICU', status: 'Occupied', patientId: 'P-2010', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'SICU-011', ward: 'SICU', wardName: 'Surgical ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '15 mins ago' },
  { bedId: 'SICU-012', ward: 'SICU', wardName: 'Surgical ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '20 mins ago' },
  { bedId: 'SICU-013', ward: 'SICU', wardName: 'Surgical ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '8 mins ago' },
  { bedId: 'SICU-014', ward: 'SICU', wardName: 'Surgical ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '25 mins ago' },
  { bedId: 'SICU-015', ward: 'SICU', wardName: 'Surgical ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '18 mins ago' },
  { bedId: 'SICU-016', ward: 'SICU', wardName: 'Surgical ICU', status: 'Maintenance', patientId: null, deviceStatus: 'Offline', lastUpdate: '2 hours ago' },
  
  { bedId: 'RICU-001', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3001', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'RICU-002', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3002', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'RICU-003', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3003', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'RICU-004', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3004', deviceStatus: 'Online', lastUpdate: '3 mins ago' },
  { bedId: 'RICU-005', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3005', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'RICU-006', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3006', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'RICU-007', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3007', deviceStatus: 'Offline', lastUpdate: '35 mins ago' },
  { bedId: 'RICU-008', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3008', deviceStatus: 'Online', lastUpdate: '1 min ago' },
  { bedId: 'RICU-009', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3009', deviceStatus: 'Online', lastUpdate: '4 mins ago' },
  { bedId: 'RICU-010', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Occupied', patientId: 'P-3010', deviceStatus: 'Online', lastUpdate: '2 mins ago' },
  { bedId: 'RICU-011', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '30 mins ago' },
  { bedId: 'RICU-012', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '45 mins ago' },
  { bedId: 'RICU-013', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '12 mins ago' },
  { bedId: 'RICU-014', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '28 mins ago' },
  { bedId: 'RICU-015', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Free', patientId: null, deviceStatus: 'Online', lastUpdate: '16 mins ago' },
  { bedId: 'RICU-016', ward: 'RICU', wardName: 'Respiratory ICU', status: 'Maintenance', patientId: null, deviceStatus: 'Offline', lastUpdate: '4 hours ago' },
];

// Offline Sensors
export const offlineSensors = [
  { sensorId: 'SENS-CICU-004-HR', bedId: 'CICU-004', type: 'Heart Rate', offlineSince: '15 mins ago', status: 'Offline' },
  { sensorId: 'SENS-SICU-007-BP', bedId: 'SICU-007', type: 'Blood Pressure', offlineSince: '22 mins ago', status: 'Offline' },
  { sensorId: 'SENS-RICU-007-SPO2', bedId: 'RICU-007', type: 'SpO2', offlineSince: '35 mins ago', status: 'Offline' },
  { sensorId: 'SENS-SICU-016-TEMP', bedId: 'SICU-016', type: 'Temperature', offlineSince: '2 hours ago', status: 'Maintenance' },
  { sensorId: 'SENS-RICU-016-ECG', bedId: 'RICU-016', type: 'ECG', offlineSince: '4 hours ago', status: 'Maintenance' },
];

// Error Logs
export const errorLogs = [
  { timestamp: '2025-12-19T14:32:15Z', level: 'Error', message: 'Sensor SENS-CICU-004-HR connection timeout', source: 'IoT Gateway', bedId: 'CICU-004' },
  { timestamp: '2025-12-19T14:28:42Z', level: 'Warning', message: 'High data latency detected for SICU-007', source: 'Data Pipeline', bedId: 'SICU-007' },
  { timestamp: '2025-12-19T14:15:33Z', level: 'Error', message: 'SpO2 sensor offline for RICU-007', source: 'Sensor Network', bedId: 'RICU-007' },
  { timestamp: '2025-12-19T13:45:21Z', level: 'Warning', message: 'API rate limit approaching threshold', source: 'API Gateway', bedId: null },
  { timestamp: '2025-12-19T13:22:17Z', level: 'Info', message: 'Scheduled maintenance started for SICU-016', source: 'Maintenance System', bedId: 'SICU-016' },
  { timestamp: '2025-12-19T12:58:09Z', level: 'Error', message: 'Database connection pool exhausted', source: 'Database', bedId: null },
  { timestamp: '2025-12-19T12:12:44Z', level: 'Warning', message: 'Disk space usage above 80% threshold', source: 'Storage Monitor', bedId: null },
  { timestamp: '2025-12-19T11:35:52Z', level: 'Info', message: 'System backup completed successfully', source: 'Backup Service', bedId: null },
];

// Global Alerts
export const globalAlerts = [
  { id: 'ALT-001', bedId: 'CICU-002', patientId: 'P-1002', severity: 'Critical', type: 'Heart Rate', message: 'Heart rate critically high: 145 bpm', timestamp: '5 mins ago', acknowledged: false, escalated: true, assignedTo: 'Dr. Smith' },
  { id: 'ALT-002', bedId: 'RICU-003', patientId: 'P-3003', severity: 'Critical', type: 'SpO2', message: 'Oxygen saturation critically low: 86%', timestamp: '8 mins ago', acknowledged: false, escalated: true, assignedTo: 'Dr. Johnson' },
  { id: 'ALT-003', bedId: 'SICU-005', patientId: 'P-2005', severity: 'Warning', type: 'Blood Pressure', message: 'Blood pressure elevated: 165/95 mmHg', timestamp: '12 mins ago', acknowledged: true, escalated: false, assignedTo: 'Nurse Williams' },
  { id: 'ALT-004', bedId: 'CICU-008', patientId: 'P-1008', severity: 'Warning', type: 'Temperature', message: 'Temperature slightly elevated: 38.2°C', timestamp: '15 mins ago', acknowledged: true, escalated: false, assignedTo: 'Nurse Davis' },
  { id: 'ALT-005', bedId: 'RICU-006', patientId: 'P-3006', severity: 'Warning', type: 'Heart Rate', message: 'Heart rate slightly elevated: 105 bpm', timestamp: '22 mins ago', acknowledged: true, escalated: false, assignedTo: 'Nurse Brown' },
  { id: 'ALT-006', bedId: 'SICU-002', patientId: 'P-2002', severity: 'Warning', type: 'Respiratory Rate', message: 'Respiratory rate elevated: 24 bpm', timestamp: '28 mins ago', acknowledged: false, escalated: false, assignedTo: 'Nurse Martinez' },
  { id: 'ALT-007', bedId: 'CICU-011', patientId: 'P-1011', severity: 'Warning', type: 'SpO2', message: 'Oxygen saturation slightly low: 92%', timestamp: '35 mins ago', acknowledged: true, escalated: false, assignedTo: 'Nurse Garcia' },
];

// Alert Trend Data (last 7 days)
export const alertTrendData = [
  { date: 'Dec 13', critical: 3, warning: 12, total: 15 },
  { date: 'Dec 14', critical: 5, warning: 15, total: 20 },
  { date: 'Dec 15', critical: 2, warning: 10, total: 12 },
  { date: 'Dec 16', critical: 4, warning: 14, total: 18 },
  { date: 'Dec 17', critical: 1, warning: 8, total: 9 },
  { date: 'Dec 18', critical: 6, warning: 18, total: 24 },
  { date: 'Dec 19', critical: 2, warning: 5, total: 7 },
];

// Alert Response Time Stats
export const alertResponseStats = {
  averageResponseTime: 4.2, // minutes
  criticalAvgResponse: 2.1,
  warningAvgResponse: 6.3,
  acknowledgedAlerts: 142,
  unacknowledgedAlerts: 3,
  totalAlerts: 145,
};

// ICU Utilization Trend (last 30 days)
export const utilizationTrendData = [
  { date: 'Nov 20', occupancy: 62, admissions: 3, discharges: 2 },
  { date: 'Nov 22', occupancy: 65, admissions: 4, discharges: 1 },
  { date: 'Nov 24', occupancy: 68, admissions: 5, discharges: 2 },
  { date: 'Nov 26', occupancy: 64, admissions: 2, discharges: 4 },
  { date: 'Nov 28', occupancy: 70, admissions: 6, discharges: 3 },
  { date: 'Nov 30', occupancy: 72, admissions: 4, discharges: 2 },
  { date: 'Dec 02', occupancy: 69, admissions: 3, discharges: 4 },
  { date: 'Dec 04', occupancy: 66, admissions: 2, discharges: 3 },
  { date: 'Dec 06', occupancy: 71, admissions: 5, discharges: 2 },
  { date: 'Dec 08', occupancy: 75, admissions: 6, discharges: 4 },
  { date: 'Dec 10', occupancy: 73, admissions: 4, discharges: 5 },
  { date: 'Dec 12', occupancy: 68, admissions: 3, discharges: 6 },
  { date: 'Dec 14', occupancy: 65, admissions: 5, discharges: 4 },
  { date: 'Dec 16', occupancy: 70, admissions: 6, discharges: 3 },
  { date: 'Dec 18', occupancy: 67, admissions: 4, discharges: 5 },
];

// Staff Activity Analytics
export const staffActivityStats = {
  nurseAlertResponses: [
    { name: 'Nurse Williams', responses: 45, avgTime: 3.2 },
    { name: 'Nurse Davis', responses: 38, avgTime: 4.1 },
    { name: 'Nurse Brown', responses: 42, avgTime: 3.8 },
    { name: 'Nurse Martinez', responses: 35, avgTime: 5.2 },
    { name: 'Nurse Garcia', responses: 40, avgTime: 3.5 },
  ],
  doctorReviews: [
    { name: 'Dr. Smith', reviews: 28, avgTime: 8.5 },
    { name: 'Dr. Johnson', reviews: 32, avgTime: 7.2 },
    { name: 'Dr. Williams', reviews: 25, avgTime: 9.1 },
    { name: 'Dr. Brown', reviews: 30, avgTime: 8.0 },
  ],
};

// Audit Logs
export const auditLogs = [
  { timestamp: '2025-12-19T14:32:00Z', user: 'admin@caresync.com', role: 'Admin', action: 'System Configuration Changed', details: 'Updated alert threshold settings', ipAddress: '192.168.1.100' },
  { timestamp: '2025-12-19T14:15:22Z', user: 'dr.smith@caresync.com', role: 'Doctor', action: 'Alert Acknowledged', details: 'Critical alert ALT-001 acknowledged', ipAddress: '192.168.1.45' },
  { timestamp: '2025-12-19T14:08:45Z', user: 'nurse.williams@caresync.com', role: 'Nurse', action: 'Login', details: 'User logged in successfully', ipAddress: '192.168.1.78' },
  { timestamp: '2025-12-19T13:52:18Z', user: 'dr.johnson@caresync.com', role: 'Doctor', action: 'Patient Record Viewed', details: 'Viewed patient P-3003 details', ipAddress: '192.168.1.52' },
  { timestamp: '2025-12-19T13:45:33Z', user: 'admin@caresync.com', role: 'Admin', action: 'Announcement Created', details: 'Created system maintenance announcement', ipAddress: '192.168.1.100' },
  { timestamp: '2025-12-19T13:22:15Z', user: 'nurse.davis@caresync.com', role: 'Nurse', action: 'Alert Acknowledged', details: 'Warning alert ALT-004 acknowledged', ipAddress: '192.168.1.82' },
  { timestamp: '2025-12-19T13:10:44Z', user: 'dr.williams@caresync.com', role: 'Doctor', action: 'Login', details: 'User logged in successfully', ipAddress: '192.168.1.58' },
  { timestamp: '2025-12-19T12:55:29Z', user: 'admin@caresync.com', role: 'Admin', action: 'User Access Modified', details: 'Updated nurse.martinez role permissions', ipAddress: '192.168.1.100' },
  { timestamp: '2025-12-19T12:38:12Z', user: 'nurse.brown@caresync.com', role: 'Nurse', action: 'Logout', details: 'User logged out', ipAddress: '192.168.1.91' },
  { timestamp: '2025-12-19T12:15:55Z', user: 'dr.brown@caresync.com', role: 'Doctor', action: 'Alert Escalated', details: 'Escalated alert ALT-002 to on-call doctor', ipAddress: '192.168.1.63' },
];

// Announcements
export const announcements = [
  { 
    id: 'ANN-001', 
    title: 'Scheduled System Maintenance', 
    message: 'The CareSync system will undergo scheduled maintenance on Dec 20, 2025, from 2:00 AM to 4:00 AM. Limited functionality may be available during this period.', 
    type: 'Maintenance', 
    priority: 'High',
    targetAudience: 'All Users',
    createdBy: 'admin@caresync.com',
    createdAt: '2025-12-19T13:45:00Z',
    status: 'Active'
  },
  { 
    id: 'ANN-002', 
    title: 'New Alert Protocol Update', 
    message: 'Updated alert escalation protocols are now in effect. Please review the new guidelines in the documentation section.', 
    type: 'System Update', 
    priority: 'Medium',
    targetAudience: 'Doctors Only',
    createdBy: 'admin@caresync.com',
    createdAt: '2025-12-18T10:30:00Z',
    status: 'Active'
  },
  { 
    id: 'ANN-003', 
    title: 'Training Session Reminder', 
    message: 'Reminder: Mandatory training session on new monitoring equipment scheduled for Dec 22, 2025, at 10:00 AM in Conference Room A.', 
    type: 'Announcement', 
    priority: 'Medium',
    targetAudience: 'Nurses Only',
    createdBy: 'admin@caresync.com',
    createdAt: '2025-12-17T09:15:00Z',
    status: 'Active'
  },
  { 
    id: 'ANN-004', 
    title: 'Network Upgrade Completed', 
    message: 'The network infrastructure upgrade has been successfully completed. You should notice improved system performance and reduced latency.', 
    type: 'System Update', 
    priority: 'Low',
    targetAudience: 'All Users',
    createdBy: 'admin@caresync.com',
    createdAt: '2025-12-15T14:20:00Z',
    status: 'Archived'
  },
];

// Ward Occupancy Trend (24 hours)
export const wardOccupancyTrend = [
  { time: '00:00', CICU: 75, SICU: 62.5, RICU: 62.5 },
  { time: '04:00', CICU: 68.75, SICU: 56.25, RICU: 68.75 },
  { time: '08:00', CICU: 81.25, SICU: 68.75, RICU: 75 },
  { time: '12:00', CICU: 75, SICU: 62.5, RICU: 62.5 },
  { time: '16:00', CICU: 75, SICU: 62.5, RICU: 62.5 },
  { time: '20:00', CICU: 68.75, SICU: 62.5, RICU: 56.25 },
];

// Alert Severity Distribution
export const alertSeverityDistribution = [
  { name: 'Critical', value: 28, percentage: 19.3 },
  { name: 'Warning', value: 85, percentage: 58.6 },
  { name: 'Info', value: 32, percentage: 22.1 },
];
