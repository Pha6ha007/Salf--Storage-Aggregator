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
  { value: "AED 199", label: "Starting / Month" },
  { value: "24/7", label: "Access Available" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search & Filter",
    desc: "Enter your emirate or area, pick a unit size. See all verified facilities with real prices.",
    icon: Search,
  },
  {
    step: "02",
    title: "Compare & Choose",
    desc: "Side-by-side prices, photos, amenities and verified reviews. Best value in minutes.",
    icon: Package,
  },
  {
    step: "03",
    title: "Book Instantly",
    desc: "Reserve online in 2 minutes. Get confirmation and move in on your schedule.",
    icon: CheckCircle,
  },
];

const WHY_US = [
  { icon: Shield, title: "Verified Operators Only", desc: "Every facility reviewed before listing. Your belongings are safe." },
  { icon: Thermometer, title: "Climate Control Options", desc: "Temperature-controlled units for electronics, documents, artwork." },
  { icon: Lock, title: "24/7 CCTV Security", desc: "All listings have round-the-clock cameras and access control." },
  { icon: Zap, title: "Instant Online Booking", desc: "No phone calls. Book online, get same-day confirmation." },
  { icon: Clock, title: "Flexible Contracts", desc: "Monthly rolling. No long-term commitments. Cancel anytime." },
  { icon: Star, title: "Real User Reviews", desc: "Genuine reviews from verified renters only." },
];

