import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/doctor/Dashboard";
import Patients from "./pages/doctor/Patients";
import PatientDetail from "./pages/PatientDetail";
import Beds from "./pages/doctor/Beds";
import Notifications from "./pages/doctor/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import NurseBeds from "./pages/nurse/NurseBeds";
import NursePatients from "./pages/nurse/NursePatients";
import NurseNotifications from "./pages/nurse/NurseNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          {/* Nurse-specific routes */}
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/nurse/patients" element={<NursePatients />} />
          <Route path="/nurse/beds" element={<NurseBeds />} />
          <Route path="/nurse/notifications" element={<NurseNotifications />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
