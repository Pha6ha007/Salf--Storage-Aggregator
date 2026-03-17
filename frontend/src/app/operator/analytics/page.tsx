'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar, Building2 } from 'lucide-react';
import { operatorsApi } from '@/lib/api/operators';

function MetricCard({
  title, value, icon: Icon, color, bg, suffix,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
  suffix?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900"
        style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: '-0.02em' }}>
        {value}
      </p>
      {suffix && <p className="text-xs text-gray-400 mt-1">{suffix}</p>}
    </div>
  );
}

export default function OperatorAnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['operatorStats'],
    queryFn: () => operatorsApi.getStats(),
  });

  // Backend returns snake_case keys
  const s = (stats as any)?.data ?? stats ?? {};

  const occupancyRate = s.total_boxes > 0
    ? Math.round((s.occupied_boxes / s.total_boxes) * 100)
    : 0;

  const metrics = [
    {
      title: 'Total Warehouses',
      value: s.total_warehouses ?? 0,
      suffix: `${s.active_warehouses ?? 0} active`,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Storage Units',
      value: s.total_boxes ?? 0,
      suffix: `${s.available_boxes ?? 0} available`,
      icon: Package,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Active Bookings',
      value: s.active_bookings ?? 0,
      suffix: `${s.pending_bookings ?? 0} pending confirmation`,
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Bookings',
      value: s.total_bookings ?? 0,
      suffix: 'all time',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Avg Rating',
      value: s.average_rating != null ? Number(s.average_rating).toFixed(1) : '—',
      suffix: 'across all warehouses',
      icon: BarChart3,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      suffix: `${s.occupied_boxes ?? 0} of ${s.total_boxes ?? 0} units occupied`,
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your business performance</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.title} {...m} />
          ))}
        </div>
      )}

      {/* Occupancy bar */}
      {!isLoading && s.total_boxes > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Unit Occupancy</h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, occupancyRate)}%`,
                  background: occupancyRate > 80
                    ? 'linear-gradient(90deg,#10b981,#059669)'
                    : occupancyRate > 50
                    ? 'linear-gradient(90deg,#3b82f6,#1d4ed8)'
                    : 'linear-gradient(90deg,#f59e0b,#d97706)',
                }}
              />
            </div>
            <span className="text-lg font-bold text-gray-900 w-14 text-right"
              style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>
              {occupancyRate}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mt-4">
            {[
              { label: 'Available', value: s.available_boxes ?? 0, color: '#3b82f6' },
              { label: 'Occupied', value: s.occupied_boxes ?? 0, color: '#10b981' },
              { label: 'Total', value: s.total_boxes ?? 0, color: '#6366f1' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl p-3 bg-gray-50">
                <p className="text-xl font-bold" style={{ color, fontFamily: "'DM Serif Display',Georgia,serif" }}>
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note about revenue */}
      {!isLoading && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Revenue tracking</strong> is planned for the Growth plan launch (Q3 2026).
            Currently payments are settled directly between you and your customers.
          </p>
        </div>
      )}
    </div>
  );
}
