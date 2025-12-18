import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Monitor, Volume2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    criticalAlerts: true,
    warningAlerts: true,
    soundEnabled: true,
    autoRefresh: true,
    refreshInterval: 30,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your monitoring preferences and notifications
          </p>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Profile Section */}
          <div className="rounded-xl bg-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Dr. John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.smith@hospital.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Doctor" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue="Intensive Care Unit" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="rounded-xl bg-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => updateSetting('emailAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">SMS Alerts</Label>
                  <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch
                  checked={settings.smsAlerts}
                  onCheckedChange={(checked) => updateSetting('smsAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Critical Alerts</Label>
                  <p className="text-xs text-muted-foreground">Alert when vitals reach critical levels</p>
                </div>
                <Switch
                  checked={settings.criticalAlerts}
                  onCheckedChange={(checked) => updateSetting('criticalAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Warning Alerts</Label>
                  <p className="text-xs text-muted-foreground">Alert when vitals show warning signs</p>
                </div>
                <Switch
                  checked={settings.warningAlerts}
                  onCheckedChange={(checked) => updateSetting('warningAlerts', checked)}
                />
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="rounded-xl bg-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Display</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Sound Enabled</Label>
                  <p className="text-xs text-muted-foreground">Play sound for alerts</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto Refresh</Label>
                  <p className="text-xs text-muted-foreground">Automatically refresh vital data</p>
                </div>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Refresh Interval</Label>
                  <p className="text-xs text-muted-foreground">Seconds between data refresh</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value) || 30)}
                    className="w-20 text-center"
                    min={5}
                    max={120}
                  />
                  <span className="text-sm text-muted-foreground">sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl bg-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Active Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
