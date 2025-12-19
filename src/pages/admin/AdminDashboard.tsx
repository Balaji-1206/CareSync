import { MainLayout } from '@/components/layout/MainLayout';
import { SystemStatCard } from '@/components/admin/SystemStatCard';
import { StatusIndicator } from '@/components/admin/StatusIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { systemStats, systemHealth, wards } from '@/data/adminMockData';
import {
  BedDouble,
  Users,
  AlertTriangle,
  Activity,
  Wifi,
  Database,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System overview and operational monitoring
          </p>
        </div>

        {/* System Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SystemStatCard
            title="Total ICU Beds"
            value={systemStats.totalBeds}
            subtitle={`${systemStats.occupiedBeds} occupied, ${systemStats.freeBeds} free`}
            icon={BedDouble}
            status="normal"
          />
          <SystemStatCard
            title="Total Patients"
            value={systemStats.totalPatients}
            subtitle="Currently admitted"
            icon={Users}
            status="normal"
          />
          <SystemStatCard
            title="Active Alerts"
            value={systemStats.activeAlerts}
            subtitle={`${systemStats.criticalAlerts} critical, ${systemStats.warningAlerts} warnings`}
            icon={AlertTriangle}
            status={systemStats.criticalAlerts > 0 ? 'critical' : 'warning'}
          />
          <SystemStatCard
            title="ICU Occupancy"
            value={`${systemStats.occupancyPercentage}%`}
            subtitle="Current capacity"
            icon={TrendingUp}
            status={systemStats.occupancyPercentage > 80 ? 'warning' : 'normal'}
          />
        </div>

        {/* System Health & Ward Overview */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>Real-time system status and connectivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    API Status
                  </span>
                  <StatusIndicator status={systemHealth.apiStatus === 'Connected' ? 'Connected' : 'Disconnected'} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Device Connectivity</span>
                  <span className="text-muted-foreground">{systemHealth.deviceConnectivity}%</span>
                </div>
                <Progress value={systemHealth.deviceConnectivity} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Active Sensors
                  </span>
                  <span className="text-muted-foreground">
                    {systemHealth.activeSensors} / {systemHealth.totalSensors}
                  </span>
                </div>
                <Progress 
                  value={(systemHealth.activeSensors / systemHealth.totalSensors) * 100} 
                  className="h-2" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    Data Latency
                  </p>
                  <p className="text-lg font-semibold">{systemHealth.dataLatency}s</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last Sync
                  </p>
                  <p className="text-lg font-semibold">
                    {Math.round((Date.now() - new Date(systemHealth.lastSyncTimestamp).getTime()) / 60000)}m ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ward Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                Ward Overview
              </CardTitle>
              <CardDescription>ICU bed distribution across wards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wards.map((ward) => {
                const occupancyRate = (ward.occupied / ward.totalBeds) * 100;
                return (
                  <div key={ward.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{ward.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ward.occupied} / {ward.totalBeds} beds occupied
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{occupancyRate.toFixed(0)}%</p>
                        {ward.maintenance > 0 && (
                          <p className="text-xs text-orange-600">{ward.maintenance} maintenance</p>
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={occupancyRate} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>Key performance indicators at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-green-600">{systemHealth.activeSensors}</p>
                <p className="text-sm text-muted-foreground mt-1">Active Sensors</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-red-600">{systemHealth.offlineSensors}</p>
                <p className="text-sm text-muted-foreground mt-1">Offline Sensors</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-blue-600">{systemStats.freeBeds}</p>
                <p className="text-sm text-muted-foreground mt-1">Available Beds</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-orange-600">{systemStats.maintenanceBeds}</p>
                <p className="text-sm text-muted-foreground mt-1">Maintenance Beds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
