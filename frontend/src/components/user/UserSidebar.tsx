'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Heart, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/bookings', icon: Package, label: 'My Bookings' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try { await logout(); window.location.href = '/'; } catch {}
  };

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-gray-100 bg-white"
      data-testid="user-sidebar">
      {/* User info */}
      {user && (
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#1A56DB)' }}>
              {(user.firstName?.[0] || user.email[0]).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName || user.email.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link key={href} href={href}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
              style={isActive
                ? { background: '#eff6ff', color: '#1A56DB' }
                : { color: '#64748b' }
              }>
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              {isActive && <ChevronRight className="h-3 w-3" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
