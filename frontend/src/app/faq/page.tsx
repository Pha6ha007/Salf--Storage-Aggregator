import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'FAQ | StorageCompare.ae',
  description: 'Answers to common questions about self-storage in the UAE — booking, pricing, security, and more.',
};

const faqs = [
  {
    category: 'General',
    questions: [
      { q: 'What is StorageCompare.ae?', a: "StorageCompare.ae is UAE's leading platform for finding and comparing self-storage facilities across all 7 Emirates. We provide transparent pricing, verified operators, and instant online booking." },
      { q: 'How does StorageCompare.ae work?', a: 'Search for storage in your location, compare prices and features, read verified reviews, and book your unit online. The whole process takes under 10 minutes.' },
      { q: 'Is StorageCompare.ae free to use?', a: 'Yes — searching and comparing is completely free. You only pay for the storage unit you book.' },
    ],
  },
  {
    category: 'Booking & Payment',
    questions: [
      { q: 'How do I book a storage unit?', a: "Browse the catalog, select a warehouse and unit, click 'Book Now'. You'll need an account to confirm. The whole process takes about 2 minutes." },
      { q: 'Can I cancel my booking?', a: 'Yes. Pending bookings can be cancelled anytime. Confirmed bookings follow the facility cancellation policy — typically 30 days notice.' },
      { q: 'How long can I rent?', a: 'Most facilities offer monthly rolling contracts. Some offer discounts for 3, 6, or 12-month commitments. Check the facility page for details.' },
    ],
  },
  {
    category: 'Security & Access',
    questions: [
      { q: 'Are the facilities secure?', a: 'All listed facilities must meet our security standards: CCTV cameras, access control, and on-site management. Many offer 24/7 access and climate control.' },
      { q: 'When can I access my unit?', a: 'Access hours vary by facility. Many offer 24/7 access. Check the facility details page before booking.' },
      { q: 'Do I need insurance?', a: 'Not mandatory, but strongly recommended. Some facilities offer insurance — check the listing. You can also arrange your own contents insurance.' },
    ],
  },
  {
    category: 'Sizing & Pricing',
    questions: [
      { q: 'What size unit do I need?', a: 'Units range from small (1–5 sqm) for boxes and documents, to large (20+ sqm) for furniture. Try our AI Box Finder — describe your items and it recommends the right size.' },
      { q: 'Are there hidden fees?', a: 'No. The price you see is what you pay. Additional services like climate control are always shown upfront.' },
      { q: 'How is pricing calculated?', a: 'Prices are monthly per unit. Factors include location, size, access type, and climate control. Use filters to find options in your budget.' },
    ],
  },
  {
    category: 'Operators & Reviews',
    questions: [
      { q: 'How do you verify operators?', a: 'All operators go through business license checks, facility review, and compliance with our quality standards before going live.' },
      { q: 'Can I trust the reviews?', a: 'Reviews can only be submitted by customers who completed a confirmed booking. No anonymous or paid reviews.' },
      { q: 'What if I have an issue?', a: 'Contact support@storagecompare.ae — we respond within 1 business day and help mediate any issues.' },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">

        <PageHero
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about finding and booking storage in the UAE."
          breadcrumbs={[{ label: 'FAQ' }]}
        />

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {faqs.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{cat.category}</h2>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="space-y-3">
                    {cat.questions.map(({ q, a }) => (
                      <div key={q} className="rounded-xl border border-gray-100 p-5"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">{q}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Still have questions */}
            <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h2>
              <p className="text-gray-600 text-sm mb-5">Our support team responds within 1 business day.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 4px 14px rgba(26,86,219,0.25)' }}>
                Contact Support
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
