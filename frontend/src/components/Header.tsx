"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Package, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 select-none group">
      {/* Icon mark */}
      <div
        className="relative flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-transform group-hover:scale-105"
        style={{
          background: "linear-gradient(145deg, #1A56DB, #1d4ed8)",
          boxShadow: "0 3px 10px rgba(26,86,219,0.38)",
        }}
      >
        <Package className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
        {/* Gold accent dot */}
        <span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white"
          style={{ background: "#FBBF24" }}
        />
      </div>

      {/* Wordmark */}
      <div className="leading-none">
        <div className="flex items-baseline gap-0.5">
          <span
            className="text-[19px] font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.025em" }}
          >
            Storage<span style={{ color: "#1A56DB" }}>Compare</span>
          </span>
          <span
            className="text-[13px] font-bold"
            style={{ color: "#1A56DB", letterSpacing: "-0.01em", fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            .ae
          </span>
        </div>
        <span
          className="block text-[9px] font-semibold uppercase tracking-[0.2em] mt-0.5"
          style={{ color: "#94a3b8" }}
        >
          UAE Storage Marketplace
        </span>
      </div>
    </Link>
  );
}

// ─── Nav link ─────────────────────────────────────────────────────────────────
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group py-1"
    >
      {label}
      <span
        className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-200 group-hover:w-full"
      />
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const isOperatorOrAdmin = user?.role === "operator" || user?.role === "admin";
  const initials = (user?.firstName ?? user?.name ?? "U").charAt(0).toUpperCase();

  const navLinks = [
    { href: "/catalog", label: "Find Storage" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(0,0,0,0.04)",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Logo />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((l) => (
                <NavLink key={l.href} href={l.href} label={l.label} />
              ))}
            </nav>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-2">
              {isOperatorOrAdmin ? (
                <Link
                  href="/operator/dashboard"
                  className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-50"
                  style={{ color: "#1A56DB" }}
                >
                  Operator Panel
                </Link>
              ) : !isAuthenticated ? (
                <Link
                  href="/pricing"
                  className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-50"
                  style={{ color: "#1A56DB" }}
                >
                  For Operators
                </Link>
              ) : null}

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full pr-2 pl-0.5 py-0.5 hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: "linear-gradient(145deg,#1d4ed8,#1A56DB)" }}
                    >
                      {initials}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div
                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl py-1.5 z-20"
                        style={{
                          background: "white",
                          border: "1px solid rgba(0,0,0,0.08)",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        }}
                      >
                        {/* User info */}
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {user.firstName ?? user.name ?? user.email}
                          </p>
                          <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
                        </div>

                        {user.role === "admin" && (
                          <DropItem href="/admin" label="Admin Panel" onClick={() => setUserMenuOpen(false)} />
                        )}
                        {(user.role === "admin" || user.role === "operator") && (
                          <DropItem href="/operator/dashboard" label="Operator Panel" onClick={() => setUserMenuOpen(false)} />
                        )}
                        {user.role === "user" && (
                          <DropItem href="/dashboard" label="Dashboard" onClick={() => setUserMenuOpen(false)} />
                        )}
                        <div className="h-px bg-gray-100 my-1" />
                        <DropItem href="/profile" label="My Profile" onClick={() => setUserMenuOpen(false)} />
                        <DropItem href="/bookings" label="My Bookings" onClick={() => setUserMenuOpen(false)} />
                        <DropItem href="/favorites" label="Favorites" onClick={() => setUserMenuOpen(false)} />
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(145deg,#1d4ed8,#1A56DB)",
                      boxShadow: "0 2px 10px rgba(26,86,219,0.28)",
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && user ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "linear-gradient(145deg,#1d4ed8,#1A56DB)" }}
                >
                  {initials}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                  style={{ background: "linear-gradient(145deg,#1d4ed8,#1A56DB)" }}
                >
                  Login
                </Link>
              )}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div
            className="absolute top-0 right-0 h-full w-72 pt-16 flex flex-col"
            style={{
              background: "white",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
            }}
          >
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Menu</p>
              <nav className="space-y-0.5">
                {navLinks.map((l) => (
                  <MobileLink key={l.href} href={l.href} label={l.label} onClick={() => setMobileOpen(false)} />
                ))}
              </nav>

              <div className="h-px bg-gray-100 my-4" />

              {user?.role === "admin" && (
                <MobileLink href="/admin" label="Admin Panel" onClick={() => setMobileOpen(false)} highlight />
              )}
              {(user?.role === "admin" || user?.role === "operator") && (
                <MobileLink href="/operator/dashboard" label="Operator Panel" onClick={() => setMobileOpen(false)} highlight />
              )}
              {user?.role === "user" && (
                <MobileLink href="/dashboard" label="Dashboard" onClick={() => setMobileOpen(false)} highlight />
              )}
              {!isAuthenticated && (
                <MobileLink href="/pricing" label="For Operators →" onClick={() => setMobileOpen(false)} highlight />
              )}

              {isAuthenticated && user ? (
                <>
                  <div className="h-px bg-gray-100 my-4" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Account</p>
                  <MobileLink href="/profile" label="My Profile" onClick={() => setMobileOpen(false)} />
                  <MobileLink href="/bookings" label="My Bookings" onClick={() => setMobileOpen(false)} />
                  <MobileLink href="/favorites" label="Favorites" onClick={() => setMobileOpen(false)} />
                  <div className="h-px bg-gray-100 my-4" />
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center py-2.5 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(145deg,#1d4ed8,#1A56DB)" }}
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function DropItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {label}
    </Link>
  );
}

function MobileLink({
  href, label, onClick, highlight = false,
}: {
  href: string; label: string; onClick: () => void; highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2.5 text-sm font-medium rounded-xl transition-colors hover:bg-gray-50"
      style={{ color: highlight ? "#1A56DB" : "#374151" }}
    >
      {label}
    </Link>
  );
}
