import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, User, Stethoscope, Shield, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { api, googleOAuthUrl } from '@/lib/api';
import { setAuth } from '@/hooks/use-auth';

type Role = 'doctor' | 'nurse';

const roles = [
  { id: 'doctor' as Role, label: 'Doctor', icon: Stethoscope, description: 'Full patient access' },
  { id: 'nurse' as Role, label: 'Nurse', icon: User, description: 'Patient care access' },
];

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('doctor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.register(formData.name, formData.email, formData.password, selectedRole);
      const token = res.data!.token;
      const user = res.data!.user;
      setAuth({ role: user.role as any, email: user.email, token, name: user.name });
      if (user.role === 'nurse') {
        navigate('/nurse/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
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
            Join the Future of
            <br />
            <span className="text-sidebar-primary">Healthcare</span>
          </h2>

          <p className="text-sidebar-foreground/70 text-lg max-w-md mb-8">
            Create your account to access the IoT-powered ICU monitoring system 
            and provide better patient care.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent">
                <Shield className="h-5 w-5 text-sidebar-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Secure & HIPAA Compliant</p>
                <p className="text-xs text-sidebar-foreground/60">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart ICU</h1>
              <p className="text-xs text-muted-foreground">Health Monitor</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Create account</h2>
            <p className="text-muted-foreground mt-2">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Select your role</Label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                      selectedRole === role.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <role.icon
                      className={cn(
                        'h-6 w-6',
                        selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        selectedRole === role.id ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {role.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{role.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12"
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
              <Button type="submit" className="w-full h-12 text-base font-medium gap-2" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" className="w-full h-12 text-base font-medium gap-2" onClick={handleGoogle}>
                Continue with Google
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
