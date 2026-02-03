import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Monitor,
  AlertCircle,
  Lock,
  Activity,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  Server,
  Wifi,
  AlertTriangle,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Hospital {
  name: string;
  totalICUBeds: number;
  wards: Ward[];
}

interface Ward {
  id: string;
  name: string;
  bedCount: number;
  identifier: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'nurse';
  department: string;
  status: 'active' | 'inactive';
}

export default function AdminSettings() {
  // Hospital configuration
  const [hospitalConfig, setHospitalConfig] = useState<Hospital>({
    name: 'General Hospital ICU',
    totalICUBeds: 20,
    wards: [
      { id: 'W001', name: 'Cardiac ICU', bedCount: 6, identifier: 'CICU' },
      { id: 'W002', name: 'Respiratory ICU', bedCount: 7, identifier: 'RICU' },
      { id: 'W003', name: 'Surgical ICU', bedCount: 7, identifier: 'SICU' },
    ],
  });

  const [isEditingHospital, setIsEditingHospital] = useState(false);
  const [newWard, setNewWard] = useState({ name: '', bedCount: 0, identifier: '' });
  const [showAddWard, setShowAddWard] = useState(false);

  // User management
  const [users, setUsers] = useState<User[]>([
    {
      id: 'D001',
      name: 'Dr. Sarah Mitchell',
      email: 'doctor@hospital.com',
      role: 'doctor',
      department: 'Critical Care',
      status: 'active',
    },
    {
      id: 'N001',
      name: 'Alexis Carter',
      email: 'nurse@hospital.com',
      role: 'nurse',
      department: 'Cardiac ICU',
      status: 'active',
    },
    {
      id: 'N002',
      name: 'Priya Nair',
      email: 'nurse1@hospital.com',
      role: 'nurse',
      department: 'Respiratory ICU',
      status: 'active',
    },
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'nurse' as 'doctor' | 'nurse', department: '' });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // System monitoring settings
  const [systemSettings, setSystemSettings] = useState({
    dataRefreshInterval: 30,
    sensorSyncFrequency: 15,
    enableAutoBackup: true,
    backupInterval: 3600,
    maxStorageDays: 90,
  });

  // Alert policy management
  const [alertPolicies, setAlertPolicies] = useState({
    globalHeartRateAlert: true,
    globalSpO2Alert: true,
    globalRRAlert: true,
    globalTempAlert: true,
    autoEscalateThreshold: 5,
    emergencyCallTimeout: 2,
    notifyAllStaffCritical: true,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    enableSessionLogging: true,
    maxFailedLoginAttempts: 5,
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState({ current: '', new: '', confirm: '' });

  // System status
  const [systemStatus] = useState({
    apiConnection: true,
    apiLatency: 45,
    deviceConnectivity: 95,
    activeSensors: 58,
    totalSensors: 60,
    lastSync: '2 minutes ago',
    systemUptime: '45 days 12 hours',
  });

  const handleAddWard = () => {
    if (newWard.name && newWard.bedCount > 0) {
      const ward: Ward = {
        id: `W${(hospitalConfig.wards.length + 1).toString().padStart(3, '0')}`,
        name: newWard.name,
        bedCount: newWard.bedCount,
        identifier: newWard.identifier || newWard.name.substring(0, 3).toUpperCase(),
      };
      setHospitalConfig({
        ...hospitalConfig,
        wards: [...hospitalConfig.wards, ward],
        totalICUBeds: hospitalConfig.totalICUBeds + newWard.bedCount,
      });
      setNewWard({ name: '', bedCount: 0, identifier: '' });
      setShowAddWard(false);
    }
  };

  const handleDeleteWard = (id: string) => {
    const ward = hospitalConfig.wards.find((w) => w.id === id);
    if (ward) {
      setHospitalConfig({
        ...hospitalConfig,
        wards: hospitalConfig.wards.filter((w) => w.id !== id),
        totalICUBeds: hospitalConfig.totalICUBeds - ward.bedCount,
      });
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: `${newUser.role === 'doctor' ? 'D' : 'N'}${(users.length + 1).toString().padStart(3, '0')}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: 'active',
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'nurse', department: '' });
      setShowAddUser(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all admin settings to default?')) {
      setSystemSettings({
        dataRefreshInterval: 30,
        sensorSyncFrequency: 15,
        enableAutoBackup: true,
        backupInterval: 3600,
        maxStorageDays: 90,
      });
      setAlertPolicies({
        globalHeartRateAlert: true,
        globalSpO2Alert: true,
        globalRRAlert: true,
        globalTempAlert: true,
        autoEscalateThreshold: 5,
        emergencyCallTimeout: 2,
        notifyAllStaffCritical: true,
      });
      setSecuritySettings({
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireTwoFactor: false,
        enableSessionLogging: true,
        maxFailedLoginAttempts: 5,
      });
    }
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-primary" />
            Admin Settings
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">
            System-level configuration and management for the ICU monitoring platform
          </p>
        </div>

        {/* System Status Panel */}
        <Card className="p-4 lg:p-6 mb-6 border-primary/20 bg-card/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            System Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">API Connection</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={systemStatus.apiConnection ? 'default' : 'destructive'}>
                  {systemStatus.apiConnection ? 'Connected' : 'Disconnected'}
                </Badge>
                <span className="text-xs text-muted-foreground">{systemStatus.apiLatency}ms</span>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Device Connectivity</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{systemStatus.deviceConnectivity}%</Badge>
                <span className="text-xs text-muted-foreground">
                  {systemStatus.activeSensors}/{systemStatus.totalSensors} sensors
                </span>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Last Sync</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">{systemStatus.lastSync}</span>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">System Uptime</span>
              </div>
              <p className="text-sm font-mono">{systemStatus.systemUptime}</p>
            </div>
          </div>
        </Card>

        {/* Tabs for Settings */}
        <Tabs defaultValue="hospital" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="hospital" className="text-xs lg:text-sm">
              Hospital
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs lg:text-sm">
              Users
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs lg:text-sm">
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs lg:text-sm">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs lg:text-sm">
              Security
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Hospital Configuration */}
          <TabsContent value="hospital">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Hospital Configuration</h2>
                </div>
                <Button
                  size="sm"
                  variant={isEditingHospital ? 'default' : 'outline'}
                  onClick={() => setIsEditingHospital(!isEditingHospital)}
                >
                  {isEditingHospital ? 'Done' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Hospital Name</Label>
                  {isEditingHospital ? (
                    <Input
                      value={hospitalConfig.name}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, name: e.target.value })}
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm text-foreground font-medium">{hospitalConfig.name}</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Total ICU Beds</Label>
                    {isEditingHospital ? (
                      <Input
                        type="number"
                        value={hospitalConfig.totalICUBeds}
                        onChange={(e) =>
                          setHospitalConfig({
                            ...hospitalConfig,
                            totalICUBeds: Number(e.target.value),
                          })
                        }
                        className="w-24 text-sm"
                      />
                    ) : (
                      <Badge variant="secondary">{hospitalConfig.totalICUBeds} beds</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">ICU Wards</Label>
                    {isEditingHospital && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddWard(!showAddWard)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Ward
                      </Button>
                    )}
                  </div>

                  {showAddWard && (
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                      <Input
                        placeholder="Ward name"
                        value={newWard.name}
                        onChange={(e) => setNewWard({ ...newWard, name: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Bed count"
                        value={newWard.bedCount}
                        onChange={(e) => setNewWard({ ...newWard, bedCount: Number(e.target.value) })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Ward identifier (e.g., CICU)"
                        value={newWard.identifier}
                        onChange={(e) => setNewWard({ ...newWard, identifier: e.target.value })}
                        className="text-sm uppercase"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddWard}>
                          Add Ward
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddWard(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {hospitalConfig.wards.map((ward) => (
                      <div
                        key={ward.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{ward.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {ward.bedCount} beds • ID: {ward.identifier}
                          </p>
                        </div>
                        {isEditingHospital && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteWard(ward.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 2: User Management */}
          <TabsContent value="users">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">User Management</h2>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowAddUser(!showAddUser)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add User
                </Button>
              </div>

              {showAddUser && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg mb-4">
                  <Input
                    placeholder="Full name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="text-sm"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="text-sm"
                  />
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value as 'doctor' | 'nurse' })
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddUser}>
                      Add User
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddUser(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {users.map((user) => (
                  <Collapsible key={user.id} defaultOpen={editingUserId === user.id}>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email} • {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '👩‍⚕️ Nurse'} • {user.department}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                        >
                          {user.status}
                        </Badge>
                        <CollapsibleTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent className="pt-2 pl-3 border-l-2 border-muted ml-4 space-y-2">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>ID: <span className="font-mono">{user.id}</span></p>
                        <p>Role: <span className="font-semibold">{user.role.toUpperCase()}</span></p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Total Users: {users.length}</p>
                <p>Doctors: {users.filter((u) => u.role === 'doctor').length} • Nurses: {users.filter((u) => u.role === 'nurse').length}</p>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 3: System Monitoring */}
          <TabsContent value="monitoring">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">System Monitoring Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval" className="text-sm font-medium">
                    Data Refresh Interval (seconds)
                  </Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="5"
                    max="300"
                    value={systemSettings.dataRefreshInterval}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        dataRefreshInterval: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    How often patient data is refreshed in the UI
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Sensor Data Sync Frequency: <span className="font-mono">{systemSettings.sensorSyncFrequency}s</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Devices sync with servers every {systemSettings.sensorSyncFrequency} seconds (read-only)
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup" className="text-sm font-medium">
                      Enable Automatic Backup
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically backup patient data at regular intervals
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={systemSettings.enableAutoBackup}
                    onCheckedChange={(checked) =>
                      setSystemSettings({ ...systemSettings, enableAutoBackup: checked })
                    }
                  />
                </div>

                {systemSettings.enableAutoBackup && (
                  <div className="space-y-2 ml-4 p-3 bg-muted rounded-lg">
                    <Label htmlFor="backupInterval" className="text-xs font-medium">
                      Backup Interval (seconds)
                    </Label>
                    <Input
                      id="backupInterval"
                      type="number"
                      min="300"
                      value={systemSettings.backupInterval}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          backupInterval: Number(e.target.value),
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="maxStorageDays" className="text-sm font-medium">
                    Maximum Storage Duration (days)
                  </Label>
                  <Input
                    id="maxStorageDays"
                    type="number"
                    min="7"
                    max="365"
                    value={systemSettings.maxStorageDays}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        maxStorageDays: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Older data will be archived automatically
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 4: Alert Policies */}
          <TabsContent value="alerts">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Global Alert Policy Management</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Enable Global Vital Alerts</p>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="hrAlert" className="text-xs">
                      Heart Rate Alerts
                    </Label>
                    <Switch
                      id="hrAlert"
                      checked={alertPolicies.globalHeartRateAlert}
                      onCheckedChange={(checked) =>
                        setAlertPolicies({ ...alertPolicies, globalHeartRateAlert: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="spo2Alert" className="text-xs">
                      SpO₂ Alerts
                    </Label>
                    <Switch
                      id="spo2Alert"
                      checked={alertPolicies.globalSpO2Alert}
                      onCheckedChange={(checked) =>
                        setAlertPolicies({ ...alertPolicies, globalSpO2Alert: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="rrAlert" className="text-xs">
                      Respiration Rate Alerts
                    </Label>
                    <Switch
                      id="rrAlert"
                      checked={alertPolicies.globalRRAlert}
                      onCheckedChange={(checked) =>
                        setAlertPolicies({ ...alertPolicies, globalRRAlert: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="tempAlert" className="text-xs">
                      Temperature Alerts
                    </Label>
                    <Switch
                      id="tempAlert"
                      checked={alertPolicies.globalTempAlert}
                      onCheckedChange={(checked) =>
                        setAlertPolicies({ ...alertPolicies, globalTempAlert: checked })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="escalateThreshold" className="text-sm font-medium">
                    Auto-Escalate Alert Threshold (minutes)
                  </Label>
                  <Input
                    id="escalateThreshold"
                    type="number"
                    min="1"
                    max="60"
                    value={alertPolicies.autoEscalateThreshold}
                    onChange={(e) =>
                      setAlertPolicies({
                        ...alertPolicies,
                        autoEscalateThreshold: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    If alert is not acknowledged in {alertPolicies.autoEscalateThreshold} minutes,
                    escalate to senior staff
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="emergencyTimeout" className="text-sm font-medium">
                    Emergency Call Timeout (minutes)
                  </Label>
                  <Input
                    id="emergencyTimeout"
                    type="number"
                    min="1"
                    max="30"
                    value={alertPolicies.emergencyCallTimeout}
                    onChange={(e) =>
                      setAlertPolicies({
                        ...alertPolicies,
                        emergencyCallTimeout: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyAllStaff" className="text-sm font-medium">
                      Notify All Staff on Critical Alert
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Send critical alerts to all available staff members
                    </p>
                  </div>
                  <Switch
                    id="notifyAllStaff"
                    checked={alertPolicies.notifyAllStaffCritical}
                    onCheckedChange={(checked) =>
                      setAlertPolicies({
                        ...alertPolicies,
                        notifyAllStaffCritical: checked,
                      })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 5: Security Settings */}
          <TabsContent value="security">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Security & System Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-sm font-medium">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="480"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Users will be automatically logged out after {securitySettings.sessionTimeout} minutes
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength" className="text-sm font-medium">
                    Minimum Password Length
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="32"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordMinLength: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactor" className="text-sm font-medium">
                      Require Two-Factor Authentication
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Force all users to enable 2FA for account security
                    </p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={securitySettings.requireTwoFactor}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireTwoFactor: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="sessionLogging" className="text-sm font-medium">
                      Enable Session Logging
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Log all login/logout activities for audit purposes
                    </p>
                  </div>
                  <Switch
                    id="sessionLogging"
                    checked={securitySettings.enableSessionLogging}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        enableSessionLogging: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="failedAttempts" className="text-sm font-medium">
                    Max Failed Login Attempts
                  </Label>
                  <Input
                    id="failedAttempts"
                    type="number"
                    min="3"
                    max="20"
                    value={securitySettings.maxFailedLoginAttempts}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        maxFailedLoginAttempts: Number(e.target.value),
                      })
                    }
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Accounts will be locked after {securitySettings.maxFailedLoginAttempts} failed attempts
                  </p>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Admin Password
                </Button>

                {showChangePassword && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={newPassword.current}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, current: e.target.value })
                      }
                      className="text-sm"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword.new}
                      onChange={(e) => setNewPassword({ ...newPassword, new: e.target.value })}
                      className="text-sm"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={newPassword.confirm}
                      onChange={(e) =>
                        setNewPassword({ ...newPassword, confirm: e.target.value })
                      }
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => alert('Password changed successfully!')}>
                        Change Password
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowChangePassword(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-6">
          <Button className="flex-1" onClick={() => alert('All settings saved successfully!')}>
            Save All Settings
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleResetSettings}>
            Reset to Default
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <div className="flex gap-3">
            <div className="text-red-600 dark:text-red-400 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Admin-Only Settings
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Changes made here affect the entire system and all users. Ensure careful review before
                saving critical settings like alert policies and security configurations. This is a
                frontend-only interface; all settings will sync with backend upon connection.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
