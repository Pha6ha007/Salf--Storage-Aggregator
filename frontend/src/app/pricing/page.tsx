import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const plans = [
  {
    name: "Free Listing",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "List up to 2 warehouses",
      "Basic analytics",
      "Customer bookings",
      "Email notifications",
      "Standard support",
    ],
    cta: "Get Started",
    href: "/auth/register?type=operator",
    highlight: false,
  },
  {
    name: "Professional",
    price: "AED 299",
    period: "per month",
    description: "For growing storage businesses",
    features: [
      "Unlimited warehouses",
      "Advanced analytics dashboard",
      "Priority listing placement",
      "SMS & WhatsApp notifications",
      "Priority support",
      "Custom branding",
      "Bulk box management",
    ],
    cta: "Start Free Trial",
    href: "/contact",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large storage chains",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "API access",
      "White-label solution",
      "Custom integrations",
      "SLA guarantee",
      "On-site training",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-blue-200">
              List your storage facility and start receiving bookings today
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl p-8 shadow-sm border-2 flex flex-col ${
                    plan.highlight ? "border-blue-600 relative" : "border-gray-100"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                    <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 text-sm">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Is there a commission on bookings?",
                  a: "We charge a small platform fee on confirmed bookings. Contact us for current rates.",
                },
                {
                  q: "Can I cancel my subscription?",
                  a: "Yes, you can cancel at any time. Your listing will remain active until the end of the billing period.",
                },
                {
                  q: "How do I get paid?",
                  a: "Payments are handled directly between you and your customers. We facilitate the booking but do not hold funds.",
                },
              ].map((item) => (
                <div key={item.q} className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-amber-500 py-16 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to list your storage facility?</h2>
          <p className="text-amber-100 mb-8">Join StorageCompare.ae and reach thousands of storage seekers across UAE</p>
          <Link
            href="/auth/register?type=operator"
            className="inline-block bg-white text-amber-600 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition-colors"
          >
            List Your Warehouse — It&apos;s Free
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
