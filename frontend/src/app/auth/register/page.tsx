'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import type { ApiErrorResponse } from '@/types/api-error';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Package, Eye, EyeOff } from 'lucide-react';

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
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email')
      .max(255, 'Email must be less than 255 characters'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^\+\d{10,15}$/,
        'Enter a valid phone number (e.g. +971501234567)'
      ),
    role: z.enum(['user', 'operator']).default('user'),
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
    agree_to_terms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service' }),
    }),
    agree_to_privacy: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Privacy Policy' }),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
      agree_to_terms: false,
      agree_to_privacy: false,
    },
  });

  // If already authenticated, redirect
  if (isAuthenticated) {
    router.replace('/');
    return null;
  }

  const password = watch('password');
  const passwordStrength = password
    ? calculatePasswordStrength(password)
    : null;

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      await registerUser(data);
      // Redirect to home after successful registration
      router.push('/');
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      const errorCode = apiError?.response?.data?.error?.code;
      const errorMessage = apiError?.response?.data?.error?.message;
      const errorDetails = apiError?.response?.data?.error?.details;

      if (errorCode === 'EMAIL_ALREADY_EXISTS') {
        setApiError(
          'This email is already registered. Would you like to sign in instead?'
        );
      } else if (errorCode === 'RATE_LIMIT_EXCEEDED') {
        setApiError('Too many registration attempts. Please try again later.');
      } else if (errorCode === 'VALIDATION_ERROR' && errorDetails) {
        // Show first validation error
        const firstError = Object.values(errorDetails)[0];
        setApiError(Array.isArray(firstError) ? firstError[0] : errorMessage);
      } else {
        setApiError(errorMessage || 'An error occurred. Please try again.');
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
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center text-text-secondary">
              Find the perfect storage space in UAE
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              data-testid="register-form"
            >
              {/* API Error */}
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {apiError}
                    {apiError.includes('sign in instead') && (
                      <>
                        {' '}
                        <Link
                          href="/auth/login"
                          className="font-semibold underline"
                        >
                          Sign in here
                        </Link>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-text-primary"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ahmed Al-Rashid"
                  autoComplete="name"
                  disabled={isSubmitting}
                  data-testid="register-name-input"
                  {...registerField('name')}
                  className={errors.name ? 'border-error-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-error-500">{errors.name.message}</p>
                )}
              </div>

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
                  disabled={isSubmitting}
                  data-testid="register-email-input"
                  {...registerField('email')}
                  className={errors.email ? 'border-error-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-error-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-text-primary"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+971 50 123 4567"
                  autoComplete="tel"
                  disabled={isSubmitting}
                  data-testid="register-phone-input"
                  {...registerField('phone')}
                  className={errors.phone ? 'border-error-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-error-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Account Type
                </label>
                <div className="flex gap-4">
                  <label className="flex flex-1 items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-primary-50">
                    <input
                      type="radio"
                      value="user"
                      disabled={isSubmitting}
                      {...registerField('role')}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-text-primary">
                      Looking for storage
                    </span>
                  </label>
                  <label className="flex flex-1 items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-primary-50">
                    <input
                      type="radio"
                      value="operator"
                      disabled={isSubmitting}
                      {...registerField('role')}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-text-primary">
                      Storage operator
                    </span>
                  </label>
                </div>
              </div>

              {/* Password Field with Strength Indicator */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-text-primary"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    data-testid="register-password-input"
                    {...registerField('password')}
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
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    data-testid="register-password-confirm-input"
                    {...registerField('password_confirmation')}
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

              {/* Terms Checkbox */}
              <div className="space-y-2">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    data-testid="register-terms-checkbox"
                    {...registerField('agree_to_terms')}
                    className="mt-1 rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-secondary">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="font-medium text-primary-600 hover:text-primary-700"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>
                  </span>
                </label>
                {errors.agree_to_terms && (
                  <p className="text-sm text-error-500">
                    {errors.agree_to_terms.message}
                  </p>
                )}
              </div>

              {/* Privacy Checkbox */}
              <div className="space-y-2">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    data-testid="register-privacy-checkbox"
                    {...registerField('agree_to_privacy')}
                    className="mt-1 rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-text-secondary">
                    I agree to the{' '}
                    <Link
                      href="/privacy"
                      className="font-medium text-primary-600 hover:text-primary-700"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agree_to_privacy && (
                  <p className="text-sm text-error-500">
                    {errors.agree_to_privacy.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700"
                disabled={isSubmitting}
                data-testid="register-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
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
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
