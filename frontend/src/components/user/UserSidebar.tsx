'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/bookings', icon: Package, label: 'Bookings' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside
      className="hidden md:flex w-64 flex-col border-r border-border bg-white"
      data-testid="user-sidebar"
    >
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

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

      <div className="border-t border-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
