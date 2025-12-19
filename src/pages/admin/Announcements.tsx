import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusIndicator } from '@/components/admin/StatusIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { announcements } from '@/data/adminMockData';
import { Megaphone, Plus, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Announcements() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Announcement',
    priority: 'Medium',
    targetAudience: 'All Users',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate creating announcement (frontend only)
    toast({
      title: 'Announcement Created',
      description: `${formData.title} has been broadcast to ${formData.targetAudience}.`,
    });

    // Reset form
    setFormData({
      title: '',
      message: '',
      type: 'Announcement',
      priority: 'Medium',
      targetAudience: 'All Users',
    });
    setShowForm(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-red-500/50 text-red-600 bg-red-500/10';
      case 'Medium':
        return 'border-yellow-500/50 text-yellow-600 bg-yellow-500/10';
      case 'Low':
        return 'border-blue-500/50 text-blue-600 bg-blue-500/10';
      default:
        return 'border-gray-500/50 text-gray-600 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Maintenance':
        return 'border-orange-500/50 text-orange-600 bg-orange-500/10';
      case 'System Update':
        return 'border-purple-500/50 text-purple-600 bg-purple-500/10';
      default:
        return 'border-blue-500/50 text-blue-600 bg-blue-500/10';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications & Announcements</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage system-wide announcements
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Total Announcements</p>
                <p className="text-3xl font-bold">{announcements.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {announcements.filter(a => a.status === 'Active').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold text-red-600">
                  {announcements.filter(a => a.priority === 'High').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-blue-600">
                  {announcements.filter(a => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(a.createdAt) > weekAgo;
                  }).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Announcement Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Create New Announcement
              </CardTitle>
              <CardDescription>Broadcast important messages to users</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter announcement title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Announcement">Announcement</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="System Update">System Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter announcement message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Users">All Users</SelectItem>
                        <SelectItem value="Doctors Only">Doctors Only</SelectItem>
                        <SelectItem value="Nurses Only">Nurses Only</SelectItem>
                        <SelectItem value="Admins Only">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Megaphone className="h-4 w-4 mr-2" />
                    Publish Announcement
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle>Announcement History</CardTitle>
            <CardDescription>View all system announcements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <Badge variant="outline" className={getTypeColor(announcement.type)}>
                        {announcement.type}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      <StatusIndicator status={announcement.status as any} />
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {announcement.targetAudience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                      <span>By: {announcement.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {announcement.status === 'Active' && (
                      <Button variant="outline" size="sm">
                        Archive
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
