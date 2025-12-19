import { MainLayout } from '@/components/layout/MainLayout';
import { StatusIndicator } from '@/components/admin/StatusIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { icuBeds, wards } from '@/data/adminMockData';
import { BedDouble, MapPin, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BedManagement() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ICU Bed & Ward Management</h1>
          <p className="text-muted-foreground mt-1">
            Visual bed mapping and ward occupancy monitoring
          </p>
        </div>

        {/* Ward Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {wards.map((ward) => (
            <Card key={ward.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {ward.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Beds</span>
                    <span className="font-semibold">{ward.totalBeds}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Occupied</span>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                      {ward.occupied}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Free</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      {ward.free}
                    </Badge>
                  </div>
                  {ward.maintenance > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Maintenance</span>
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
                        {ward.maintenance}
                      </Badge>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {((ward.occupied / ward.totalBeds) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bed Management Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Beds</TabsTrigger>
            <TabsTrigger value="CICU">Cardiac ICU</TabsTrigger>
            <TabsTrigger value="SICU">Surgical ICU</TabsTrigger>
            <TabsTrigger value="RICU">Respiratory ICU</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <BedTable beds={icuBeds} />
          </TabsContent>

          <TabsContent value="CICU" className="space-y-4">
            <BedTable beds={icuBeds.filter(bed => bed.ward === 'CICU')} />
          </TabsContent>

          <TabsContent value="SICU" className="space-y-4">
            <BedTable beds={icuBeds.filter(bed => bed.ward === 'SICU')} />
          </TabsContent>

          <TabsContent value="RICU" className="space-y-4">
            <BedTable beds={icuBeds.filter(bed => bed.ward === 'RICU')} />
          </TabsContent>
        </Tabs>

        {/* Visual Bed Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Visual Bed Map
            </CardTitle>
            <CardDescription>Interactive view of all ICU beds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {wards.map((ward) => (
                <div key={ward.id} className="space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {ward.name}
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {icuBeds
                      .filter(bed => bed.ward === ward.id)
                      .map((bed) => (
                        <div
                          key={bed.bedId}
                          className={cn(
                            'relative p-3 rounded-lg border-2 text-center cursor-pointer transition-all hover:shadow-md',
                            bed.status === 'Occupied' && 'bg-blue-500/10 border-blue-500/30',
                            bed.status === 'Free' && 'bg-green-500/10 border-green-500/30',
                            bed.status === 'Maintenance' && 'bg-orange-500/10 border-orange-500/30'
                          )}
                          title={`${bed.bedId} - ${bed.status}${bed.patientId ? ` - ${bed.patientId}` : ''}`}
                        >
                          <BedDouble className={cn(
                            'h-5 w-5 mx-auto mb-1',
                            bed.status === 'Occupied' && 'text-blue-600',
                            bed.status === 'Free' && 'text-green-600',
                            bed.status === 'Maintenance' && 'text-orange-600'
                          )} />
                          <p className="text-xs font-medium">{bed.bedId.split('-')[1]}</p>
                          {bed.deviceStatus === 'Offline' && (
                            <Activity className="h-3 w-3 text-red-500 absolute top-1 right-1" />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-blue-500/20 border-2 border-blue-500/30" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-500/20 border-2 border-green-500/30" />
                <span className="text-sm text-muted-foreground">Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-orange-500/20 border-2 border-orange-500/30" />
                <span className="text-sm text-muted-foreground">Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">Device Offline</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

function BedTable({ beds }: { beds: typeof icuBeds }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bed Details</CardTitle>
        <CardDescription>Comprehensive bed status and patient mapping</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bed ID</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Device Status</TableHead>
              <TableHead>Last Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beds.map((bed) => (
              <TableRow key={bed.bedId}>
                <TableCell className="font-medium">{bed.bedId}</TableCell>
                <TableCell>{bed.wardName}</TableCell>
                <TableCell>
                  <StatusIndicator status={bed.status as any} />
                </TableCell>
                <TableCell>
                  {bed.patientId ? (
                    <span className="font-mono text-sm">{bed.patientId}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusIndicator status={bed.deviceStatus as any} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {bed.lastUpdate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
