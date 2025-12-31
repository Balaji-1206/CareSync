import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { setAuth } from '@/hooks/use-auth';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const me = await api.me(token);
        const user = me.data.user;
        setAuth({ role: user.role as any, email: user.email, token, name: user.name });
        if (user.role === 'nurse') {
          navigate('/nurse/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch {
        navigate('/login');
      }
    })();
  }, [navigate, params]);

  return null;
}
