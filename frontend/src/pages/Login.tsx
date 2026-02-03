import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setAuth } from '@/hooks/use-auth';
import { api, googleOAuthUrl } from '@/lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      const token = res.data!.token;
      const user = res.data!.user;
      setAuth({ role: user.role as any, email: user.email, token, name: user.name });
      
      // Verify token by calling me()
      try {
        const meResponse = await api.me(token);
        console.log('✅ Token verified:', meResponse.data?.user);
      } catch (meErr) {
        console.warn('Token verification failed:', meErr);
      }
      
      if (user.role === 'nurse') {
        navigate('/nurse/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogle = () => {
    window.location.href = googleOAuthUrl();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-sidebar-primary"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sidebar-primary">
              <Heart className="h-7 w-7 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-foreground">Smart ICU</h1>
              <p className="text-sm text-sidebar-foreground/60">Health Monitor</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-sidebar-foreground mb-4">
            Real-Time Patient
            <br />
            <span className="text-sidebar-primary">Health Monitoring</span>
          </h2>

          <p className="text-sidebar-foreground/70 text-lg max-w-md mb-8">
            IoT-powered remote ICU monitoring system for healthcare professionals. 
            Monitor vitals, receive alerts, and ensure patient safety from anywhere.
          </p>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-sidebar-primary">500+</p>
              <p className="text-sm text-sidebar-foreground/60">Patients Monitored</p>
            </div>
            <div className="h-12 w-px bg-sidebar-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-sidebar-primary">24/7</p>
              <p className="text-sm text-sidebar-foreground/60">Continuous Care</p>
            </div>
            <div className="h-12 w-px bg-sidebar-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-sidebar-primary">99.9%</p>
              <p className="text-sm text-sidebar-foreground/60">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-6 sm:p-8">

        <div className="w-full max-w-md rounded-2xl bg-background lg:bg-transparent p-6 lg:p-0 shadow-lg lg:shadow-none border lg:border-none">

          {/* Mobile Logo */}
          <div className="flex flex-col items-center text-center gap-3 mb-8 lg:hidden">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Smart ICU</h1>
<p className="text-sm text-muted-foreground">Health Monitor</p>

            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-14 text-base"

                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-14 text-base"

                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold gap-2 rounded-xl"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 text-base font-semibold gap-2 rounded-xl"
                onClick={handleGoogle}
              >
                Continue with Google
              </Button>
            </div>
          </form>

         <p className="mt-8 text-center text-sm text-muted-foreground">

            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
