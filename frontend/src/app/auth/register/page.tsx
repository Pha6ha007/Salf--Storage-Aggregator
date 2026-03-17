'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import type { ApiErrorResponse } from '@/types/api-error';
import { Loader2, AlertCircle, Package, Eye, EyeOff, Users, Building2 } from 'lucide-react';

function calcStrength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(p)) s++;
  if (s <= 3) return { strength: 'weak' as const, score: s };
  if (s <= 5) return { strength: 'medium' as const, score: s };
  return { strength: 'strong' as const, score: s };
}

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Email is required').email('Enter a valid email').max(255),
  phone: z.string().min(1, 'Phone number is required').regex(/^\+\d{10,15}$/, 'Format: +971501234567'),
  role: z.enum(['user', 'operator']),
  password: z.string().min(8, 'At least 8 characters').max(128)
    .regex(/[A-Z]/, 'Must contain uppercase').regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain a digit').regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Must contain special character'),
  password_confirmation: z.string().min(1, 'Confirm your password'),
  agree_to_terms: z.boolean().refine(v => v === true, { message: 'You must agree to the Terms of Service' }),
  agree_to_privacy: z.boolean().refine(v => v === true, { message: 'You must agree to the Privacy Policy' }),
}).refine(d => d.password === d.password_confirmation, { message: 'Passwords do not match', path: ['password_confirmation'] });

type FormData = z.infer<typeof schema>;

const inputCls = (hasErr: boolean) =>
  `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${hasErr ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register: reg, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'user', agree_to_terms: false, agree_to_privacy: false },
  });

  if (isAuthenticated) { router.replace('/'); return null; }

  const password = watch('password');
  const strength = password ? calcStrength(password) : null;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await registerUser(data);
      router.push('/');
    } catch (error) {
      const e = error as ApiErrorResponse;
      const code = e?.response?.data?.error?.code;
      const msg = e?.response?.data?.error?.message;
      const details = e?.response?.data?.error?.details;
      if (code === 'EMAIL_ALREADY_EXISTS') setApiError('This email is already registered.');
      else if (code === 'RATE_LIMIT_EXCEEDED') setApiError('Too many attempts. Please try again later.');
      else if (code === 'VALIDATION_ERROR' && details) {
        const first = Object.values(details)[0];
        setApiError((Array.isArray(first) ? first[0] : msg) || 'Validation error');
      } else setApiError(msg || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const strengthColor = strength?.strength === 'strong' ? '#10b981' : strength?.strength === 'medium' ? '#f59e0b' : '#ef4444';
  const strengthLabel = strength?.strength === 'strong' ? 'Strong' : strength?.strength === 'medium' ? 'Medium' : 'Weak';

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060E1E 0%, #0f2a5c 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
        </div>
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Package className="h-7 w-7 text-amber-400" />
            <span className="text-white font-bold text-lg">StorageCompare.ae</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              Join the UAE's<br />
              <span style={{ color: '#FBBF24', fontStyle: 'italic' }}>Storage Platform</span>
            </h2>
            <p className="text-sm" style={{ color: 'rgba(147,197,253,0.7)' }}>
              Find storage or list your facility — everything in one place.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Users, title: 'Find Storage', desc: 'Browse 50+ verified facilities across UAE' },
              { icon: Building2, title: 'List Your Facility', desc: 'Reach thousands of storage seekers' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <Icon className="h-4 w-4" style={{ color: '#FBBF24' }} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-xs" style={{ color: 'rgba(147,197,253,0.6)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
          © 2026 StorageCompare.ae
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">StorageCompare.ae</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-400 text-sm mb-7">Find storage or list your facility</p>

          {apiError && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm mb-5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                {apiError}
                {apiError.includes('already registered') && (
                  <> <Link href="/auth/login" className="font-semibold underline">Sign in instead</Link></>
                )}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="register-form">
            {/* Account type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'user', label: 'Find Storage', icon: Users },
                  { value: 'operator', label: 'List My Facility', icon: Building2 },
                ].map(({ value, label, icon: Icon }) => {
                  const role = watch('role');
                  return (
                    <label key={value}
                      className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all"
                      style={{
                        border: role === value ? '2px solid #1A56DB' : '1px solid #e2e8f0',
                        background: role === value ? '#eff6ff' : 'white',
                      }}>
                      <input type="radio" value={value} {...reg('role')} className="sr-only" />
                      <Icon className="h-4 w-4" style={{ color: role === value ? '#1A56DB' : '#94a3b8' }} />
                      <span className="text-xs font-medium" style={{ color: role === value ? '#1A56DB' : '#374151' }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                <input {...reg('name')} type="text" placeholder="Ahmed Al-Rashid" autoComplete="name"
                  className={inputCls(!!errors.name)} data-testid="register-name-input" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone</label>
                <input {...reg('phone')} type="tel" placeholder="+971501234567"
                  className={inputCls(!!errors.phone)} data-testid="register-phone-input" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
              <input {...reg('email')} type="email" placeholder="you@example.com" autoComplete="email"
                className={inputCls(!!errors.email)} data-testid="register-email-input" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input {...reg('password')} type={showPass ? 'text' : 'password'}
                  placeholder="Create a strong password" autoComplete="new-password"
                  className={inputCls(!!errors.password) + ' pr-11'} data-testid="register-password-input" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && strength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-colors"
                        style={{ background: strength.score >= i * 2 ? strengthColor : '#e2e8f0' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel} password</p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input {...reg('password_confirmation')} type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password" autoComplete="new-password"
                  className={inputCls(!!errors.password_confirmation) + ' pr-11'}
                  data-testid="register-password-confirm-input" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" {...reg('agree_to_terms')} data-testid="register-terms-checkbox"
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                <span className="text-xs text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">Terms of Service</Link>
                </span>
              </label>
              {errors.agree_to_terms && <p className="text-xs text-red-500">{errors.agree_to_terms.message}</p>}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" {...reg('agree_to_privacy')} data-testid="register-privacy-checkbox"
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                <span className="text-xs text-gray-600">
                  I agree to the{' '}
                  <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
                </span>
              </label>
              {errors.agree_to_privacy && <p className="text-xs text-red-500">{errors.agree_to_privacy.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} data-testid="register-button"
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 4px 14px rgba(26,86,219,0.25)' }}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
