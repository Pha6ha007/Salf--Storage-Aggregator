import Link from "next/link";
import { CheckCircle, ArrowRight, Building2, BarChart3, Bell, Shield, Zap, Users, Star, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    badge: null,
    description: "Everything you need to get your first bookings.",
    features: [
      "List up to 3 storage units",
      "Booking management dashboard",
      "Customer messaging",
      "Email notifications",
      "Basic analytics",
      "Verified badge after review",
    ],
    cta: "Start for Free",
    href: "/auth/register?type=operator",
    accent: false,
  },
  {
    name: "Growth",
    price: "AED 299",
    period: "/ month",
    badge: "Most Popular",
    description: "Scale your storage business with powerful tools.",
    features: [
      "Unlimited storage units",
      "Priority listing placement",
      "Advanced analytics & reports",
      "SMS + WhatsApp notifications",
      "Bulk unit management",
      "Custom pricing rules",
      "Priority support (24h)",
    ],
    cta: "Start 30-Day Trial",
    href: "/auth/register?type=operator&plan=growth",
    accent: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    badge: null,
    description: "For storage chains with multiple locations.",
    features: [
      "Everything in Growth",
      "Dedicated account manager",
      "API access & webhooks",
      "White-label option",
      "Custom integrations",
      "SLA guarantee (99.9%)",
      "On-site onboarding",
    ],
    cta: "Contact Sales",
    href: "/contact",
    accent: false,
  },
];

const OPERATOR_STATS = [
  { value: "1,200+", label: "Monthly storage searches on the platform" },
  { value: "85%", label: "Of operators fill empty units within 30 days" },
  { value: "AED 0", label: "Cost to list your first 3 units" },
  { value: "4.6★", label: "Average operator satisfaction rating" },
];

const HOW_IT_HELPS = [
  { icon: Zap, title: "Instant Visibility", desc: "Your facility appears in search results immediately after verification. Reach customers actively looking for storage in your area." },
  { icon: BarChart3, title: "Real-Time Dashboard", desc: "See occupancy rates, booking trends, and revenue — all in one place. Know which units are most popular and adjust pricing." },
  { icon: Bell, title: "Never Miss a Booking", desc: "Get notified instantly on email, SMS, and WhatsApp when a customer books. Confirm in one click from any device." },
  { icon: Shield, title: "Verified Trust Badge", desc: "After passing our review, your listing gets a Verified badge — the single biggest factor in conversion rates." },
  { icon: Users, title: "Customer Reviews", desc: "Genuine reviews from verified renters build your reputation automatically. No fake ratings allowed on the platform." },
  { icon: TrendingUp, title: "Flexible Pricing Control", desc: "Set seasonal rates, minimum stay rules, and promotional pricing. Your units, your prices." },
];

const FAQ = [
  { q: "Is there a commission on bookings?", a: "No commission on Starter. Growth and Enterprise plans have a small platform fee — contact us for current rates." },
  { q: "Can I list multiple warehouses?", a: "Starter allows up to 3 units across 1 warehouse. Growth and Enterprise allow unlimited units across multiple locations." },
  { q: "How long does verification take?", a: "Most operators are verified within 24–48 hours after submitting their trade license and facility photos." },
  { q: "Can I cancel my subscription?", a: "Yes, cancel anytime. Your listing remains active until the end of the billing period. No penalty." },
  { q: "How do I receive payments?", a: "Payments are handled directly between you and your customers. We facilitate the booking connection but do not hold funds." },
  { q: "What's the trial period for Growth?", a: "30 days free, no credit card required. Cancel before the trial ends and you pay nothing." },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main>

        <PageHero
          size="lg"
          title={`Grow Your Storage\nBusiness in UAE`}
          subtitle="List for free. Get bookings from day one. Upgrade only when you need more power."
          breadcrumbs={[{ label: "Pricing" }]}
          cta={{ label: "Start Free Today", href: "/auth/register?type=operator", variant: "accent" }}
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
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Pricing Plans</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
                Start free. Scale when ready.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div key={plan.name} className="relative flex flex-col rounded-2xl p-7"
                  style={{
                    border: plan.accent ? "2px solid #1A56DB" : "1px solid #e2e8f0",
                    boxShadow: plan.accent ? "0 8px 40px rgba(26,86,219,0.12)" : "0 4px 20px rgba(0,0,0,0.05)",
                    background: "white",
                  }}>
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="text-white text-xs font-bold px-4 py-1 rounded-full"
                        style={{ background: "linear-gradient(145deg,#1d4ed8,#1A56DB)" }}>
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

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}
                    className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                    style={plan.accent
                      ? { background: "linear-gradient(145deg,#1d4ed8,#1A56DB)", color: "white", boxShadow: "0 4px 14px rgba(26,86,219,0.25)" }
                      : { background: "#f1f5f9", color: "#374151" }
                    }>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it helps */}
        <section className="py-16" style={{ background: "linear-gradient(180deg,#f8faff 0%,white 100%)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Platform Features</p>
              <h2 className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
                Everything you need to fill your units
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HOW_IT_HELPS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)" }}>
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10"
              style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
              Frequently asked questions
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
              <Building2 className="h-3.5 w-3.5" />
              For Storage Operators
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: "-0.02em" }}>
              Ready to fill your empty units?
            </h2>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(147,197,253,0.7)" }}>
              Join 50+ operators already using StorageCompare.ae to reach thousands of customers across UAE.<br />
              No credit card required. Your first 3 units are always free.
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
                Talk to Sales
              </Link>
            </div>
            <p className="mt-6 text-xs" style={{ color: "rgba(147,197,253,0.4)" }}>
              ✓ No credit card &nbsp;·&nbsp; ✓ Setup in 24 hours &nbsp;·&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
