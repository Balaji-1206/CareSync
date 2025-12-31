import { MainLayout } from '@/components/layout/MainLayout';
import { StatusIndicator } from '@/components/admin/StatusIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { globalAlerts, alertTrendData, alertResponseStats } from '@/data/adminMockData';
import { AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AlertsMonitoring() {
  const criticalAlerts = globalAlerts.filter(a => a.severity === 'Critical');
  const warningAlerts = globalAlerts.filter(a => a.severity === 'Warning');
  const unacknowledgedAlerts = globalAlerts.filter(a => !a.acknowledged);
  const escalatedAlerts = globalAlerts.filter(a => a.escalated);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Escalation Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Global alerts overview and escalation tracking (read-only)
          </p>
        </div>

        {/* Alert Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{criticalAlerts.length}</p>
                </div>
                <div className="rounded-full p-3 bg-red-500/10 text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Warning Alerts</p>
                  <p className="text-3xl font-bold text-yellow-600">{warningAlerts.length}</p>
                </div>
                <div className="rounded-full p-3 bg-yellow-500/10 text-yellow-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Escalated</p>
                  <p className="text-3xl font-bold text-purple-600">{escalatedAlerts.length}</p>
                </div>
                <div className="rounded-full p-3 bg-purple-500/10 text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Unacknowledged</p>
                  <p className="text-3xl font-bold text-orange-600">{unacknowledgedAlerts.length}</p>
                </div>
                <div className="rounded-full p-3 bg-orange-500/10 text-orange-600">
                  <XCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Response Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Time Statistics
              </CardTitle>
              <CardDescription>Average alert response times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Overall Average</span>
                  <span className="text-xl font-bold">{alertResponseStats.averageResponseTime} min</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/5">
                  <span className="text-sm font-medium text-red-600">Critical Alerts</span>
                  <span className="text-xl font-bold text-red-600">{alertResponseStats.criticalAvgResponse} min</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-500/5">
                  <span className="text-sm font-medium text-yellow-600">Warning Alerts</span>
                  <span className="text-xl font-bold text-yellow-600">{alertResponseStats.warningAvgResponse} min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Alert Acknowledgment
              </CardTitle>
              <CardDescription>Alert handling statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-4xl font-bold">{alertResponseStats.totalAlerts}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Alerts (24h)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <p className="text-2xl font-bold text-green-600">{alertResponseStats.acknowledgedAlerts}</p>
                    <p className="text-xs text-muted-foreground mt-1">Acknowledged</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-500/10">
                    <p className="text-2xl font-bold text-red-600">{alertResponseStats.unacknowledgedAlerts}</p>
                    <p className="text-xs text-muted-foreground mt-1">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Trends (Last 7 Days)</CardTitle>
            <CardDescription>Historical alert pattern analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="critical" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Critical"
                />
                <Line 
                  type="monotone" 
                  dataKey="warning" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Warning"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Distribution by Day</CardTitle>
            <CardDescription>Daily breakdown of alert severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="critical" fill="#ef4444" name="Critical" />
                <Bar dataKey="warning" fill="#f59e0b" name="Warning" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>Current system alerts (read-only view)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Bed ID</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {globalAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-mono text-sm">{alert.id}</TableCell>
                    <TableCell className="font-medium">{alert.bedId}</TableCell>
                    <TableCell className="font-mono text-sm">{alert.patientId}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          alert.severity === 'Critical'
                            ? 'border-red-500/50 text-red-600 bg-red-500/10'
                            : 'border-yellow-500/50 text-yellow-600 bg-yellow-500/10'
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{alert.type}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">{alert.message}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{alert.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {alert.acknowledged ? (
                          <Badge variant="outline" className="border-green-500/50 text-green-600 bg-green-500/10">
                            Acknowledged
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-500/50 text-orange-600 bg-orange-500/10">
                            Pending
                          </Badge>
                        )}
                        {alert.escalated && (
                          <Badge variant="outline" className="border-purple-500/50 text-purple-600 bg-purple-500/10 text-xs">
                            Escalated
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{alert.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
