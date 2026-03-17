import Link from "next/link";
import { CheckCircle, ArrowRight, Building2, BarChart3, Bell, Shield, Zap, Users, TrendingUp, Clock, Star, Package } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

// MVP reality: platform is free for operators. Monetization comes post-MVP.
// Plans show the value progression — Free now, paid features planned.
const PLANS = [
  {
    name: "Free Listing",
    price: "Free",
    period: "forever",
    badge: null,
    highlight: false,
    description: "List your facility and start receiving bookings immediately.",
    features: [
      { text: "Unlimited storage units listed", available: true },
      { text: "Full booking management dashboard", available: true },
      { text: "Email notifications for new bookings", available: true },
      { text: "Customer reviews & ratings", available: true },
      { text: "Basic occupancy metrics", available: true },
      { text: "Verified operator badge", available: true },
      { text: "AI Box Finder — recommends your units", available: true },
    ],
    cta: "Start Listing — Free",
    href: "/auth/register?type=operator",
    note: null,
  },
  {
    name: "Growth",
    price: "AED 299",
    period: "/ month",
    badge: "Coming Soon",
    highlight: true,
    description: "Advanced tools to maximise occupancy and revenue.",
    features: [
      { text: "Everything in Free Listing", available: true },
      { text: "Priority placement in search results", available: false },
      { text: "Advanced analytics & revenue reports", available: false },
      { text: "SMS + WhatsApp booking notifications", available: false },
      { text: "Bulk unit management tools", available: false },
      { text: "Custom seasonal pricing rules", available: false },
      { text: "Priority support (response in 4h)", available: false },
    ],
    cta: "Join Waitlist",
    href: "/contact?subject=Growth+Plan+Waitlist",
    note: "Launching Q3 2026 — join the waitlist to get 3 months free.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    badge: null,
    highlight: false,
    description: "For storage chains with 5+ locations.",
    features: [
      { text: "Everything in Growth", available: true },
      { text: "Dedicated account manager", available: false },
      { text: "API access & data exports", available: false },
      { text: "Multi-location management", available: false },
      { text: "Custom integrations (PMS, ERP)", available: false },
      { text: "99.9% SLA guarantee", available: false },
      { text: "On-site onboarding & training", available: false },
    ],
    cta: "Contact Sales",
    href: "/contact?subject=Enterprise",
    note: null,
  },
];

const OPERATOR_STATS = [
  { value: "Free", label: "To list your facility — no credit card needed" },
  { value: "24h", label: "Average time from signup to first listing live" },
  { value: "50+", label: "Operators already listed on the platform" },
  { value: "4.6★", label: "Average operator satisfaction score" },
];

const WHAT_YOU_GET = [
  {
    icon: Zap,
    title: "Instant Visibility",
    desc: "Your facility appears in search results immediately after verification — reached by customers actively searching for storage in your area.",
  },
  {
    icon: Package,
    title: "Full Unit Management",
    desc: "Add, edit, and manage all your storage units in one place. Set sizes, prices, availability, and features for each unit independently.",
  },
  {
    icon: Bell,
    title: "Booking Notifications",
    desc: "Get email notifications the moment a customer books. Confirm or decline from your dashboard in one click — from any device.",
  },
  {
    icon: Shield,
    title: "Verified Operator Badge",
    desc: "Pass our quick review and earn the Verified badge — the most trusted signal for storage customers when choosing a facility.",
  },
  {
    icon: Star,
    title: "Authentic Reviews",
    desc: "Genuine ratings from verified renters build your reputation automatically. Reviews are visible on your listing and boost conversion.",
  },
  {
    icon: BarChart3,
    title: "Occupancy Dashboard",
    desc: "See how many units are available, reserved, and occupied at a glance. Track booking trends and understand your peak periods.",
  },
  {
    icon: Users,
    title: "Customer Messaging",
    desc: "Communicate with potential renters directly through the platform. Answer questions, share documents, and close bookings faster.",
  },
  {
    icon: TrendingUp,
    title: "AI-Powered Demand",
    desc: "StorageCompare's AI Box Finder actively recommends your units to users who need exactly the size and type you offer.",
  },
];

const STEPS = [
  { n: "01", title: "Create your account", desc: "Sign up as an operator in 2 minutes. No credit card, no contract." },
  { n: "02", title: "Add your warehouse", desc: "Fill in location, photos, and unit details. Our team reviews within 24 hours." },
  { n: "03", title: "Get verified", desc: "Receive your Verified badge and appear in search results immediately." },
  { n: "04", title: "Manage bookings", desc: "Confirm reservations, communicate with customers, and track occupancy in real time." },
];

