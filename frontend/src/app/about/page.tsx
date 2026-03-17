import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Search, Star, Globe, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'About Us | StorageCompare.ae',
  description: "UAE's leading platform for finding and comparing self-storage. Simple, transparent, accessible.",
};

const VALUES = [
  { icon: Shield, title: 'Verified Operators', desc: 'Every warehouse operator is reviewed before listing. We maintain quality standards so you can trust every facility.' },
  { icon: Search, title: 'Transparent Pricing', desc: 'Real prices, no hidden fees. Compare storage costs across UAE with confidence.' },
  { icon: Star, title: 'Real Reviews', desc: 'Reviews come from verified renters only — no fake ratings, no paid placements.' },
  { icon: Globe, title: 'UAE-Wide Coverage', desc: 'From Dubai to Fujairah, we cover all 7 Emirates. Find storage wherever you need it.' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">

        <PageHero
          title="About StorageCompare.ae"
          subtitle="We're building UAE's most trusted storage marketplace — making it easy to find, compare, and book storage across all 7 Emirates."
          breadcrumbs={[{ label: 'About' }]}
        />

        {/* Mission */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Our Story</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
                  Built for the UAE
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  StorageCompare.ae was founded to solve a real problem: finding reliable, affordable
                  storage in the UAE was frustrating, opaque, and time-consuming.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Whether you&apos;re an expat relocating between cities, a business owner running out of
                  space, or a homeowner mid-renovation — we make it simple to find the right unit at
                  the right price, booked in minutes.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { value: '50+', label: 'Verified facilities' },
                  { value: '7', label: 'Emirates covered' },
                  { value: 'AED 199', label: 'Starting from / month' },
                  { value: '2 min', label: 'To book online' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <span className="text-2xl font-bold text-blue-600 w-24 shrink-0"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{value}</span>
                    <span className="text-gray-600 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section id="how-it-works" className="py-16" style={{ background: 'linear-gradient(180deg,#f8faff 0%,#ffffff 100%)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">What We Stand For</p>
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
                Our values
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14" style={{ background: '#060E1E' }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              Ready to find your space?
            </h2>
            <p className="mb-7 leading-relaxed" style={{ color: 'rgba(147,197,253,0.75)' }}>
              Browse 50+ verified storage facilities across all 7 Emirates.
            </p>
            <Link href="/catalog"
              className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 4px 14px rgba(26,86,219,0.3)' }}>
              Browse Storage <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
