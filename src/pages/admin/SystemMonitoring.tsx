import { MainLayout } from '@/components/layout/MainLayout';
import { StatusIndicator } from '@/components/admin/StatusIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { systemHealth, offlineSensors, errorLogs } from '@/data/adminMockData';
import { Activity, AlertCircle, Database, Wifi, Clock, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SystemMonitoring() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Monitoring & Health</h1>
          <p className="text-muted-foreground mt-1">
            Real-time system metrics and device connectivity
          </p>
        </div>

        {/* System Health Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">API Status</p>
                  <p className="text-2xl font-bold">
                    {systemHealth.apiStatus}
                  </p>
                </div>
                <div className={cn(
                  "rounded-full p-3",
                  systemHealth.apiStatus === 'Connected' 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'bg-red-500/10 text-red-600'
                )}>
                  <Wifi className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Sensors</p>
                  <p className="text-2xl font-bold">
                    {systemHealth.activeSensors}/{systemHealth.totalSensors}
                  </p>
                </div>
                <div className="rounded-full p-3 bg-blue-500/10 text-blue-600">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data Latency</p>
                  <p className="text-2xl font-bold">{systemHealth.dataLatency}s</p>
                </div>
                <div className={cn(
                  "rounded-full p-3",
                  systemHealth.dataLatency < 2 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'bg-yellow-500/10 text-yellow-600'
                )}>
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Offline Sensors</p>
                  <p className="text-2xl font-bold text-red-600">
                    {systemHealth.offlineSensors}
                  </p>
                </div>
                <div className="rounded-full p-3 bg-red-500/10 text-red-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Connectivity & Last Sync */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Device Connectivity
              </CardTitle>
              <CardDescription>Overall device network connectivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-5xl font-bold">{systemHealth.deviceConnectivity}%</p>
                <p className="text-sm text-muted-foreground mt-2">Connected Devices</p>
              </div>
              <Progress value={systemHealth.deviceConnectivity} className="h-3" />
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{systemHealth.activeSensors}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{systemHealth.offlineSensors}</p>
                  <p className="text-xs text-muted-foreground">Offline</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{systemHealth.totalSensors}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Metrics
              </CardTitle>
              <CardDescription>Real-time performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Latency</span>
                  <span className="font-medium">{systemHealth.dataLatency}s</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      'h-full transition-all',
                      systemHealth.dataLatency < 2 ? 'bg-green-500' : 'bg-yellow-500'
                    )}
                    style={{ width: `${(systemHealth.dataLatency / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Data Sync</span>
                  <span className="font-medium">
                    {Math.round((Date.now() - new Date(systemHealth.lastSyncTimestamp).getTime()) / 60000)}m ago
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Gateway</span>
                  <StatusIndicator status={systemHealth.apiStatus === 'Connected' ? 'Connected' : 'Disconnected'} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <StatusIndicator status="Connected" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IoT Gateway</span>
                  <StatusIndicator status="Connected" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offline Sensors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Offline Sensors
            </CardTitle>
            <CardDescription>Sensors currently not responding</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sensor ID</TableHead>
                  <TableHead>Bed ID</TableHead>
                  <TableHead>Sensor Type</TableHead>
                  <TableHead>Offline Since</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offlineSensors.map((sensor) => (
                  <TableRow key={sensor.sensorId}>
                    <TableCell className="font-mono text-sm">{sensor.sensorId}</TableCell>
                    <TableCell className="font-medium">{sensor.bedId}</TableCell>
                    <TableCell>{sensor.type}</TableCell>
                    <TableCell className="text-muted-foreground">{sensor.offlineSince}</TableCell>
                    <TableCell>
                      <StatusIndicator status={sensor.status as any} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Error and Warning Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Logs
            </CardTitle>
            <CardDescription>Recent errors and warnings (read-only)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {errorLogs.map((log, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border",
                    log.level === 'Error' && 'bg-red-500/5 border-red-500/20',
                    log.level === 'Warning' && 'bg-yellow-500/5 border-yellow-500/20',
                    log.level === 'Info' && 'bg-blue-500/5 border-blue-500/20'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            log.level === 'Error' && 'border-red-500/50 text-red-600',
                            log.level === 'Warning' && 'border-yellow-500/50 text-yellow-600',
                            log.level === 'Info' && 'border-blue-500/50 text-blue-600'
                          )}
                        >
                          {log.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{log.source}</span>
                        {log.bedId && (
                          <Badge variant="secondary" className="text-xs">
                            {log.bedId}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{log.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
