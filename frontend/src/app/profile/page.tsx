'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ApiErrorResponse } from '@/types/api-error';

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^\+\d{10,15}$/, 'Enter a valid phone number (e.g. +971501234567)'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Change password schema
const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[a-z]/, 'Must contain lowercase')
      .regex(/[0-9]/, 'Must contain number')
      .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Must contain special character'),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: 'Passwords do not match',
    path: ['new_password_confirmation'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorCode = error?.response?.data?.error?.code;
      const errorMessage = error?.response?.data?.error?.message;

      if (errorCode === 'PHONE_ALREADY_EXISTS') {
        toast.error('This phone number is already in use');
      } else {
        toast.error(errorMessage || 'Failed to update profile');
      }
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: usersApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
      resetPasswordForm();
      setApiError(null);
    },
    onError: (error: ApiErrorResponse) => {
      const errorCode = error?.response?.data?.error?.code;
      const errorMessage = error?.response?.data?.error?.message;

      if (errorCode === 'INVALID_CREDENTIALS') {
        setApiError('Current password is incorrect');
      } else if (errorCode === 'SAME_PASSWORD') {
        setApiError('New password must be different from current password');
      } else {
        setApiError(errorMessage || 'Failed to change password');
      }
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    setApiError(null);
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    setApiError(null);
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Profile Settings</h1>
        <p className="mt-2 text-text-secondary">
          Manage your account information and preferences
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4" data-testid="profile-form">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-text-primary">
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                {user?.is_email_verified && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-text-primary">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                data-testid="profile-name-input"
                {...registerProfile('name')}
                className={profileErrors.name ? 'border-error-500' : ''}
              />
              {profileErrors.name && (
                <p className="text-sm text-error-500">{profileErrors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-text-primary">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+971 50 123 4567"
                data-testid="profile-phone-input"
                {...registerProfile('phone')}
                className={profileErrors.phone ? 'border-error-500' : ''}
              />
              {profileErrors.phone && (
                <p className="text-sm text-error-500">{profileErrors.phone.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isProfileDirty || updateProfileMutation.isPending}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid="profile-save-button"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4" data-testid="change-password-form">
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="current_password" className="text-sm font-medium text-text-primary">
                Current Password
              </label>
              <Input
                id="current_password"
                type="password"
                {...registerPassword('current_password')}
                className={passwordErrors.current_password ? 'border-error-500' : ''}
              />
              {passwordErrors.current_password && (
                <p className="text-sm text-error-500">{passwordErrors.current_password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="new_password" className="text-sm font-medium text-text-primary">
                New Password
              </label>
              <Input
                id="new_password"
                type="password"
                {...registerPassword('new_password')}
                className={passwordErrors.new_password ? 'border-error-500' : ''}
              />
              {passwordErrors.new_password && (
                <p className="text-sm text-error-500">{passwordErrors.new_password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="new_password_confirmation" className="text-sm font-medium text-text-primary">
                Confirm New Password
              </label>
              <Input
                id="new_password_confirmation"
                type="password"
                {...registerPassword('new_password_confirmation')}
                className={passwordErrors.new_password_confirmation ? 'border-error-500' : ''}
              />
              {passwordErrors.new_password_confirmation && (
                <p className="text-sm text-error-500">{passwordErrors.new_password_confirmation.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="bg-primary-600 hover:bg-primary-700"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