const FOR_WHOM = [
  {
    audience: "Relocating Expats",
    pain: "Moving abroad? Don't sell your furniture cheap.",
    solution: "Store everything safely while you settle in — from AED 199/month.",
    cta: "Find Storage",
    href: "/catalog",
    emoji: "✈️",
    color: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-100",
  },
  {
    audience: "Business Owners",
    pain: "Running out of office space? Drowning in inventory?",
    solution: "Affordable commercial storage. Scale up or down as you need.",
    cta: "Browse Units",
    href: "/catalog",
    emoji: "🏢",
    color: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-100",
  },
  {
    audience: "Homeowners & Renters",
    pain: "Renovating? Downsizing? Got stuff that won't fit?",
    solution: "Secure, clean self-storage near you. Move in this week.",
    cta: "Search Near Me",
    href: "/catalog",
    emoji: "🏠",
    color: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-100",
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'DM Serif Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.6s 0.05s ease both; }
        .anim-2 { animation: fadeUp 0.6s 0.2s ease both; }
        .anim-3 { animation: fadeUp 0.6s 0.35s ease both; }
        .anim-4 { animation: fadeUp 0.6s 0.5s ease both; }
        .card-lift { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .card-lift:hover { transform: translateY(-5px); }
      `}</style>

      <Header />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="relative bg-[#060E1E] text-white overflow-hidden" style={{ minHeight: 580 }}>
          {/* Mesh background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(26,86,219,0.10) 0%, transparent 60%)" }} />
            {/* Grid lines */}
            <div className="absolute inset-0" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "64px 64px"
            }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="max-w-2xl mx-auto text-center">
              {/* Badge */}
              <div className="anim-1 inline-flex items-center gap-2 mb-7"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "6px 16px", fontSize: 13 }}>
                <span className="w-2 h-2 bg-green-400 rounded-full" style={{ boxShadow: "0 0 6px #4ade80" }} />
                <span className="text-blue-200">UAE&apos;s Self-Storage Marketplace</span>
              </div>

              {/* Headline */}
              <h1 className="anim-2 font-display mb-5" style={{ fontSize: "clamp(44px,7vw,76px)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                Find the Perfect<br />
                <span style={{ color: "#FBBF24", fontStyle: "italic" }}>Storage Space</span>
              </h1>
              <p className="anim-3 mb-3" style={{ fontSize: 18, color: "rgba(147,197,253,0.85)", lineHeight: 1.6 }}>
                Compare 50+ verified facilities across all 7 Emirates.
              </p>
              <p className="anim-3 mb-10" style={{ fontSize: 15, color: "rgba(147,197,253,0.55)" }}>
                Book online in 2 minutes · No hidden fees · Flexible monthly contracts
              </p>

              {/* Search */}
              <div className="anim-4">
                <SearchBar variant="hero" />
              </div>

              {/* Quick links */}
              <div className="anim-4 mt-5 flex flex-wrap justify-center gap-2">
                {EMIRATES.map((e) => (
                  <Link key={e.name} href={`/catalog?emirate=${encodeURIComponent(e.name)}`}
                    style={{ fontSize: 13, color: "rgba(147,197,253,0.8)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "5px 14px", transition: "all 0.2s" }}
                    className="hover:bg-white/10 hover:text-white">
                    {e.emoji} {e.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom blend */}
          <div className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: "linear-gradient(to top, #ffffff, transparent)" }} />
        </section>

        {/* ── TRUST STATS ── */}
        <section className="py-10 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TRUST_STATS.map(({ value, label }) => (
                <div key={label} className="text-center py-4">
                  <p className="font-display text-4xl sm:text-5xl text-gray-900 mb-1" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                  <p className="text-sm text-gray-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR WHOM ── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Who It&apos;s For</p>
              <h2 className="font-display text-3xl sm:text-4xl text-gray-900" style={{ letterSpacing: "-0.02em" }}>
                Storage for every situation
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {FOR_WHOM.map(({ audience, pain, solution, cta, href, emoji, color, border }) => (
                <div key={audience}
                  className={`card-lift rounded-2xl p-7 flex flex-col bg-gradient-to-br ${color} border ${border}`}
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div className="text-3xl mb-4">{emoji}</div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ fontSize: 17 }}>{audience}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">{pain}</p>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed mb-5">{solution}</p>
                  <Link href={href}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:gap-2.5 transition-all">
                    {cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16" style={{ background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Simple Process</p>
              <h2 className="font-display text-3xl sm:text-4xl text-gray-900" style={{ letterSpacing: "-0.02em" }}>
                From search to move-in{" "}
                <span className="italic" style={{ color: "#1A56DB" }}>in 10 minutes</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
                <div key={step} className="card-lift bg-white rounded-2xl p-7 border border-gray-100"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "#060E1E", boxShadow: "0 4px 12px rgba(6,14,30,0.2)" }}>
                      <Icon className="h-5 w-5" style={{ color: "#FBBF24" }} />
                    </div>
                    <span className="font-display text-4xl text-gray-100" style={{ lineHeight: 1 }}>0{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/catalog"
                className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(145deg,#1d4ed8,#1A56DB)", boxShadow: "0 4px 14px rgba(26,86,219,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                Start Searching <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── EMIRATES ── */}
        <section className="py-12 bg-white border-t border-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl text-gray-800 text-center mb-7" style={{ letterSpacing: "-0.01em" }}>
              Browse by Emirate
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {EMIRATES.map((e) => (
                <Link key={e.name} href={`/catalog?emirate=${encodeURIComponent(e.name)}`}
                  className="card-lift bg-white rounded-xl p-4 text-center border border-gray-100 hover:border-blue-200"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div className="text-2xl mb-1.5">{e.emoji}</div>
                  <p className="text-xs font-medium text-gray-600">{e.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED WAREHOUSES ── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-2">Top Rated</p>
                <h2 className="font-display text-3xl text-gray-900" style={{ letterSpacing: "-0.02em" }}>Featured Storage</h2>
              </div>
              <Link href="/catalog" className="hidden sm:flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:gap-2.5 transition-all">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-gray-100" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <div className="aspect-[4/3] skeleton-shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 skeleton-shimmer" />
                      <div className="h-4 w-1/2 skeleton-shimmer" />
                      <div className="h-6 w-1/3 skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredWarehouses.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featuredWarehouses.map((warehouse, i) => (
                    <div key={warehouse.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}>
                      <WarehouseCard warehouse={warehouse} />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/catalog"
                    className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl transition-all hover:border-blue-300 hover:text-blue-700"
                    style={{ border: "2px solid #e2e8f0", color: "#374151" }}>
                    Browse All {totalWarehouses > 0 ? `${totalWarehouses}+` : ""} Facilities
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-14 rounded-2xl border-2 border-dashed border-gray-200">
                <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-5 text-sm">Be the first to list a storage facility in UAE</p>
                <Link href="/auth/register"
                  className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl"
                  style={{ background: "#060E1E" }}>
                  List Your Warehouse
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="py-16" style={{ background: "#060E1E" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "#FBBF24" }}>Why StorageCompare</p>
              <h2 className="font-display text-3xl sm:text-4xl text-white" style={{ letterSpacing: "-0.02em" }}>
                Every listing, verified.{" "}
                <span className="italic" style={{ color: "#93c5fd" }}>Every booking, protected.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHY_US.map(({ icon: Icon, title, desc }) => (
                <div key={title}
                  className="card-lift rounded-2xl p-6 cursor-default"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(251,191,36,0.15)" }}>
                    <Icon className="h-4 w-4" style={{ color: "#FBBF24" }} />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(147,197,253,0.6)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI BOX FINDER ── */}
        <section className="py-14" style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)", borderTop: "1px solid #fde68a", borderBottom: "1px solid #fde68a" }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-5"
              style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
              <Sparkles className="h-3.5 w-3.5" />
              Powered by AI
            </div>
            <h2 className="font-display text-3xl text-gray-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
              Not sure what size you need?
            </h2>
            <p className="text-gray-500 mb-7 leading-relaxed">
              Describe your items — our AI picks the right unit size and finds matching facilities near you.
            </p>
            <Link href="/ai/box-finder"
              className="inline-flex items-center gap-2.5 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(145deg,#f59e0b,#d97706)", boxShadow: "0 4px 16px rgba(245,158,11,0.35), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
              <Sparkles className="h-4 w-4" />
              Try AI Box Finder — Free
            </Link>
          </div>
        </section>

        {/* ── OPERATOR CTA ── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center gap-10"
              style={{ background: "linear-gradient(135deg, #060E1E 0%, #0f2a5c 100%)", boxShadow: "0 20px 60px rgba(6,14,30,0.25)" }}>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-5"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#93c5fd", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Building2 className="h-3 w-3" />
                  For Storage Operators
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
                  Fill your empty units.{" "}
                  <span className="italic" style={{ color: "#FBBF24" }}>Start in 24 hours.</span>
                </h2>
                <p className="mb-5 leading-relaxed text-sm" style={{ color: "rgba(147,197,253,0.75)" }}>
                  List for free. Reach thousands of storage seekers across UAE. Real-time booking management.
                </p>
                <ul className="space-y-1.5 mb-7">
                  {["Free listing — forever", "Real-time booking dashboard", "Analytics & reports", "Verified badge after review"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#bfdbfe" }}>
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#4ade80" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link href="/auth/register"
                    className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(145deg,#fbbf24,#f59e0b)", color: "#060E1E", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}>
                    List Your Warehouse <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing"
                    className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-xl transition-colors hover:bg-white/5"
                    style={{ color: "#93c5fd", border: "1px solid rgba(147,197,253,0.2)" }}>
                    View Pricing
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-3 shrink-0">
                {[
                  { icon: Users, value: "1,200+", label: "Monthly searches" },
                  { icon: Building2, value: "50+", label: "Active operators" },
                  { icon: Star, value: "4.6★", label: "Avg rating" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="rounded-xl px-6 py-4 text-center"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon className="h-4 w-4 mx-auto mb-1" style={{ color: "#FBBF24" }} />
                    <p className="font-display text-2xl text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                    <p className="text-xs" style={{ color: "#93c5fd" }}>{label}</p>
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
