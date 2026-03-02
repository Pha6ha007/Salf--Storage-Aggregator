'use client';

import { useState } from 'react';
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
import { Loader2, AlertCircle, Package, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      await authApi.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      const errorMessage = apiError?.response?.data?.error?.message;
      setApiError(errorMessage || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Check Your Email
              </CardTitle>
              <CardDescription className="text-text-secondary">
                If an account exists for <strong>{submittedEmail}</strong>, you
                will receive a password reset link shortly.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Please check your inbox and spam folder. The link will expire in
                  1 hour.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="w-full"
                >
                  Send Another Link
                </Button>
                <Link href="/auth/login" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-primary-600 hover:text-primary-700"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
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
              <Mail className="h-8 w-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-text-primary">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              data-testid="forgot-password-form"
            >
              {/* API Error */}
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-text-primary"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ahmed@example.com"
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                  data-testid="forgot-password-email-input"
                  {...register('email')}
                  className={errors.email ? 'border-error-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-error-500">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700"
                disabled={isSubmitting}
                data-testid="forgot-password-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>

              {/* Back to Sign In */}
              <Link href="/auth/login" className="block">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-primary-600 hover:text-primary-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
