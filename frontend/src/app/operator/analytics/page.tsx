'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar } from 'lucide-react';
import { operatorsApi } from '@/lib/api/operators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OperatorAnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['operatorStats'],
    queryFn: () => operatorsApi.getStatistics(),
  });

  const s = (stats as any)?.data ?? stats ?? {};

  const metrics = [
    {
      title: 'Total Warehouses',
      value: s.totalWarehouses ?? '—',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Bookings',
      value: s.activeBookings ?? s.confirmedBookings ?? '—',
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Bookings',
      value: s.totalBookings ?? '—',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: s.totalRevenue != null ? `AED ${Number(s.totalRevenue).toLocaleString()}` : '—',
      icon: DollarSign,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Total Reviews',
      value: s.totalReviews ?? '—',
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      title: 'Avg Rating',
      value: s.averageRating != null ? Number(s.averageRating).toFixed(1) : '—',
      icon: BarChart3,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
        <p className="mt-2 text-text-secondary">Overview of your business performance</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-text-secondary">
                    {m.title}
                  </CardTitle>
                  <div className={`${m.bg} p-2 rounded-lg`}>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-text-primary">{m.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Occupancy breakdown */}
      {s.occupancyRate != null && (
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 bg-primary-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Number(s.occupancyRate))}%` }}
                />
              </div>
              <span className="text-lg font-semibold text-text-primary w-16 text-right">
                {Number(s.occupancyRate).toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-text-primary">{s.availableBoxes ?? '—'}</p>
                <p className="text-text-secondary">Available</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">{s.occupiedBoxes ?? s.reservedBoxes ?? '—'}</p>
                <p className="text-text-secondary">Occupied</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">{s.totalBoxes ?? '—'}</p>
                <p className="text-text-secondary">Total Boxes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
