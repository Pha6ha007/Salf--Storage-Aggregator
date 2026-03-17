"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { href: "/catalog", label: "Find Storage" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">
              StorageCompare.ae
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user?.role === "operator" ? (
              <Link href="/operator/dashboard" key="operator-dashboard">
                <Button variant="ghost" className="text-primary-600">
                  Dashboard
                </Button>
              </Link>
            ) : !isAuthenticated ? (
              <Link href="/operator/dashboard" key="operator-signup">
                <Button variant="ghost" className="text-primary-600">
                  For Operators
                </Button>
              </Link>
            ) : null}

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {(user?.firstName ?? user?.name ?? "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user.role === 'user' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">Favorites</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-text-primary">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && user ? (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {(user?.firstName ?? user?.name ?? "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Login
                </Button>
              </Link>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium text-text-primary hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr className="border-border" />
                  {user?.role === "operator" ? (
                    <Link
                      href="/operator/dashboard"
                      key="mobile-operator-dashboard"
                      className="text-base font-medium text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : !isAuthenticated ? (
                    <Link
                      href="/operator/dashboard"
                      key="mobile-operator-signup"
                      className="text-base font-medium text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      For Operators
                    </Link>
                  ) : null}
                  {isAuthenticated && user ? (
                    <>
                      {user.role === 'user' && (
                        <>
                          <Link
                            href="/dashboard"
                            className="text-base font-medium text-primary-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <hr className="border-border" />
                        </>
                      )}
                      <Link
                        href="/profile"
                        className="text-base font-medium text-text-primary hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/bookings"
                        className="text-base font-medium text-text-primary hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/favorites"
                        className="text-base font-medium text-text-primary hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Favorites
                      </Link>
                      <hr className="border-border" />
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="text-base font-medium text-red-600 text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/register"
                      className="text-base font-medium text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
