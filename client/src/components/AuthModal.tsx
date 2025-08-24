import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '@/components/ui/notification';
import { z } from 'zod';
import { UserPlus, Loader2, Globe } from 'lucide-react';
import { SiEthereum } from 'react-icons/si';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useNotifications();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      // In the real implementation, this would be handled by Replit Auth
      // For now, we'll simulate the login process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess('Login successful!', 'Welcome back to SDG Impact Platform');
      onClose();
      loginForm.reset();
    } catch (error) {
      showError('Login failed', 'Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      // In the real implementation, this would be handled by Replit Auth
      // For now, we'll simulate the signup process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess('Account created successfully!', 'Welcome to SDG Impact Platform');
      onClose();
      signupForm.reset();
    } catch (error) {
      showError('Signup failed', 'Please try again or contact support');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    setIsLoading(true);
    try {
      if (typeof (window as any).ethereum !== 'undefined') {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          showSuccess('MetaMask connected!', 'Authenticating with Web3 credentials...');
          
          // Simulate Web3 authentication
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          showSuccess('Web3 authentication successful!', 'Welcome to SDG Impact Platform');
          onClose();
        }
      } else {
        showError('MetaMask not found', 'Please install MetaMask to use Web3 authentication');
      }
    } catch (error) {
      showError('MetaMask authentication failed', 'Please try again or use email login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplitAuth = () => {
    // Redirect to Replit Auth
    window.location.href = '/api/login';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-white/10 max-w-md" data-testid="auth-modal">
        <DialogHeader>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-white text-2xl" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              Join SDG Impact
            </DialogTitle>
            <p className="text-gray-400">Create an account to start making a difference</p>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-lg p-1 mb-6">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              data-testid="login-tab"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              data-testid="signup-tab"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  {...loginForm.register('email')}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                  placeholder="Enter your email"
                  data-testid="login-email-input"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                  placeholder="Enter your password"
                  data-testid="login-password-input"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
                data-testid="login-submit-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button 
                variant="link" 
                className="text-blue-400 hover:text-blue-300 text-sm"
                data-testid="forgot-password-button"
              >
                Forgot password?
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    {...signupForm.register('firstName')}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                    placeholder="First name"
                    data-testid="signup-firstname-input"
                  />
                  {signupForm.formState.errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    {...signupForm.register('lastName')}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                    placeholder="Last name"
                    data-testid="signup-lastname-input"
                  />
                  {signupForm.formState.errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  {...signupForm.register('email')}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                  placeholder="Enter your email"
                  data-testid="signup-email-input"
                />
                {signupForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  {...signupForm.register('password')}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                  placeholder="Create a password"
                  data-testid="signup-password-input"
                />
                {signupForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...signupForm.register('confirmPassword')}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                  placeholder="Confirm your password"
                  data-testid="signup-confirm-password-input"
                />
                {signupForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  {...signupForm.register('agreeToTerms')}
                  className="border-white/20"
                  data-testid="terms-checkbox"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-blue-400 hover:underline">
                    Terms of Service
                  </a>
                </Label>
              </div>
              {signupForm.formState.errors.agreeToTerms && (
                <p className="text-red-400 text-sm">{signupForm.formState.errors.agreeToTerms.message}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isLoading}
                data-testid="signup-submit-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Alternative Authentication Methods */}
        <div className="mt-6 pt-6 border-t border-white/20 space-y-3">
          <Button
            onClick={handleReplitAuth}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            disabled={isLoading}
            data-testid="replit-auth-button"
          >
            <Globe className="w-4 h-4 mr-2" />
            Continue with Replit
          </Button>

          <Button
            onClick={handleMetaMaskLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 transition-colors"
            disabled={isLoading}
            data-testid="metamask-auth-button"
          >
            <SiEthereum className="w-4 h-4 mr-2" />
            Sign in with MetaMask
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
