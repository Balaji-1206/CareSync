import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { clearAuth, getAuth } from '@/hooks/use-auth';
import { useSidebar } from '@/contexts/SidebarContext';
import { api } from '@/lib/api';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const { isExpanded } = useSidebar();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      if (auth?.token) {
        await api.logout(auth.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar onLogout={handleLogout} />
      <main className={`transition-all duration-300 ${isExpanded ? 'lg:pl-64' : 'lg:pl-[70px]'}`}>
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
