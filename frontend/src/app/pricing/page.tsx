import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

const plans = [
  {
    name: "Free Listing",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started",
    features: ["List up to 2 warehouses", "Basic analytics", "Customer bookings", "Email notifications", "Standard support"],
    cta: "Get Started",
    href: "/auth/register?type=operator",
    highlight: false,
  },
  {
    name: "Professional",
    price: "AED 299",
    period: "per month",
    description: "For growing storage businesses",
    features: ["Unlimited warehouses", "Advanced analytics", "Priority listing placement", "SMS & WhatsApp notifications", "Priority support", "Custom branding", "Bulk box management"],
    cta: "Start Free Trial",
    href: "/contact",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large storage chains",
    features: ["Everything in Professional", "Dedicated account manager", "API access", "White-label solution", "Custom integrations", "SLA guarantee", "On-site training"],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

const pricingFaqs = [
  { q: "Is there a commission on bookings?", a: "We charge a small platform fee on confirmed bookings. Contact us for current rates." },
  { q: "Can I cancel my subscription?", a: "Yes, cancel anytime. Your listing stays active until the end of the billing period." },
  { q: "How do I get paid?", a: "Payments are handled directly between you and your customers. We facilitate the booking but don't hold funds." },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main>

        <PageHero
          title="Simple, Transparent Pricing"
          subtitle="List your storage facility and start receiving bookings. Free forever — upgrade when you're ready."
          breadcrumbs={[{ label: 'Pricing' }]}
          cta={{ label: 'Get Started Free', href: '/auth/register?type=operator', variant: 'accent' }}
        />

        {/* Plans */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className="relative bg-white rounded-2xl p-7 flex flex-col"
                  style={{
                    border: plan.highlight ? '2px solid #1A56DB' : '1px solid #e2e8f0',
                    boxShadow: plan.highlight ? '0 8px 32px rgba(26,86,219,0.12)' : '0 4px 16px rgba(0,0,0,0.05)',
                  }}>
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="text-white text-xs font-semibold px-4 py-1 rounded-full"
                        style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)' }}>
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h2 className="font-bold text-gray-900 mb-1">{plan.name}</h2>
                    <p className="text-gray-400 text-xs mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>{plan.price}</span>
                      <span className="text-gray-400 text-xs">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}
                    className="w-full text-center py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                    style={plan.highlight
                      ? { background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', color: 'white', boxShadow: '0 4px 14px rgba(26,86,219,0.25)' }
                      : { background: '#f1f5f9', color: '#374151' }}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12" style={{ background: 'linear-gradient(180deg,#f8faff,white)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              Questions about pricing
            </h2>
            <div className="space-y-3">
              {pricingFaqs.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 p-5"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-14" style={{ background: '#060E1E' }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              Ready to list your facility?
            </h2>
            <p className="mb-7 text-sm leading-relaxed" style={{ color: 'rgba(147,197,253,0.75)' }}>
              Join StorageCompare.ae and reach thousands of storage seekers across UAE.
            </p>
            <Link href="/auth/register?type=operator"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(145deg,#fbbf24,#f59e0b)', color: '#060E1E', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}>
              List Your Warehouse — It&apos;s Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
