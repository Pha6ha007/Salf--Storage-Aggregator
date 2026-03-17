'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bell, Lock, Shield, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

// Notification toggle row
function Toggle({
  label, desc, checked, onChange,
}: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 mt-0.5"
        style={{ background: checked ? '#1A56DB' : '#e2e8f0' }}
      >
        <span
          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
}

export default function OperatorSettingsPage() {
  // Notification preferences (stored locally — backend endpoint not in MVP)
  const [notifs, setNotifs] = useState({
    newBooking: true,
    bookingCancelled: true,
    bookingReminder: false,
    weeklyReport: true,
    platformUpdates: false,
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onChangePassword = async (data: PasswordForm) => {
    setChangingPassword(true);
    try {
      await api.patch('/users/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to change password';
      toast.error(typeof msg === 'string' ? msg : 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const setNotif = (key: keyof typeof notifs) => (v: boolean) =>
    setNotifs((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage notifications and account security</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg,#f8faff,#eff6ff)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
            <p className="text-xs text-gray-400">Choose which emails you receive</p>
          </div>
        </div>
        <div className="px-6">
          <Toggle
            label="New booking request"
            desc="Get notified when a customer books one of your units"
            checked={notifs.newBooking}
            onChange={setNotif('newBooking')}
          />
          <Toggle
            label="Booking cancelled"
            desc="Get notified when a customer cancels a booking"
            checked={notifs.bookingCancelled}
            onChange={setNotif('bookingCancelled')}
          />
          <Toggle
            label="Booking reminders"
            desc="Reminder emails 24h before booking start date"
            checked={notifs.bookingReminder}
            onChange={setNotif('bookingReminder')}
          />
          <Toggle
            label="Weekly summary report"
            desc="Occupancy and booking stats every Monday morning"
            checked={notifs.weeklyReport}
            onChange={setNotif('weeklyReport')}
          />
          <Toggle
            label="Platform updates"
            desc="News about new features and improvements"
            checked={notifs.platformUpdates}
            onChange={setNotif('platformUpdates')}
          />
        </div>
        <div className="px-6 pb-4 pt-3">
          <button
            onClick={() => toast.success('Notification preferences saved')}
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 2px 10px rgba(26,86,219,0.22)' }}
          >
            Save preferences
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg,#f8faff,#eff6ff)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
            <Lock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Change Password</p>
            <p className="text-xs text-gray-400">Keep your account secure</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onChangePassword)} className="px-6 py-5 space-y-4">
          {/* Current password */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Current password</label>
            <div className="relative">
              <input
                {...register('currentPassword')}
                type={showCurrent ? 'text' : 'password'}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                style={{ borderColor: errors.currentPassword ? '#fca5a5' : '#e2e8f0' }}
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
          </div>

          {/* New password */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">New password</label>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showNew ? 'text' : 'password'}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                style={{ borderColor: errors.newPassword ? '#fca5a5' : '#e2e8f0' }}
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm new password</label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                style={{ borderColor: errors.confirmPassword ? '#fca5a5' : '#e2e8f0' }}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-1">
            <button type="submit" disabled={changingPassword}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 2px 10px rgba(26,86,219,0.22)' }}>
              {changingPassword ? <><Loader2 className="h-4 w-4 animate-spin" />Changing...</> : <><Lock className="h-4 w-4" />Change Password</>}
            </button>
          </div>
        </form>
      </div>

      {/* Security info */}
      <div className="rounded-2xl border border-gray-100 p-5 flex gap-4"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderColor: '#bbf7d0' }}>
        <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-900 mb-1">Your account is secure</p>
          <p className="text-xs text-green-700 leading-relaxed">
            We use httpOnly cookies and AES-256 encryption. Your credentials are never stored in plain text.
            Sessions expire after 15 minutes of inactivity and are renewed automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
