'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Package,
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { operatorsApi } from '@/lib/api/operators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-text-muted" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
        )}
        {trend && (
          <div
            className={`text-xs mt-2 flex items-center gap-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 ${!trend.isPositive && 'rotate-180'}`}
            />
            {Math.abs(trend.value)}% vs last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OperatorDashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['operatorStats'],
    queryFn: () => operatorsApi.getStats(),
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-text-secondary">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6 flex items-center gap-3 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load dashboard statistics</p>
        </CardContent>
      </Card>
    );
  }

  const statsData = stats?.data;

  const occupancyRate = statsData?.total_boxes
    ? Math.round((statsData.occupied_boxes / statsData.total_boxes) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-2 text-text-secondary">
          Overview of your warehouses and bookings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Warehouses"
          value={statsData?.total_warehouses || 0}
          subtitle={`${statsData?.active_warehouses || 0} active`}
          icon={Building2}
        />
        <StatCard
          title="Total Boxes"
          value={statsData?.total_boxes || 0}
          subtitle={`${occupancyRate}% occupied`}
          icon={Package}
        />
        <StatCard
          title="Active Bookings"
          value={statsData?.active_bookings || 0}
          subtitle={`${statsData?.pending_bookings || 0} pending`}
          icon={Calendar}
        />
        <StatCard
          title="Monthly Revenue"
          value={`${(statsData?.monthly_revenue || 0).toLocaleString()} AED`}
          icon={TrendingUp}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/operator/warehouses/new"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-text-primary">Add Warehouse</p>
                <p className="text-xs text-text-secondary">
                  Create a new storage facility
                </p>
              </div>
            </a>
            <a
              href="/operator/bookings?status=pending"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-text-primary">
                  Pending Bookings
                </p>
                <p className="text-xs text-text-secondary">
                  {statsData?.pending_bookings || 0} awaiting confirmation
                </p>
              </div>
            </a>
            <a
              href="/operator/analytics"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-text-primary">View Analytics</p>
                <p className="text-xs text-text-secondary">
                  Track performance metrics
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary text-center py-8">
            Activity log coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
