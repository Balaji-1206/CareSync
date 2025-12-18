import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { clearAuth } from '@/hooks/use-auth';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar onLogout={handleLogout} />
      <main className="lg:pl-[70px]">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
