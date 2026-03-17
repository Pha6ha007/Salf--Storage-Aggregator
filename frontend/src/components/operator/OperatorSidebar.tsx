'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Package,
  Settings,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/operator/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/operator/warehouses',
    icon: Building2,
    label: 'Warehouses',
  },
  {
    href: '/operator/bookings',
    icon: Package,
    label: 'Bookings',
  },
  {
    href: '/operator/analytics',
    icon: BarChart3,
    label: 'Analytics',
  },
  {
    href: '/operator/profile',
    icon: Settings,
    label: 'Profile',
  },
];

export function OperatorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-white">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">Operator Panel</h2>
        <p className="text-sm text-text-secondary mt-1">Manage your warehouses</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-600'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-primary-50 p-3">
          <p className="text-xs font-medium text-primary-700">Need help?</p>
          <p className="text-xs text-primary-600 mt-1">
            Contact support for assistance
          </p>
          <Link
            href="/contact"
            className="text-xs text-primary-600 font-medium hover:text-primary-700 mt-2 inline-block"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </aside>
  );
}
