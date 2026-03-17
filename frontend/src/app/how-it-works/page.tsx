import Link from 'next/link';
import { Search, CheckCircle, Package, ArrowRight, Building2, Star, Shield, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';

const RENTER_STEPS = [
  {
    n: '01',
    icon: Search,
    title: 'Search your area',
    desc: 'Enter your emirate or district. Filter by unit size, price, and features. See all available facilities on a map.',
  },
  {
    n: '02',
    icon: Star,
    title: 'Compare & choose',
    desc: 'Browse verified listings with real photos, reviews, and transparent pricing. Use our AI Box Finder if unsure what size you need.',
  },
  {
    n: '03',
    icon: CheckCircle,
    title: 'Book in 2 minutes',
    desc: 'Select your unit, choose your start date and duration, confirm the booking. No payment required upfront.',
  },
  {
    n: '04',
    icon: Package,
    title: 'Move in',
    desc: "The operator confirms your booking by email. Show up on your start date — your unit is ready. Pay directly to the facility.",
  },
];

const OPERATOR_STEPS = [
  {
    n: '01',
    icon: Building2,
    title: 'Create your account',
    desc: 'Sign up as an operator in 2 minutes. No credit card required.',
  },
  {
    n: '02',
    icon: CheckCircle,
    title: 'List your facility',
    desc: 'Add your warehouse details, photos, unit sizes and pricing. Our team reviews and approves within 24 hours.',
  },
  {
    n: '03',
    icon: Shield,
    title: 'Get verified',
    desc: 'Receive your Verified badge. Your listing goes live and appears in search results immediately.',
  },
  {
    n: '04',
    icon: Clock,
    title: 'Manage bookings',
    desc: 'Confirm or decline requests from your dashboard. Get email notifications the moment a customer books.',
  },
];

const FAQS = [
  { q: 'How do I pay for storage?', a: 'Payment is made directly to the storage facility — cash, bank transfer, or their preferred method. StorageCompare.ae does not handle payments.' },
  { q: 'Can I cancel a booking?', a: 'Yes. Each operator has their own cancellation policy shown on their listing. Most allow cancellation before the move-in date.' },
  { q: 'What is the minimum rental period?', a: 'Most facilities offer a minimum of 1 month. Some allow shorter terms — check the specific listing.' },
  { q: 'Are the facilities secure?', a: 'All listed facilities are reviewed before being approved. Look for the Verified badge and read customer reviews for peace of mind.' },
  { q: 'What sizes are available?', a: 'Units range from small lockers (1–2 m²) to large warehouse bays (50+ m²). Use the AI Box Finder to get a size recommendation for your items.' },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main>
        <PageHero
          size="lg"
          title="How StorageCompare Works"
          subtitle="Find, compare, and book self-storage in UAE. Simple for renters, powerful for operators."
          breadcrumbs={[{ label: 'How It Works' }]}
        />

        {/* For Renters */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">For Storage Seekers</p>
              <h2 className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: '-0.02em' }}>
                Find storage in 4 steps
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {RENTER_STEPS.map(({ n, icon: Icon, title, desc }) => (
                <div key={n} className="relative bg-white rounded-2xl p-6 border border-gray-100"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                  <div className="text-5xl font-bold text-gray-100 mb-4 leading-none"
                    style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>{n}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/catalog"
                className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 4px 14px rgba(26,86,219,0.25)' }}>
                Find Storage Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* For Operators */}
        <section className="py-16" style={{ background: 'linear-gradient(180deg,#f8faff,white)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">For Storage Operators</p>
              <h2 className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: '-0.02em' }}>
                Start receiving bookings in 24 hours
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {OPERATOR_STEPS.map(({ n, icon: Icon, title, desc }) => (
                <div key={n} className="relative bg-white rounded-2xl p-6 border border-gray-100"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                  <div className="text-5xl font-bold text-gray-100 mb-4 leading-none"
                    style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>{n}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'linear-gradient(135deg,#fefce8,#fef9c3)' }}>
                    <Icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/auth/register?type=operator"
                className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(145deg,#fbbf24,#f59e0b)', color: '#060E1E', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
                List Your Warehouse Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8"
              style={{ fontFamily: "'DM Serif Display',Georgia,serif", letterSpacing: '-0.02em' }}>
              Common questions
            </h2>
            <div className="space-y-3">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-gray-100 p-5"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-8">
              Still have questions?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline font-medium">Contact us</Link>
              {' '}or check the{' '}
              <Link href="/faq" className="text-blue-600 hover:underline font-medium">full FAQ</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
