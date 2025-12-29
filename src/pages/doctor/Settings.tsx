import { useState } from 'react';
import { Settings as SettingsIcon, User, Stethoscope, Bell, BarChart3, Eye, Shield } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getAuth } from '@/hooks/use-auth';
import ChangePasswordSection from '@/components/ChangePasswordSection';

export default function DoctorSettings() {
  const auth = getAuth();

  // Mock doctor profile
  const doctorProfile = {
    name: 'Dr. Sarah Mitchell, MD',
    doctorId: auth?.email?.split('@')[0].toUpperCase() || 'DOC001',
    specialization: 'Critical Care Medicine',
    email: auth?.email || 'doctor@hospital.com',
    phone: '+1 (555) 987-6543',
    licenseNumber: 'NY-MD-123456',
  };

  // State for profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: doctorProfile.name,
    specialization: doctorProfile.specialization,
    phone: doctorProfile.phone,
  });

  // State for vital thresholds
  const [vitalThresholds, setVitalThresholds] = useState({
    heartRateMin: 60,
    heartRateMax: 100,
    spo2Min: 94,
    spo2Max: 100,
    bpSystolicMin: 90,
    bpSystolicMax: 140,
    bpDiastolicMin: 60,
    bpDiastolicMax: 90,
    temperatureMin: 36.0,
    temperatureMax: 38.0,
  });

  // State for alert configuration
  const [alertConfig, setAlertConfig] = useState({
    enableEarlyWarning: true,
    earlyWarningThreshold: 80,
    criticalAlertSound: true,
    warningAlertSound: true,
    autoEscalate: true,
    escalationMinutes: 5,
  });

  // State for monitoring preferences
  const [monitoringPrefs, setMonitoringPrefs] = useState({
    defaultVitalsPriority: ['spo2', 'heartRate', 'bloodPressure', 'temperature'],
    enableTrendGraphs: true,
    graphTimeRange: '24h',
    showNormalValues: false,
    highlightAbnormal: true,
  });

  // State for notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushAlertsCritical: true,
    pushAlertsWarning: true,
    emailAlertsCritical: true,
    emailAlertsWarning: false,
    smsAlertsCritical: true,
    smsAlertsWarning: false,
    dailySummaryEmail: true,
  });

  // State for consultation settings
  const [consultationSettings, setConsultationSettings] = useState({
    enableRemoteReview: true,
    allowPatientHistory: true,
    enableVideoConsultation: true,
    historyDataRange: '6months',
    allowSecondOpinion: true,
    autoGenerateReports: true,
  });

  const handleProfileUpdate = () => {
    setIsEditingProfile(false);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setVitalThresholds({
        heartRateMin: 60,
        heartRateMax: 100,
        spo2Min: 94,
        spo2Max: 100,
        bpSystolicMin: 90,
        bpSystolicMax: 140,
        bpDiastolicMin: 60,
        bpDiastolicMax: 90,
        temperatureMin: 36.0,
        temperatureMax: 38.0,
      });
      setAlertConfig({
        enableEarlyWarning: true,
        earlyWarningThreshold: 80,
        criticalAlertSound: true,
        warningAlertSound: true,
        autoEscalate: true,
        escalationMinutes: 5,
      });
      setMonitoringPrefs({
        defaultVitalsPriority: ['spo2', 'heartRate', 'bloodPressure', 'temperature'],
        enableTrendGraphs: true,
        graphTimeRange: '24h',
        showNormalValues: false,
        highlightAbnormal: true,
      });
      setNotificationPrefs({
        pushAlertsCritical: true,
        pushAlertsWarning: true,
        emailAlertsCritical: true,
        emailAlertsWarning: false,
        smsAlertsCritical: true,
        smsAlertsWarning: false,
        dailySummaryEmail: true,
      });
      setConsultationSettings({
        enableRemoteReview: true,
        allowPatientHistory: true,
        enableVideoConsultation: true,
        historyDataRange: '6months',
        allowSecondOpinion: true,
        autoGenerateReports: true,
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
            Doctor Settings
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">
            Configure clinical monitoring, alerts, and consultation preferences
          </p>
        </div>

        {/* Profile Section */}
        <Card className="p-4 lg:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Profile & Specialization</h2>
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
              <Label className="text-sm font-medium">Doctor ID</Label>
              <p className="text-sm text-muted-foreground font-mono">{doctorProfile.doctorId}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium">
                Specialization
              </Label>
              {isEditingProfile ? (
                <Select
                  value={profileData.specialization}
                  onValueChange={(value) => setProfileData({ ...profileData, specialization: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical Care Medicine">Critical Care Medicine</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Pulmonology">Pulmonology</SelectItem>
                    <SelectItem value="Anesthesiology">Anesthesiology</SelectItem>
                    <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-foreground font-medium">{profileData.specialization}</p>
              )}
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{doctorProfile.email}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">License Number</Label>
              <p className="text-sm text-muted-foreground font-mono">{doctorProfile.licenseNumber}</p>
            </div>
          </div>
        </Card>

        {/* Tabs for Settings */}
        <Tabs defaultValue="vitals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="vitals" className="text-xs lg:text-sm">
              Vital Thresholds
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs lg:text-sm">
              Alert Config
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs lg:text-sm">
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="consultation" className="text-xs lg:text-sm">
              Consultation
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Vital Thresholds */}
          <TabsContent value="vitals">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Vital Sign Threshold Limits</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Set the normal range boundaries for patient vitals. Values outside these ranges will trigger alerts.
              </p>

              <div className="space-y-6">
                {/* Heart Rate */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                    Heart Rate (bpm)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hrMin" className="text-xs font-medium">
                        Minimum (Low Alert)
                      </Label>
                      <Input
                        id="hrMin"
                        type="number"
                        value={vitalThresholds.heartRateMin}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            heartRateMin: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrMax" className="text-xs font-medium">
                        Maximum (High Alert)
                      </Label>
                      <Input
                        id="hrMax"
                        type="number"
                        value={vitalThresholds.heartRateMax}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            heartRateMax: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* SpO2 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    Oxygen Saturation (SpO₂ %)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="spo2Min" className="text-xs font-medium">
                        Minimum (Critical if below)
                      </Label>
                      <Input
                        id="spo2Min"
                        type="number"
                        step="0.1"
                        value={vitalThresholds.spo2Min}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            spo2Min: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spo2Max" className="text-xs font-medium">
                        Maximum (Rare)
                      </Label>
                      <Input
                        id="spo2Max"
                        type="number"
                        step="0.1"
                        value={vitalThresholds.spo2Max}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            spo2Max: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Blood Pressure */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                    Blood Pressure (mmHg)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bpSysMin" className="text-xs font-medium">
                        Systolic Min
                      </Label>
                      <Input
                        id="bpSysMin"
                        type="number"
                        value={vitalThresholds.bpSystolicMin}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            bpSystolicMin: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bpSysMax" className="text-xs font-medium">
                        Systolic Max
                      </Label>
                      <Input
                        id="bpSysMax"
                        type="number"
                        value={vitalThresholds.bpSystolicMax}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            bpSystolicMax: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bpDiaMin" className="text-xs font-medium">
                        Diastolic Min
                      </Label>
                      <Input
                        id="bpDiaMin"
                        type="number"
                        value={vitalThresholds.bpDiastolicMin}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            bpDiastolicMin: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bpDiaMax" className="text-xs font-medium">
                        Diastolic Max
                      </Label>
                      <Input
                        id="bpDiaMax"
                        type="number"
                        value={vitalThresholds.bpDiastolicMax}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            bpDiastolicMax: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Temperature */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
                    Temperature (°C)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tempMin" className="text-xs font-medium">
                        Minimum (Hypothermia Alert)
                      </Label>
                      <Input
                        id="tempMin"
                        type="number"
                        step="0.1"
                        value={vitalThresholds.temperatureMin}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            temperatureMin: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempMax" className="text-xs font-medium">
                        Maximum (Fever Alert)
                      </Label>
                      <Input
                        id="tempMax"
                        type="number"
                        step="0.1"
                        value={vitalThresholds.temperatureMax}
                        onChange={(e) =>
                          setVitalThresholds({
                            ...vitalThresholds,
                            temperatureMax: Number(e.target.value),
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 2: Alert Configuration */}
          <TabsContent value="alerts">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Alert Configuration</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="earlyWarning" className="text-sm font-medium">
                      Enable Early Warning Alerts
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get alerted before values reach critical thresholds
                    </p>
                  </div>
                  <Switch
                    id="earlyWarning"
                    checked={alertConfig.enableEarlyWarning}
                    onCheckedChange={(checked) =>
                      setAlertConfig({ ...alertConfig, enableEarlyWarning: checked })
                    }
                  />
                </div>

                {alertConfig.enableEarlyWarning && (
                  <div className="space-y-2 ml-4 p-3 bg-muted rounded-lg">
                    <Label htmlFor="warningThreshold" className="text-xs font-medium">
                      Early Warning Threshold (% of normal range)
                    </Label>
                    <Input
                      id="warningThreshold"
                      type="number"
                      min="50"
                      max="100"
                      value={alertConfig.earlyWarningThreshold}
                      onChange={(e) =>
                        setAlertConfig({
                          ...alertConfig,
                          earlyWarningThreshold: Number(e.target.value),
                        })
                      }
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Current: Alert at {alertConfig.earlyWarningThreshold}% of normal range
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="criticalSound" className="text-sm font-medium">
                      Critical Alert Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Play audible alert for critical patient conditions
                    </p>
                  </div>
                  <Switch
                    id="criticalSound"
                    checked={alertConfig.criticalAlertSound}
                    onCheckedChange={(checked) =>
                      setAlertConfig({ ...alertConfig, criticalAlertSound: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="warningSound" className="text-sm font-medium">
                      Warning Alert Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Play audible alert for warning-level changes
                    </p>
                  </div>
                  <Switch
                    id="warningSound"
                    checked={alertConfig.warningAlertSound}
                    onCheckedChange={(checked) =>
                      setAlertConfig({ ...alertConfig, warningAlertSound: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoEscalate" className="text-sm font-medium">
                      Auto-Escalate Unresponded Alerts
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically escalate alerts to senior staff if not acknowledged
                    </p>
                  </div>
                  <Switch
                    id="autoEscalate"
                    checked={alertConfig.autoEscalate}
                    onCheckedChange={(checked) =>
                      setAlertConfig({ ...alertConfig, autoEscalate: checked })
                    }
                  />
                </div>

                {alertConfig.autoEscalate && (
                  <div className="space-y-2 ml-4 p-3 bg-muted rounded-lg">
                    <Label htmlFor="escalationTime" className="text-xs font-medium">
                      Escalation Time (minutes)
                    </Label>
                    <Input
                      id="escalationTime"
                      type="number"
                      min="1"
                      max="60"
                      value={alertConfig.escalationMinutes}
                      onChange={(e) =>
                        setAlertConfig({
                          ...alertConfig,
                          escalationMinutes: Number(e.target.value),
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card className="p-4 lg:p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notification Channels</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Critical Alerts</p>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushCritical" className="text-xs">
                      Push Notifications
                    </Label>
                    <Switch
                      id="pushCritical"
                      checked={notificationPrefs.pushAlertsCritical}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          pushAlertsCritical: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailCritical" className="text-xs">
                      Email Notifications
                    </Label>
                    <Switch
                      id="emailCritical"
                      checked={notificationPrefs.emailAlertsCritical}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          emailAlertsCritical: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsCritical" className="text-xs">
                      SMS Notifications
                    </Label>
                    <Switch
                      id="smsCritical"
                      checked={notificationPrefs.smsAlertsCritical}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          smsAlertsCritical: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Warning Alerts</p>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushWarning" className="text-xs">
                      Push Notifications
                    </Label>
                    <Switch
                      id="pushWarning"
                      checked={notificationPrefs.pushAlertsWarning}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          pushAlertsWarning: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailWarning" className="text-xs">
                      Email Notifications
                    </Label>
                    <Switch
                      id="emailWarning"
                      checked={notificationPrefs.emailAlertsWarning}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          emailAlertsWarning: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsWarning" className="text-xs">
                      SMS Notifications
                    </Label>
                    <Switch
                      id="smsWarning"
                      checked={notificationPrefs.smsAlertsWarning}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          smsAlertsWarning: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="dailySummary" className="text-sm font-medium">
                      Daily Summary Email
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive daily summary of patient status at 6 AM
                    </p>
                  </div>
                  <Switch
                    id="dailySummary"
                    checked={notificationPrefs.dailySummaryEmail}
                    onCheckedChange={(checked) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        dailySummaryEmail: checked,
                      })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 3: Patient Monitoring Preferences */}
          <TabsContent value="monitoring">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Patient Monitoring Display</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Default Vitals Display Order</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Drag to reorder which vitals appear first in patient views
                  </p>
                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    {[
                      { id: 'spo2', label: 'Oxygen Saturation (SpO₂)' },
                      { id: 'heartRate', label: 'Heart Rate' },
                      { id: 'bloodPressure', label: 'Blood Pressure' },
                      { id: 'temperature', label: 'Temperature' },
                    ].map((vital) => (
                      <div
                        key={vital.id}
                        className="flex items-center gap-2 p-2 bg-background rounded border"
                      >
                        <div className="h-4 w-4 rounded bg-primary/50 flex items-center justify-center">
                          <span className="text-xs text-primary font-bold">⋮</span>
                        </div>
                        <span className="text-sm">{vital.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="trendGraphs" className="text-sm font-medium">
                      Enable Trend Graphs by Default
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Auto-load historical data graphs for each vital sign
                    </p>
                  </div>
                  <Switch
                    id="trendGraphs"
                    checked={monitoringPrefs.enableTrendGraphs}
                    onCheckedChange={(checked) =>
                      setMonitoringPrefs({ ...monitoringPrefs, enableTrendGraphs: checked })
                    }
                  />
                </div>

                {monitoringPrefs.enableTrendGraphs && (
                  <div className="space-y-2 ml-4 p-3 bg-muted rounded-lg">
                    <Label htmlFor="graphTimeRange" className="text-xs font-medium">
                      Default Graph Time Range
                    </Label>
                    <Select
                      value={monitoringPrefs.graphTimeRange}
                      onValueChange={(value) =>
                        setMonitoringPrefs({ ...monitoringPrefs, graphTimeRange: value })
                      }
                    >
                      <SelectTrigger id="graphTimeRange" className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last 1 Hour</SelectItem>
                        <SelectItem value="4h">Last 4 Hours</SelectItem>
                        <SelectItem value="12h">Last 12 Hours</SelectItem>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="showNormal" className="text-sm font-medium">
                      Show Normal Values
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display vitals within normal range (less visual clutter if disabled)
                    </p>
                  </div>
                  <Switch
                    id="showNormal"
                    checked={monitoringPrefs.showNormalValues}
                    onCheckedChange={(checked) =>
                      setMonitoringPrefs({ ...monitoringPrefs, showNormalValues: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="highlightAbnormal" className="text-sm font-medium">
                      Highlight Abnormal Values
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Use color coding for values outside normal range
                    </p>
                  </div>
                  <Switch
                    id="highlightAbnormal"
                    checked={monitoringPrefs.highlightAbnormal}
                    onCheckedChange={(checked) =>
                      setMonitoringPrefs({ ...monitoringPrefs, highlightAbnormal: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 4: Consultation Settings */}
          <TabsContent value="consultation">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Consultation & Review Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="remoteReview" className="text-sm font-medium">
                      Enable Remote Review Mode
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow detailed patient review from remote locations
                    </p>
                  </div>
                  <Switch
                    id="remoteReview"
                    checked={consultationSettings.enableRemoteReview}
                    onCheckedChange={(checked) =>
                      setConsultationSettings({
                        ...consultationSettings,
                        enableRemoteReview: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="patientHistory" className="text-sm font-medium">
                      View Historical Patient Data
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Access past patient records and admission history
                    </p>
                  </div>
                  <Switch
                    id="patientHistory"
                    checked={consultationSettings.allowPatientHistory}
                    onCheckedChange={(checked) =>
                      setConsultationSettings({
                        ...consultationSettings,
                        allowPatientHistory: checked,
                      })
                    }
                  />
                </div>

                {consultationSettings.allowPatientHistory && (
                  <div className="space-y-2 ml-4 p-3 bg-muted rounded-lg">
                    <Label htmlFor="historyRange" className="text-xs font-medium">
                      Historical Data Range
                    </Label>
                    <Select
                      value={consultationSettings.historyDataRange}
                      onValueChange={(value) =>
                        setConsultationSettings({
                          ...consultationSettings,
                          historyDataRange: value,
                        })
                      }
                    >
                      <SelectTrigger id="historyRange" className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">Last 1 Month</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last 1 Year</SelectItem>
                        <SelectItem value="all">All Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="videoConsult" className="text-sm font-medium">
                      Enable Video Consultation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow video calls with nursing staff and other doctors
                    </p>
                  </div>
                  <Switch
                    id="videoConsult"
                    checked={consultationSettings.enableVideoConsultation}
                    onCheckedChange={(checked) =>
                      setConsultationSettings({
                        ...consultationSettings,
                        enableVideoConsultation: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="secondOpinion" className="text-sm font-medium">
                      Allow Second Opinion Requests
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Request consultations from specialist doctors
                    </p>
                  </div>
                  <Switch
                    id="secondOpinion"
                    checked={consultationSettings.allowSecondOpinion}
                    onCheckedChange={(checked) =>
                      setConsultationSettings({
                        ...consultationSettings,
                        allowSecondOpinion: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoReports" className="text-sm font-medium">
                      Auto-Generate Clinical Reports
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically create summary reports from patient data
                    </p>
                  </div>
                  <Switch
                    id="autoReports"
                    checked={consultationSettings.autoGenerateReports}
                    onCheckedChange={(checked) =>
                      setConsultationSettings({
                        ...consultationSettings,
                        autoGenerateReports: checked,
                      })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-6">
          <Button className="flex-1" onClick={() => alert('Settings saved successfully!')}>
            Save All Settings
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleResetSettings}>
            Reset to Default
          </Button>
        </div>

        {/* Change Password Section */}
        <div className="mt-8 mb-6">
          <ChangePasswordSection />
        </div>

        {/* Info Box */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <div className="text-blue-600 dark:text-blue-400 mt-0.5">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Clinical Safety Notice
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                These settings control critical alert thresholds. Ensure all values are clinically appropriate
                for your patient population. Changes take effect immediately. This is a frontend-only interface;
                settings will sync with backend upon connection.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
