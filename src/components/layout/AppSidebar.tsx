import { useState, useMemo, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  Bell,
  Settings,
  LogOut,
  Activity,
  Menu,
  X,
  Heart,
  Server,
  AlertTriangle,
  FileBarChart,
  Shield,
  Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Bed Management', href: '/admin/beds', icon: BedDouble },
  { name: 'System Monitor', href: '/admin/system', icon: Server },
  { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle },
  { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
  { name: 'Audit Logs', href: '/admin/audit', icon: Shield },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const doctorNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'ICU Beds', href: '/beds', icon: BedDouble },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/doctor/settings', icon: Settings },
];

const nurseNavigation = [
  { name: 'Dashboard', href: '/nurse/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/nurse/patients', icon: Users },
  { name: 'ICU Beds', href: '/nurse/beds', icon: BedDouble },
  { name: 'Notifications', href: '/nurse/notifications', icon: Bell },
  { name: 'Settings', href: '/nurse/settings', icon: Settings },
];

import { getAuth } from '@/hooks/use-auth';

interface AppSidebarProps {
  onLogout: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { setIsExpanded } = useSidebar();
  const location = useLocation();
  const navigation = useMemo(() => {
    const auth = getAuth();
    if (auth?.role === 'nurse') return nurseNavigation;
    if (auth?.role === 'admin') return adminNavigation;
    return doctorNavigation;
  }, []);

  // Auto-collapse on scroll away, expand on hover
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let hoverTimeout: ReturnType<typeof setTimeout>;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isNavigating) return; // Don't expand during navigation
      
      const distanceFromLeft = e.clientX;
      if (distanceFromLeft < 100) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          setIsHovered(true);
        }, 150); // Add small delay before expanding
      } else if (distanceFromLeft > 120) {
        clearTimeout(hoverTimeout);
        setIsHovered(false);
      }
    };

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsHovered(false);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      clearTimeout(hoverTimeout);
    };
  }, [isNavigating]);

  const shouldExpand = isHovered && !isNavigating;

  // Sync expansion state to context
  useEffect(() => {
    setIsExpanded(shouldExpand);
  }, [shouldExpand, setIsExpanded]);

  const handleNavClick = () => {
    setIsMobileOpen(false);
    setIsHovered(false);
    setIsNavigating(true);
    
    // Reset navigation state after route change completes
    // We watch location changes instead of using a fixed timeout
  };

  // Clear navigating state when location changes
  useEffect(() => {
    setIsNavigating(false);
  }, [location.pathname]);

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
          <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">Smart ICU</span>
            <span className="text-xs text-sidebar-foreground/60">Health Monitor</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'animate-scale-in')} />
              {!isCollapsed && <span>{item.name}</span>}
              {item.name === 'Notifications' && !isCollapsed && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  3
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Live Status */}
      {!isCollapsed && (
        <div className="mx-3 mb-4 rounded-lg bg-sidebar-accent p-3">
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/80">
            <Activity className="h-4 w-4 text-status-normal" />
            <span>System Online</span>
            <span className="ml-auto h-2 w-2 rounded-full bg-status-normal animate-pulse" />
          </div>
        </div>
      )}

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-destructive'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground shadow-lg lg:hidden"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-screen flex-col bg-sidebar transition-all duration-300 lg:flex',
          shouldExpand ? 'w-64' : 'w-[70px]'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        <SidebarContent isCollapsed={!shouldExpand} />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar transition-transform duration-300 lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent isCollapsed={false} />
      </aside>
    </>
  );
}
