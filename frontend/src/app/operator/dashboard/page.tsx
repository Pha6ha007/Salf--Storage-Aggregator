'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Package,
  TrendingUp,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { operatorsApi } from '@/lib/api/operators';
import { operatorBookingsApi } from '@/lib/api/operator-bookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accent?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: accent ? 'linear-gradient(135deg,#eff6ff,#dbeafe)' : '#f8fafc' }}>
          <Icon className={`h-4 w-4 ${accent ? 'text-blue-600' : 'text-gray-400'}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1"
        style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: '-0.02em' }}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   color: '#d97706', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#059669', icon: CheckCircle },
  completed: { label: 'Completed', color: '#6366f1', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#dc2626', icon: XCircle },
  expired:   { label: 'Expired',   color: '#9ca3af', icon: XCircle },
};

export default function OperatorDashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['operatorStats'],
    queryFn: () => operatorsApi.getStats(),
  });

  const { data: recentData } = useQuery({
    queryKey: ['operatorRecentBookings'],
    queryFn: () => operatorBookingsApi.list({ page: 1, per_page: 5 }),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Skeleton */}
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-center gap-3 text-red-600">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Failed to load dashboard statistics. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const statsData = (stats as any)?.data ?? stats;
  const occupancyRate = statsData?.total_boxes
    ? Math.round((statsData.occupied_boxes / statsData.total_boxes) * 100)
    : 0;

  const recentBookings = recentData?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your warehouses and bookings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Warehouses"
          value={statsData?.total_warehouses || 0}
          subtitle={`${statsData?.active_warehouses || 0} active`}
          icon={Building2}
          accent
        />
        <StatCard
          title="Total Units"
          value={statsData?.total_boxes || 0}
          subtitle={`${occupancyRate}% occupied`}
          icon={Package}
          accent
        />
        <StatCard
          title="Active Bookings"
          value={statsData?.active_bookings || 0}
          subtitle={`${statsData?.pending_bookings || 0} pending`}
          icon={Calendar}
          accent={!!statsData?.pending_bookings}
        />
        <StatCard
          title="Monthly Revenue"
          value={`${(statsData?.monthly_revenue || 0).toLocaleString()} AED`}
          icon={TrendingUp}
          accent
        />
      </div>

      {/* Pending alert */}
      {(statsData?.pending_bookings || 0) > 0 && (
        <Link href="/operator/bookings?status=pending"
          className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', borderColor: '#fde68a' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {statsData.pending_bookings} booking{statsData.pending_bookings > 1 ? 's' : ''} awaiting your confirmation
              </p>
              <p className="text-xs text-amber-700">Respond within 24h to avoid cancellation</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-600 shrink-0" />
        </Link>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Bookings</h2>
            <Link href="/operator/bookings"
              className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <Calendar className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">No bookings yet</p>
              <p className="text-xs text-gray-400 mt-1">Bookings will appear here once customers start reserving your units.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentBookings.map((booking) => {
                const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const customerName = booking.user
                  ? `${booking.user.firstName ?? ''} ${booking.user.lastName ?? ''}`.trim() || booking.user.email
                  : 'Customer';
                return (
                  <Link key={booking.id} href={`/operator/bookings`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{customerName}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {booking.warehouse?.name ?? ''} · Unit {booking.box?.boxNumber ?? booking.box?.id ?? ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusIcon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                      <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: '/operator/warehouses/new', icon: Building2, label: 'Add Warehouse', desc: 'List a new facility' },
              { href: '/operator/bookings?status=pending', icon: Calendar, label: 'Pending Bookings', desc: `${statsData?.pending_bookings || 0} to confirm` },
              { href: '/operator/analytics', icon: TrendingUp, label: 'View Analytics', desc: 'Performance metrics' },
              { href: '/operator/profile', icon: Package, label: 'Edit Profile', desc: 'Business information' },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
