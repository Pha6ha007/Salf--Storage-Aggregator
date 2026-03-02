'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import type { ApiErrorResponse } from '@/types/api-error';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Package } from 'lucide-react';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/';

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // If already authenticated, redirect
  if (isAuthenticated) {
    router.replace(redirectTo);
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      await login(data);
      // Redirect to intended page or home
      router.push(redirectTo);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      const errorCode = apiError?.response?.data?.error?.code;
      const errorMessage = apiError?.response?.data?.error?.message;

      if (errorCode === 'INVALID_CREDENTIALS') {
        setApiError('Invalid email or password');
      } else if (errorCode === 'RATE_LIMIT_EXCEEDED') {
        setApiError('Too many login attempts. Please try again later.');
      } else if (errorCode === 'VALIDATION_ERROR') {
        setApiError(errorMessage || 'Please check your input and try again');
      } else {
        setApiError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Package className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-primary-600">
              StorageCompare.ae
            </span>
          </Link>
        </div>

        {/* Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold text-text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-text-secondary">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="login-form">
              {/* API Error */}
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-text-primary">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ahmed@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  data-testid="login-email-input"
                  {...registerField('email')}
                  className={errors.email ? 'border-error-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-error-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-text-primary">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  data-testid="login-password-input"
                  {...registerField('password')}
                  className={errors.password ? 'border-error-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-error-500">{errors.password.message}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700"
                disabled={isSubmitting}
                data-testid="login-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-text-muted">or</span>
              </div>
            </div>

            <p className="text-center text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Create one now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
