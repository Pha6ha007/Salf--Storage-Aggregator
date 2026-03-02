'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import type { ApiErrorResponse } from '@/types/api-error';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  AlertCircle,
  Package,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

// Password strength calculator
function calculatePasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;

  if (score <= 3) return { strength: 'weak', score };
  if (score <= 5) return { strength: 'medium', score };
  return { strength: 'strong', score };
}

// Validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be less than 128 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a digit')
      .regex(
        /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/,
        'Must contain a special character'
      ),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');
  const passwordStrength = password
    ? calculatePasswordStrength(password)
    : null;

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push('/auth/forgot-password');
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await authApi.resetPassword({
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setIsSuccess(true);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      const errorCode = apiError?.response?.data?.error?.code;
      const errorMessage = apiError?.response?.data?.error?.message;

      if (errorCode === 'INVALID_TOKEN' || errorCode === 'TOKEN_EXPIRED') {
        setApiError(
          'This reset link is invalid or has expired. Please request a new one.'
        );
      } else if (errorCode === 'VALIDATION_ERROR') {
        setApiError(errorMessage || 'Please check your password and try again');
      } else {
        setApiError(errorMessage || 'An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return null; // Redirecting...
  }

  if (isSuccess) {
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

          {/* Success Card */}
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-text-primary">
                Password Changed Successfully!
              </CardTitle>
              <CardDescription className="text-text-secondary">
                You can now sign in with your new password.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full bg-primary-600 hover:bg-primary-700">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <Lock className="h-8 w-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-text-primary">
              Set New Password
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Enter your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              data-testid="reset-password-form"
            >
              {/* API Error */}
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {apiError}
                    {apiError.includes('expired') && (
                      <>
                        {' '}
                        <Link
                          href="/auth/forgot-password"
                          className="font-semibold underline"
                        >
                          Request a new link
                        </Link>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Password Field with Strength Indicator */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-text-primary"
                >
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    autoFocus
                    disabled={isSubmitting}
                    data-testid="reset-password-password-input"
                    {...register('password')}
                    className={errors.password ? 'border-error-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && passwordStrength && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <div
                        className={`h-1 flex-1 rounded ${
                          passwordStrength.score >= 2
                            ? passwordStrength.strength === 'weak'
                              ? 'bg-error-500'
                              : passwordStrength.strength === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-success-500'
                            : 'bg-gray-200'
                        }`}
                      />
                      <div
                        className={`h-1 flex-1 rounded ${
                          passwordStrength.score >= 4
                            ? passwordStrength.strength === 'medium'
                              ? 'bg-amber-500'
                              : passwordStrength.strength === 'strong'
                              ? 'bg-success-500'
                              : 'bg-gray-200'
                            : 'bg-gray-200'
                        }`}
                      />
                      <div
                        className={`h-1 flex-1 rounded ${
                          passwordStrength.score >= 6
                            ? 'bg-success-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-xs ${
                        passwordStrength.strength === 'weak'
                          ? 'text-error-500'
                          : passwordStrength.strength === 'medium'
                          ? 'text-amber-600'
                          : 'text-success-600'
                      }`}
                    >
                      Password strength:{' '}
                      <span className="font-semibold capitalize">
                        {passwordStrength.strength}
                      </span>
                    </p>
                  </div>
                )}

                <p className="text-xs text-text-muted">
                  Must contain at least 8 characters, uppercase, lowercase, number
                  and special character
                </p>

                {errors.password && (
                  <p className="text-sm text-error-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password_confirmation"
                  className="text-sm font-medium text-text-primary"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    data-testid="reset-password-password-confirm-input"
                    {...register('password_confirmation')}
                    className={
                      errors.password_confirmation ? 'border-error-500 pr-10' : 'pr-10'
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-sm text-error-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700"
                disabled={isSubmitting}
                data-testid="reset-password-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
