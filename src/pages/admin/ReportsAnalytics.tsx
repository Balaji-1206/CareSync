import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  utilizationTrendData, 
  alertSeverityDistribution, 
  staffActivityStats,
  alertTrendData 
} from '@/data/adminMockData';
import { 
  Download, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Users,
  FileBarChart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

export default function ReportsAnalytics() {
  const handleExport = (format: 'pdf' | 'csv') => {
    // Frontend only - simulate export
    alert(`Exporting report as ${format.toUpperCase()}... (Frontend simulation)`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive system analytics and reporting
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="utilization" className="space-y-4">
          <TabsList>
            <TabsTrigger value="utilization">ICU Utilization</TabsTrigger>
            <TabsTrigger value="alerts">Alert Analytics</TabsTrigger>
            <TabsTrigger value="staff">Staff Activity</TabsTrigger>
          </TabsList>

          {/* ICU Utilization Reports */}
          <TabsContent value="utilization" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Average Occupancy</p>
                    <p className="text-4xl font-bold text-blue-600">68.3%</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Total Admissions</p>
                    <p className="text-4xl font-bold text-green-600">124</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Total Discharges</p>
                    <p className="text-4xl font-bold text-purple-600">118</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  ICU Occupancy Trend
                </CardTitle>
                <CardDescription>Bed occupancy percentage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={utilizationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="occupancy" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Occupancy %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Flow Analysis</CardTitle>
                <CardDescription>Admissions and discharges over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={utilizationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="admissions" fill="#10b981" name="Admissions" />
                    <Bar dataKey="discharges" fill="#8b5cf6" name="Discharges" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alert Analytics */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Total Alerts</p>
                    <p className="text-4xl font-bold">145</p>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Critical Alerts</p>
                    <p className="text-4xl font-bold text-red-600">28</p>
                    <p className="text-xs text-muted-foreground">19.3% of total</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-4xl font-bold text-green-600">4.2m</p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Alert Severity Distribution
                  </CardTitle>
                  <CardDescription>Breakdown by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={alertSeverityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {alertSeverityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {alertSeverityDistribution.map((item, index) => (
                      <div key={item.name} className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <p className="text-xs font-medium">{item.name}</p>
                        </div>
                        <p className="text-lg font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alert Frequency Trend</CardTitle>
                  <CardDescription>Daily alert count over the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={alertTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#3b82f6" name="Total Alerts" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staff Activity Analytics */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Nurse Alert Response Performance
                </CardTitle>
                <CardDescription>Alert handling statistics by nursing staff</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nurse Name</TableHead>
                      <TableHead className="text-right">Alert Responses</TableHead>
                      <TableHead className="text-right">Avg Response Time</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffActivityStats.nurseAlertResponses.map((nurse) => (
                      <TableRow key={nurse.name}>
                        <TableCell className="font-medium">{nurse.name}</TableCell>
                        <TableCell className="text-right font-semibold">{nurse.responses}</TableCell>
                        <TableCell className="text-right">{nurse.avgTime} min</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              nurse.avgTime < 4 
                                ? 'border-green-500/50 text-green-600 bg-green-500/10'
                                : nurse.avgTime < 5
                                ? 'border-yellow-500/50 text-yellow-600 bg-yellow-500/10'
                                : 'border-red-500/50 text-red-600 bg-red-500/10'
                            }
                          >
                            {nurse.avgTime < 4 ? 'Excellent' : nurse.avgTime < 5 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart className="h-5 w-5" />
                  Doctor Review Activity
                </CardTitle>
                <CardDescription>Patient review statistics by doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor Name</TableHead>
                      <TableHead className="text-right">Reviews Completed</TableHead>
                      <TableHead className="text-right">Avg Review Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffActivityStats.doctorReviews.map((doctor) => (
                      <TableRow key={doctor.name}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell className="text-right font-semibold">{doctor.reviews}</TableCell>
                        <TableCell className="text-right">{doctor.avgTime} min</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-600 bg-blue-500/10">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nurse Response Chart</CardTitle>
                  <CardDescription>Total responses by nurse</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffActivityStats.nurseAlertResponses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="responses" fill="#10b981" name="Responses" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Doctor Review Chart</CardTitle>
                  <CardDescription>Total reviews by doctor</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffActivityStats.doctorReviews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reviews" fill="#3b82f6" name="Reviews" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
