'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Heart, User, Calendar, MapPin, Settings, ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  // Mock user data - replace with actual auth context
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'user', // 'user' | 'operator' | 'admin'
  };

  // Redirect operators to their dashboard
  useEffect(() => {
    if (user.role === 'operator') {
      router.push('/operator/dashboard');
    }
  }, [user.role, router]);

  if (user.role === 'operator') {
    return null; // Will redirect
  }

  const stats = [
    {
      title: 'Active Bookings',
      value: '2',
      icon: Package,
      href: '/bookings',
      color: 'bg-blue-500',
    },
    {
      title: 'Favorites',
      value: '5',
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
    {
      title: 'Find Storage',
      description: 'Search for storage units near you',
      href: '/catalog',
      icon: MapPin,
      color: 'text-blue-600',
    },
    {
      title: 'My Bookings',
      description: 'View and manage your bookings',
      href: '/bookings',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Favorites',
      description: 'View your saved warehouses',
      href: '/favorites',
      icon: Heart,
      color: 'text-rose-600',
    },
    {
      title: 'Settings',
      description: 'Update your profile and preferences',
      href: '/profile',
      icon: Settings,
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-text-muted">
            Manage your storage bookings and find new storage solutions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-text-primary">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-200 group"
                >
                  <Icon className={`w-8 h-8 ${link.color} mb-3`} />
                  <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-text-muted">{link.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-surface rounded-lg">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">
                  New booking confirmed
                </p>
                <p className="text-sm text-text-muted">
                  Medium box at Dubai Storage - Starting March 1, 2024
                </p>
              </div>
              <span className="text-sm text-text-muted">2 days ago</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-surface rounded-lg">
              <div className="bg-rose-100 p-3 rounded-lg">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">
                  Added to favorites
                </p>
                <p className="text-sm text-text-muted">
                  Premium Storage JLT - 24/7 Access
                </p>
              </div>
              <span className="text-sm text-text-muted">5 days ago</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-surface rounded-lg">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">
                  Booking completed
                </p>
                <p className="text-sm text-text-muted">
                  Small box at Marina Storage - 1 month rental
                </p>
              </div>
              <span className="text-sm text-text-muted">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