const FAQ = [
  {
    q: "Is it really free to list?",
    a: "Yes — listing your facility and receiving bookings is completely free. No commission, no hidden fees in the current MVP phase. Paid plans with advanced features are planned for Q3 2026.",
  },
  {
    q: "How many units can I list?",
    a: "Unlimited. List as many individual storage units as your facility has — all sizes, types, and price points.",
  },
  {
    q: "How does verification work?",
    a: "After submitting your trade license and facility photos, our team reviews your listing within 24–48 hours. Approved listings receive a Verified badge which significantly improves conversion.",
  },
  {
    q: "How do payments work?",
    a: "In the current phase, payments are settled directly between you and your customers — cash, bank transfer, or your preferred method. Online payment processing is planned for the Growth plan launch.",
  },
  {
    q: "Can I list multiple warehouses?",
    a: "Yes. You can manage multiple warehouses and their units from a single operator account.",
  },
  {
    q: "What happens when Growth plan launches?",
    a: "Free listings remain free — always. Growth is an optional upgrade for operators who want priority placement, SMS notifications, and advanced analytics. Join the waitlist to get 3 months free.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main>

        <PageHero
          size="lg"
          title="List Your Storage Facility — Free"
          subtitle="Reach thousands of storage seekers across UAE. No credit card, no contracts, no commission. Start receiving bookings in 24 hours."
          breadcrumbs={[{ label: "Pricing" }]}
          cta={{ label: "Start Listing Free", href: "/auth/register?type=operator", variant: "accent" }}
        />

        {/* Stats strip */}
        <section className="py-10 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {OPERATOR_STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1"
                    style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
                    {value}
                  </p>
                  <p className="text-xs text-gray-400 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Plans & Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
                Start free. More power coming.
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                The platform is free for operators during MVP. Advanced paid features launch Q3 2026.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div key={plan.name} className="relative flex flex-col rounded-2xl p-7"
                  style={{
                    border: plan.highlight ? "2px solid #1A56DB" : "1px solid #e2e8f0",
                    boxShadow: plan.highlight ? "0 8px 40px rgba(26,86,219,0.10)" : "0 4px 20px rgba(0,0,0,0.04)",
                    background: "white",
                  }}>

                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="text-xs font-bold px-4 py-1 rounded-full"
                        style={plan.highlight
                          ? { background: "linear-gradient(145deg,#1d4ed8,#1A56DB)", color: "white" }
                          : { background: "#f1f5f9", color: "#64748b" }
                        }>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-5xl font-bold text-gray-900"
                        style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.03em" }}>
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map(({ text, available }) => (
                      <li key={text} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${available ? "text-green-500" : "text-gray-200"}`} />
                        <span className={available ? "text-gray-600" : "text-gray-300"}>{text}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.note && (
                    <div className="mb-4 px-3 py-2.5 rounded-lg text-xs leading-relaxed"
                      style={{ background: "#eff6ff", color: "#1e40af" }}>
                      {plan.note}
                    </div>
                  )}

                  <Link href={plan.href}
                    className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                    style={plan.highlight
                      ? { background: "linear-gradient(145deg,#1d4ed8,#1A56DB)", color: "white", boxShadow: "0 4px 14px rgba(26,86,219,0.22)" }
                      : plan.price === "Free"
                      ? { background: "linear-gradient(145deg,#fbbf24,#f59e0b)", color: "#060E1E", boxShadow: "0 4px 14px rgba(245,158,11,0.25)" }
                      : { background: "#f1f5f9", color: "#374151" }
                    }>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* Comparison note */}
            <p className="text-center text-xs text-gray-400 mt-6">
              ✓ No credit card required &nbsp;·&nbsp; ✓ Free listings stay free forever &nbsp;·&nbsp; ✓ Cancel paid plans anytime
            </p>
          </div>
        </section>

        {/* How to get started */}
        <section className="py-14" style={{ background: "linear-gradient(180deg,#f8faff 0%,white 100%)" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Getting Started</p>
              <h2 className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
                Live in 4 steps
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} className="bg-white rounded-2xl p-5 border border-gray-100"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                  <div className="text-5xl font-bold text-gray-100 mb-3 leading-none"
                    style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>{n}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Included in Free Plan</p>
              <h2 className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
                Everything you need to fill your units
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHAT_YOU_GET.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)" }}>
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14" style={{ background: "linear-gradient(180deg,#f8faff,white)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8"
              style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
              Common questions
            </h2>
            <div className="space-y-3">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 p-5"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16" style={{ background: "#060E1E" }}>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium mb-6"
              style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.2)" }}>
              <Clock className="h-3.5 w-3.5" />
              Live in under 24 hours
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
              Ready to fill your empty units?
            </h2>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(147,197,253,0.7)" }}>
              Join 50+ operators already on StorageCompare.ae.<br />
              Free forever. No credit card. No commission. No risk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register?type=operator"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(145deg,#fbbf24,#f59e0b)", color: "#060E1E", boxShadow: "0 4px 16px rgba(245,158,11,0.35)" }}>
                List Your Warehouse — Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium px-6 py-4 rounded-xl transition-colors"
                style={{ color: "rgba(147,197,253,0.8)", border: "1px solid rgba(147,197,253,0.2)" }}>
                Have questions? Contact us
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
