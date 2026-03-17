"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search, MapPin, Shield, Clock, ChevronRight,
  Sparkles, Star, CheckCircle, Building2, Users,
  ArrowRight, Package, Thermometer, Lock, Zap
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { WarehouseCard } from "@/components/WarehouseCard";
import { warehousesApi } from "@/lib/api/warehouses";

const EMIRATES = [
  { name: "Dubai", emoji: "🏙️" },
  { name: "Abu Dhabi", emoji: "🕌" },
  { name: "Sharjah", emoji: "🏛️" },
  { name: "Ajman", emoji: "⚓" },
  { name: "Ras Al Khaimah", emoji: "🏔️" },
  { name: "Fujairah", emoji: "🌊" },
];

const TRUST_STATS = [
  { value: "50+", label: "Storage Facilities" },
  { value: "7", label: "Emirates Covered" },
  { value: "AED 199", label: "Starting Price / Month" },
  { value: "24/7", label: "Access Available" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search & Filter",
    desc: "Enter your emirate or area, pick a unit size. See all verified facilities with real prices — no hidden fees.",
    icon: Search,
  },
  {
    step: "02",
    title: "Compare & Choose",
    desc: "Side-by-side prices, photos, amenities and verified reviews. Find the best value in minutes.",
    icon: Package,
  },
  {
    step: "03",
    title: "Book Instantly",
    desc: "Reserve online in 2 minutes. Get confirmation from the operator and move in on your schedule.",
    icon: CheckCircle,
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: "Verified Operators Only",
    desc: "Every storage facility is reviewed and verified before listing. Your belongings are safe.",
  },
  {
    icon: Thermometer,
    title: "Climate Control Options",
    desc: "Find temperature-controlled units for sensitive items — electronics, documents, artwork.",
  },
  {
    icon: Lock,
    title: "Secure & CCTV-Monitored",
    desc: "All listed facilities have 24/7 security cameras and access control systems.",
  },
  {
    icon: Zap,
    title: "Instant Online Booking",
    desc: "No phone calls, no waiting. Book your unit online and get same-day confirmation.",
  },
  {
    icon: Clock,
    title: "Flexible Contracts",
    desc: "Monthly rolling contracts. No long-term commitments. Cancel anytime with 30-day notice.",
  },
  {
    icon: Star,
    title: "Real User Reviews",
    desc: "Genuine reviews from verified renters. Make informed decisions based on real experiences.",
  },
];

const FOR_WHOM = [
  {
    audience: "Relocating Expats",
    pain: "Moving abroad or between cities? Don't leave your furniture behind or sell it cheap.",
    solution: "Store everything safely while you settle in — from AED 199/month.",
    cta: "Find Storage",
    href: "/catalog",
    emoji: "✈️",
  },
  {
    audience: "Business Owners",
    pain: "Running out of office space? Drowning in inventory, files or equipment?",
    solution: "Affordable commercial storage. Flexible access. Scale up or down as you need.",
    cta: "Browse Units",
    href: "/catalog",
    emoji: "🏢",
  },
  {
    audience: "Homeowners & Renters",
    pain: "Renovating? Downsizing? Got stuff you can't fit but can't throw away?",
    solution: "Secure, clean self-storage near you. Move in this week.",
    cta: "Search Near Me",
    href: "/catalog",
    emoji: "🏠",
  },
];

