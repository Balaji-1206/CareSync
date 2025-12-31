import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { auditLogs } from '@/data/adminMockData';
import { Shield, Search, Filter } from 'lucide-react';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || log.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'border-purple-500/50 text-purple-600 bg-purple-500/10';
      case 'doctor':
        return 'border-blue-500/50 text-blue-600 bg-blue-500/10';
      case 'nurse':
        return 'border-green-500/50 text-green-600 bg-green-500/10';
      default:
        return 'border-gray-500/50 text-gray-600 bg-gray-500/10';
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('Login')) return 'border-green-500/50 text-green-600 bg-green-500/10';
    if (action.includes('Logout')) return 'border-gray-500/50 text-gray-600 bg-gray-500/10';
    if (action.includes('Configuration') || action.includes('Modified')) return 'border-orange-500/50 text-orange-600 bg-orange-500/10';
    if (action.includes('Alert')) return 'border-red-500/50 text-red-600 bg-red-500/10';
    return 'border-blue-500/50 text-blue-600 bg-blue-500/10';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Activity & Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            System access history and configuration change tracking
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-3xl font-bold">{auditLogs.length}</p>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Admin Actions</p>
                <p className="text-3xl font-bold text-purple-600">
                  {auditLogs.filter(l => l.role === 'Admin').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Doctor Actions</p>
                <p className="text-3xl font-bold text-blue-600">
                  {auditLogs.filter(l => l.role === 'Doctor').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Nurse Actions</p>
                <p className="text-3xl font-bold text-green-600">
                  {auditLogs.filter(l => l.role === 'Nurse').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Audit Log Viewer
            </CardTitle>
            <CardDescription>Search and filter system activity logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, action, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {auditLogs.length} logs
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No logs found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleBadgeColor(log.role)}
                        >
                          {log.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getActionBadgeColor(log.action)}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md text-sm text-muted-foreground">
                        {log.details}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Login Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs
                  .filter(log => log.action === 'Login')
                  .slice(0, 5)
                  .map((log, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{log.user.split('@')[0]}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alert Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs
                  .filter(log => log.action.includes('Alert'))
                  .slice(0, 5)
                  .map((log, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{log.user.split('@')[0]}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs
                  .filter(log => log.action.includes('Configuration') || log.action.includes('Modified'))
                  .slice(0, 5)
                  .map((log, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{log.user.split('@')[0]}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
