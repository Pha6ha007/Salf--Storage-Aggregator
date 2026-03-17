'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import type { ApiErrorResponse } from '@/types/api-error';
import { Loader2, AlertCircle, Eye, EyeOff, Package, Shield, Star, Zap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const PERKS = [
  { icon: Shield, text: 'Verified storage facilities only' },
  { icon: Star, text: 'Real reviews from verified renters' },
  { icon: Zap, text: 'Book in under 2 minutes' },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const redirectTo = searchParams.get('redirect') || '/';

  const { register: reg, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) { router.replace(redirectTo); return null; }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await login(data);
      router.push(redirectTo);
    } catch (error) {
      const e = error as ApiErrorResponse;
      const code = e?.response?.data?.error?.code;
      if (code === 'INVALID_CREDENTIALS') setApiError('Invalid email or password');
      else if (code === 'RATE_LIMIT_EXCEEDED') setApiError('Too many attempts. Please try again later.');
      else setApiError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (hasErr: boolean) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${hasErr ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060E1E 0%, #0f2a5c 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
        </div>
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Package className="h-7 w-7 text-amber-400" />
            <span className="text-white font-bold text-lg">StorageCompare.ae</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
            UAE&apos;s #1 Storage<br />
            <span style={{ color: '#FBBF24', fontStyle: 'italic' }}>Marketplace</span>
          </h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(147,197,253,0.7)' }}>
            50+ verified facilities across all 7 Emirates.
          </p>
          <ul className="space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(147,197,253,0.85)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: '#FBBF24' }} />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
          © 2026 StorageCompare.ae
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">StorageCompare.ae</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-7">Sign in to your account to continue</p>

          {apiError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="login-form">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
              <input {...reg('email')} type="email" placeholder="you@example.com" autoComplete="email"
                className={inputCls(!!errors.email)} data-testid="login-email-input" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input {...reg('password')} type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                  autoComplete="current-password" className={inputCls(!!errors.password) + ' pr-11'}
                  data-testid="login-password-input" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isSubmitting} data-testid="login-button"
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 4px 14px rgba(26,86,219,0.25)' }}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-blue-600 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