export default function Home() {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ["warehouses-featured"],
    queryFn: () => warehousesApi.list({ status: "active", sortBy: "rating", sortOrder: "desc", limit: 6, page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const featuredWarehouses = featuredData?.data ?? [];
  const totalWarehouses = (featuredData as any)?.meta?.total ?? (featuredData as any)?.pagination?.total ?? featuredWarehouses.length;

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Load fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'DM Serif Display', Georgia, serif; }
        .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-up { animation: fadeUp 0.7s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.25s; opacity: 0; }
        .delay-3 { animation-delay: 0.4s; opacity: 0; }
        .delay-4 { animation-delay: 0.55s; opacity: 0; }
        .grain::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.3;
        }
      `}</style>

      <Header />

      <main className="flex-grow font-body">

        {/* ─── HERO ─── */}
        <section className="relative bg-[#0A1628] text-white overflow-hidden grain">
          {/* Background mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="animate-fade-up delay-1 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                UAE&apos;s #1 Self-Storage Marketplace
              </div>

              {/* Headline */}
              <h1 className="animate-fade-up delay-2 font-display text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
                Find the Perfect
                <span className="block text-amber-400 italic">Storage Space</span>
                <span className="block text-3xl sm:text-4xl md:text-5xl text-blue-200 font-normal mt-2">
                  Across All 7 Emirates
                </span>
              </h1>

              {/* Sub */}
              <p className="animate-fade-up delay-3 text-lg sm:text-xl text-blue-100/80 mb-10 max-w-xl mx-auto leading-relaxed">
                Compare prices from 50+ verified storage facilities. Book online in 2 minutes.
                No hidden fees, flexible monthly contracts.
              </p>

              {/* Search */}
              <div className="animate-fade-up delay-4">
                <SearchBar variant="hero" />
              </div>

              {/* Quick emirate links */}
              <div className="animate-fade-up delay-4 mt-6 flex flex-wrap justify-center gap-2">
                {EMIRATES.map((e) => (
                  <Link
                    key={e.name}
                    href={`/catalog?emirate=${encodeURIComponent(e.name)}`}
                    className="text-sm text-blue-200 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-full px-3 py-1 transition-all"
                  >
                    {e.emoji} {e.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* ─── TRUST STATS ─── */}
        <section className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {TRUST_STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-4xl sm:text-5xl text-gray-900 mb-1">{value}</p>
                  <p className="text-sm text-gray-500 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOR WHOM ─── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Who It&apos;s For</p>
              <h2 className="font-display text-4xl sm:text-5xl text-gray-900">
                Storage for every situation
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {FOR_WHOM.map(({ audience, pain, solution, cta, href, emoji }) => (
                <div key={audience} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="text-4xl mb-5">{emoji}</div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">{audience}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{pain}</p>
                  <p className="text-gray-800 text-sm font-medium leading-relaxed mb-6">{solution}</p>
                  <Link
                    href={href}
                    className="mt-auto inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
              <h2 className="font-display text-4xl sm:text-5xl text-gray-900">
                From search to move-in<br />
                <span className="italic text-blue-700">in under 10 minutes</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
                <div key={step} className="relative">
                  <div className="flex items-start gap-5 md:flex-col md:items-center md:text-center">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 bg-[#0A1628] rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon className="h-7 w-7 text-amber-400" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-[#0A1628] text-xs font-bold rounded-full flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-900 transition-colors shadow-lg"
              >
                Start Searching Now <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── POPULAR EMIRATES ─── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-gray-900 text-center mb-10">Browse by Emirate</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {EMIRATES.map((e) => (
                <Link
                  key={e.name}
                  href={`/catalog?emirate=${encodeURIComponent(e.name)}`}
                  className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="text-2xl mb-2">{e.emoji}</div>
                  <p className="text-xs font-medium text-gray-700">{e.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURED WAREHOUSES ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">Top Rated</p>
                <h2 className="font-display text-4xl text-gray-900">Featured Storage</h2>
              </div>
              <Link
                href="/catalog"
                className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : featuredWarehouses.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredWarehouses.map((warehouse) => (
                    <WarehouseCard key={warehouse.id} warehouse={warehouse} />
                  ))}
                </div>
                <div className="text-center mt-10">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-xl hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    Browse All {totalWarehouses > 0 ? `${totalWarehouses}+` : ""} Facilities
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6">Be the first to list your storage facility in UAE</p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold px-6 py-3 rounded-xl"
                >
                  List Your Warehouse
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── WHY US ─── */}
        <section className="py-20 bg-[#0A1628] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Why StorageCompare</p>
              <h2 className="font-display text-4xl sm:text-5xl text-white">
                Every listing, verified.<br />
                <span className="italic text-blue-300">Every booking, protected.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_US.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-blue-200/70 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── AI BOX FINDER ─── */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </div>
            <h2 className="font-display text-4xl text-gray-900 mb-4">
              Not sure what size you need?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Describe your items and our AI tells you the exact unit size — and finds matching facilities near you.
            </p>
            <Link
              href="/ai/box-finder"
              className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-amber-200"
            >
              <Sparkles className="h-5 w-5" />
              Try AI Box Finder — It&apos;s Free
            </Link>
          </div>
        </section>

        {/* ─── OPERATOR CTA ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#0A1628] to-[#1a3a6b] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 rounded-full px-3 py-1 text-xs font-medium mb-5">
                  <Building2 className="h-3.5 w-3.5" />
                  For Storage Operators
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
                  Fill your empty units.<br />
                  <span className="italic text-amber-400">Start in 24 hours.</span>
                </h2>
                <p className="text-blue-200 mb-6 leading-relaxed">
                  List your storage facility for free. Reach thousands of active storage seekers
                  across UAE. No commissions on the first 3 months.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Free listing — forever", "Real-time booking management", "Operator dashboard with analytics", "Verified badge after review"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 bg-amber-400 text-[#0A1628] font-bold px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors"
                  >
                    List Your Warehouse <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 text-blue-200 border border-blue-400/30 px-6 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-4 shrink-0">
                {[
                  { icon: Users, value: "1,200+", label: "Monthly searches" },
                  { icon: Building2, value: "50+", label: "Active operators" },
                  { icon: Star, value: "4.6★", label: "Average rating" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="bg-white/10 rounded-xl px-6 py-4 text-center">
                    <Icon className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                    <p className="font-display text-2xl text-white">{value}</p>
                    <p className="text-xs text-blue-300">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
