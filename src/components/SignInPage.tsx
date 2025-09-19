import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { Droplets, LogIn, UserPlus, ArrowLeft, Mail, Phone, Lock } from 'lucide-react';

interface SignInPageProps {
  mode: 'signin' | 'signup';
  onSignIn: (user: { id: string; name: string; email: string }) => void;
  onNavigate: (page: 'landing' | 'signin' | 'signup' | 'dashboard' | 'results') => void;
}

export function SignInPage({ mode, onSignIn, onNavigate }: SignInPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (mode === 'signup' && !formData.name) {
      alert('Please enter your name');
      return;
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Mock authentication - in real app this would call an API
    const user = {
      id: '1',
      name: formData.name || 'User',
      email: formData.email
    };

    onSignIn(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">NeerSanchay</h1>
                <p className="text-sm text-muted-foreground">Central Ground Water Board</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              <ThemeToggle />
              <Button variant="ghost" onClick={() => onNavigate('landing')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Sign in to access your rainwater harvesting assessments'
                : 'Get started with your rainwater harvesting assessment'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center text-sm">
                {mode === 'signin' ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('signup')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign up here
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('signin')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign in here
                    </button>
                  </span>
                )}
              </div>
            </div>

            {mode === 'signup' && (
              <div className="mt-4 text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}