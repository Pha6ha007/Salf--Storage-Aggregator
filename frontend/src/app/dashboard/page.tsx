'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package, Heart, User, Calendar, MapPin, Settings, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { bookingsApi } from '@/lib/api/bookings';
import { favoritesApi } from '@/lib/api/favorites';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect operators to their dashboard
  useEffect(() => {
    if (!authLoading && user?.role === 'operator') {
      router.push('/operator/dashboard');
    }
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.list(),
    enabled: !!user,
  });

  const { data: favoritesData } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list(),
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user || user.role === 'operator') return null;

  const bookingsArray = Array.isArray(bookings) ? bookings : (bookings as any).data ?? [];
  const activeBookings = bookingsArray.filter((b: any) =>
    ['pending', 'confirmed'].includes(b.status)
  ).length;
  const favoritesCount = favoritesData?.pagination?.total ?? 0;

  const stats = [
    {
      title: 'Active Bookings',
      value: activeBookings.toString(),
      icon: Package,
      href: '/bookings',
      color: 'bg-blue-500',
    },
    {
      title: 'Favorites',
      value: favoritesCount.toString(),
      icon: Heart,
      href: '/favorites',
      color: 'bg-rose-500',
    },
    {
      title: 'Profile',
      value: 'View',
      icon: User,
      href: '/profile',
      color: 'bg-purple-500',
    },
  ];

  const quickLinks = [
    { title: 'Find Storage', description: 'Search for storage units near you', href: '/catalog', icon: MapPin, color: 'text-blue-600' },
    { title: 'My Bookings', description: 'View and manage your bookings', href: '/bookings', icon: Calendar, color: 'text-green-600' },
    { title: 'Favorites', description: 'View your saved warehouses', href: '/favorites', icon: Heart, color: 'text-rose-600' },
    { title: 'Settings', description: 'Update your profile', href: '/profile', icon: Settings, color: 'text-gray-600' },
  ];

  const recentBookings = bookingsArray.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user.firstName || user.email}!
          </h1>
          <p className="text-text-muted">Manage your storage bookings and find new storage solutions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href} className="glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.title} href={link.href} className="glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-200 group">
                  <Icon className={`w-8 h-8 ${link.color} mb-3`} />
                  <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">{link.title}</h3>
                  <p className="text-sm text-text-muted">{link.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text-primary">Recent Bookings</h2>
            <Link href="/bookings" className="text-sm text-primary-600 hover:underline">View all →</Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-text-muted">No bookings yet.</p>
              <Link href="/catalog" className="text-primary-600 text-sm hover:underline mt-2 inline-block">Browse storage →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b: any) => (
                <Link key={b.id} href={`/bookings/${b.id}`} className="flex items-center gap-4 p-4 bg-surface rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">
                      {b.box?.warehouse?.name ?? 'Storage Unit'}
                    </p>
                    <p className="text-sm text-text-muted">
                      Box {b.box?.boxNumber} · {b.startDate ? new Date(b.startDate).toLocaleDateString('en-AE') : ''}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    b.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {b.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
