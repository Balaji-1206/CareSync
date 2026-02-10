import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/doctor/Dashboard";
import Patients from "./pages/doctor/Patients";
import PatientDetail from "./pages/PatientDetail";
import AddDevice from "./pages/AddDevice";
import Beds from "./pages/doctor/Beds";
import Notifications from "./pages/doctor/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import NurseBeds from "./pages/nurse/NurseBeds";
import NursePatients from "./pages/nurse/NursePatients";
import NurseNotifications from "./pages/nurse/NurseNotifications";
import NurseSettings from "./pages/nurse/NurseSettings";
import DoctorSettings from "./pages/doctor/Settings";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BedManagement from "./pages/admin/BedManagement";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import AlertsMonitoring from "./pages/admin/AlertsMonitoring";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import AuditLogs from "./pages/admin/AuditLogs";
import Announcements from "./pages/admin/Announcements";
import AuthSuccess from "./pages/AuthSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/devices/add" element={<AddDevice />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          {/* Nurse-specific routes */}
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/nurse/patients" element={<NursePatients />} />
          <Route path="/nurse/beds" element={<NurseBeds />} />
          <Route path="/nurse/notifications" element={<NurseNotifications />} />
          <Route path="/nurse/settings" element={<NurseSettings />} />
          {/* Doctor-specific routes */}
          <Route path="/doctor/settings" element={<DoctorSettings />} />
          {/* Admin-specific routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/beds" element={<BedManagement />} />
          <Route path="/admin/system" element={<SystemMonitoring />} />
          <Route path="/admin/alerts" element={<AlertsMonitoring />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
          <Route path="/admin/audit" element={<AuditLogs />} />
          <Route path="/admin/announcements" element={<Announcements />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
