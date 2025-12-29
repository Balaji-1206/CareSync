import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Users, Palette, Type, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getAuth } from '@/hooks/use-auth';
import { nurseProfiles, nurseAssignments, patients } from '@/data/mockData';
import { MainLayout } from '@/components/layout/MainLayout';
import ChangePasswordSection from '@/components/ChangePasswordSection';

export default function NurseSettings() {
  const auth = getAuth();
  const nurseProfile = nurseProfiles.find((p) => p.email === auth?.email) || nurseProfiles[0];
  
  const assignedBedNumbers = nurseAssignments[auth?.email || 'nurse@hospital.com'] || [];
  const assignedPatients = patients.filter((p) => assignedBedNumbers.includes(p.bedNumber));

  // State for all settings
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: nurseProfile.name,
    nurseId: auth?.email?.split('@')[0].toUpperCase() || 'N001',
    department: nurseProfile.department,
    shift: nurseProfile.shift,
    phone: nurseProfile.phone,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    abnormalVitalsAlerts: true,
    criticalAlerts: true,
    warningAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true,
    alertTone: 'beep',
  });

  const [patientSettings, setPatientSettings] = useState({
    showNonAssignedPatients: false,
    highlightAssignedOnly: true,
  });

  const [alertPrioritySettings, setAlertPrioritySettings] = useState({
    showCriticalFirst: true,
    highlightICUEmergency: true,
    groupByPriority: true,
    autoExpandCritical: true,
  });

  const [interfaceSettings, setInterfaceSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    compactView: false,
    showTimestamps: true,
  });

  const handleProfileUpdate = () => {
    // In production, this would save to backend
    setIsEditingProfile(false);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setNotificationSettings({
        abnormalVitalsAlerts: true,
        criticalAlerts: true,
        warningAlerts: true,
        soundEnabled: true,
        vibrationEnabled: true,
        alertTone: 'beep',
      });
      setPatientSettings({
        showNonAssignedPatients: false,
        highlightAssignedOnly: true,
      });
      setAlertPrioritySettings({
        showCriticalFirst: true,
        highlightICUEmergency: true,
        groupByPriority: true,
        autoExpandCritical: true,
      });
      setInterfaceSettings({
        theme: 'light',
        fontSize: 'medium',
        compactView: false,
        showTimestamps: true,
      });
    }
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-primary" />
            Nurse Settings
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">
            Manage your profile, notifications, and patient care preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Profile Information</h2>
              </div>
              <Button
                size="sm"
                variant={isEditingProfile ? 'default' : 'outline'}
                onClick={() => (isEditingProfile ? handleProfileUpdate() : setIsEditingProfile(true))}
              >
                {isEditingProfile ? 'Save' : 'Edit'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-foreground font-medium">{profileData.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nurse ID</Label>
                <p className="text-sm text-muted-foreground font-mono">{profileData.nurseId}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Department</Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.department}
                    onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiac ICU">Cardiac ICU</SelectItem>
                      <SelectItem value="Respiratory ICU">Respiratory ICU</SelectItem>
                      <SelectItem value="Surgical ICU">Surgical ICU</SelectItem>
                      <SelectItem value="Neuro ICU">Neuro ICU</SelectItem>
                      <SelectItem value="Pediatric ICU">Pediatric ICU</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-foreground font-medium">{profileData.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Shift Timing</Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.shift}
                    onValueChange={(value) => setProfileData({ ...profileData, shift: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day (7a - 7p)">Day (7a - 7p)</SelectItem>
                      <SelectItem value="Night (7p - 7a)">Night (7p - 7a)</SelectItem>
                      <SelectItem value="Day (7a - 3p)">Day (7a - 3p)</SelectItem>
                      <SelectItem value="Evening (3p - 11p)">Evening (3p - 11p)</SelectItem>
                      <SelectItem value="Night (11p - 7a)">Night (11p - 7a)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-foreground font-medium">{profileData.shift}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Contact Number
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-foreground font-medium">{profileData.phone}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Notification Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="abnormalVitals" className="text-sm font-medium">
                    Abnormal Vitals Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when patient vitals are outside normal range
                  </p>
                </div>
                <Switch
                  id="abnormalVitals"
                  checked={notificationSettings.abnormalVitalsAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, abnormalVitalsAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="criticalAlerts" className="text-sm font-medium flex items-center gap-1">
                    Critical Alerts
                    <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">Life-threatening situations requiring immediate action</p>
                </div>
                <Switch
                  id="criticalAlerts"
                  checked={notificationSettings.criticalAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, criticalAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="warningAlerts" className="text-sm font-medium">
                    Warning Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Important changes that need attention</p>
                </div>
                <Switch
                  id="warningAlerts"
                  checked={notificationSettings.warningAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, warningAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="soundEnabled" className="text-sm font-medium">
                    Sound Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Play sound for critical notifications</p>
                </div>
                <Switch
                  id="soundEnabled"
                  checked={notificationSettings.soundEnabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, soundEnabled: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="vibrationEnabled" className="text-sm font-medium">
                    Vibration Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Vibrate device for critical alerts (mobile)</p>
                </div>
                <Switch
                  id="vibrationEnabled"
                  checked={notificationSettings.vibrationEnabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, vibrationEnabled: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="alertTone" className="text-sm font-medium">
                  Alert Tone
                </Label>
                <Select
                  value={notificationSettings.alertTone}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, alertTone: value })}
                >
                  <SelectTrigger id="alertTone" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beep">Beep (Default)</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="alarm">Alarm</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Patient Assignment Settings */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Patient Assignment</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">Currently Assigned Patients</p>
                <div className="space-y-1">
                  {assignedPatients.length > 0 ? (
                    assignedPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between text-sm bg-background p-2 rounded border"
                      >
                        <div>
                          <span className="font-medium">{patient.name}</span>
                          <span className="text-muted-foreground ml-2">({patient.bedNumber})</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            patient.status === 'critical'
                              ? 'bg-red-100 text-red-700'
                              : patient.status === 'warning'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {patient.status.toUpperCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No patients currently assigned</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="showNonAssigned" className="text-sm font-medium">
                    Show Non-Assigned Patients
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    View patients assigned to other nurses in your department
                  </p>
                </div>
                <Switch
                  id="showNonAssigned"
                  checked={patientSettings.showNonAssignedPatients}
                  onCheckedChange={(checked) =>
                    setPatientSettings({ ...patientSettings, showNonAssignedPatients: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="highlightAssigned" className="text-sm font-medium">
                    Highlight Assigned Patients
                  </Label>
                  <p className="text-xs text-muted-foreground">Emphasize your assigned patients in lists</p>
                </div>
                <Switch
                  id="highlightAssigned"
                  checked={patientSettings.highlightAssignedOnly}
                  onCheckedChange={(checked) =>
                    setPatientSettings({ ...patientSettings, highlightAssignedOnly: checked })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Alert Priority Display Preferences */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Alert Priority Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="showCriticalFirst" className="text-sm font-medium">
                    Show Critical First
                  </Label>
                  <p className="text-xs text-muted-foreground">Display critical alerts at the top of lists</p>
                </div>
                <Switch
                  id="showCriticalFirst"
                  checked={alertPrioritySettings.showCriticalFirst}
                  onCheckedChange={(checked) =>
                    setAlertPrioritySettings({ ...alertPrioritySettings, showCriticalFirst: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="highlightICU" className="text-sm font-medium">
                    Highlight ICU Emergency Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Use distinct colors and icons for ICU emergencies
                  </p>
                </div>
                <Switch
                  id="highlightICU"
                  checked={alertPrioritySettings.highlightICUEmergency}
                  onCheckedChange={(checked) =>
                    setAlertPrioritySettings({ ...alertPrioritySettings, highlightICUEmergency: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="groupByPriority" className="text-sm font-medium">
                    Group Alerts by Priority
                  </Label>
                  <p className="text-xs text-muted-foreground">Organize alerts into priority sections</p>
                </div>
                <Switch
                  id="groupByPriority"
                  checked={alertPrioritySettings.groupByPriority}
                  onCheckedChange={(checked) =>
                    setAlertPrioritySettings({ ...alertPrioritySettings, groupByPriority: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="autoExpandCritical" className="text-sm font-medium">
                    Auto-Expand Critical Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Automatically show details for critical alerts</p>
                </div>
                <Switch
                  id="autoExpandCritical"
                  checked={alertPrioritySettings.autoExpandCritical}
                  onCheckedChange={(checked) =>
                    setAlertPrioritySettings({ ...alertPrioritySettings, autoExpandCritical: checked })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Interface Preferences */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Interface Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Theme Mode
                </Label>
                <Select
                  value={interfaceSettings.theme}
                  onValueChange={(value) => setInterfaceSettings({ ...interfaceSettings, theme: value })}
                >
                  <SelectTrigger id="theme" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="fontSize" className="text-sm font-medium flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Font Size
                </Label>
                <Select
                  value={interfaceSettings.fontSize}
                  onValueChange={(value) => setInterfaceSettings({ ...interfaceSettings, fontSize: value })}
                >
                  <SelectTrigger id="fontSize" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium (Default)</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Adjust text size for better readability</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="compactView" className="text-sm font-medium">
                    Compact View
                  </Label>
                  <p className="text-xs text-muted-foreground">Display more information in less space</p>
                </div>
                <Switch
                  id="compactView"
                  checked={interfaceSettings.compactView}
                  onCheckedChange={(checked) => setInterfaceSettings({ ...interfaceSettings, compactView: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="showTimestamps" className="text-sm font-medium">
                    Show Timestamps
                  </Label>
                  <p className="text-xs text-muted-foreground">Display time information on alerts and updates</p>
                </div>
                <Switch
                  id="showTimestamps"
                  checked={interfaceSettings.showTimestamps}
                  onCheckedChange={(checked) =>
                    setInterfaceSettings({ ...interfaceSettings, showTimestamps: checked })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pb-6">
            <Button className="flex-1" onClick={() => alert('Settings saved successfully!')}>
              Save All Settings
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleResetSettings}>
              Reset to Default
            </Button>
          </div>

          {/* Info Box */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Frontend Only</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  These settings are stored locally. Once backend integration is complete, your preferences will sync
                  across all devices.
                </p>
              </div>
            </div>
          </Card>

          {/* Change Password Section */}
          <div className="mt-8">
            <ChangePasswordSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
