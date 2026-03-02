import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | StorageCompare.ae',
  description: 'Find answers to common questions about self-storage in the UAE. Learn about booking, pricing, security, and more.',
};

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is StorageCompare.ae?',
        a: 'StorageCompare.ae is the UAE\'s leading platform for finding and comparing self-storage facilities. We help you find the perfect storage space across all seven Emirates by providing transparent pricing, verified operators, and easy online booking.',
      },
      {
        q: 'How does StorageCompare.ae work?',
        a: 'Simply search for storage facilities in your preferred location, compare prices and features, read reviews from other customers, and book your unit online. It\'s that easy!',
      },
      {
        q: 'Is StorageCompare.ae free to use?',
        a: 'Yes! Searching and comparing storage facilities on our platform is completely free. You only pay for the storage unit you book.',
      },
    ],
  },
  {
    category: 'Booking & Payment',
    questions: [
      {
        q: 'How do I book a storage unit?',
        a: 'Browse our catalog, select your preferred warehouse and unit, then click "Book Now". You\'ll need to create an account (or log in) to complete the booking. Follow the prompts to confirm your reservation.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, debit cards, and online payment methods. Payment is processed securely through our payment partner.',
      },
      {
        q: 'Can I cancel my booking?',
        a: 'Yes, cancellation policies vary by facility. Please review the specific cancellation terms before booking. Generally, you can cancel pending bookings within 24 hours without penalty.',
      },
      {
        q: 'How long can I rent a storage unit?',
        a: 'Most facilities offer flexible rental periods from as short as one month to long-term contracts. Contact the specific warehouse for their minimum and maximum rental terms.',
      },
    ],
  },
  {
    category: 'Security & Access',
    questions: [
      {
        q: 'Are the storage facilities secure?',
        a: 'All facilities on our platform are required to meet minimum security standards, including surveillance cameras, secure access control, and on-site management. Many also offer additional features like climate control and 24/7 access.',
      },
      {
        q: 'When can I access my storage unit?',
        a: 'Access hours vary by facility. Many offer 24/7 access, while others have specific operating hours. Check the facility details page for specific access information.',
      },
      {
        q: 'Do I need insurance for my stored items?',
        a: 'While not always mandatory, we strongly recommend insuring your stored items. Some facilities offer insurance options, or you can arrange your own coverage.',
      },
    ],
  },
  {
    category: 'Sizing & Pricing',
    questions: [
      {
        q: 'What size storage unit do I need?',
        a: 'Unit sizes typically range from small (1-5 sqm) for a few boxes, to extra large (20+ sqm) for furniture and large items. Our AI-powered box finder can help you determine the right size based on what you need to store.',
      },
      {
        q: 'How is pricing calculated?',
        a: 'Pricing varies based on location, size, features, and rental duration. All prices are shown per month. You can filter by price range to find options within your budget.',
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No. We believe in transparent pricing. The price you see is what you pay. Some facilities may charge additional fees for specific services (like climate control), which will be clearly stated.',
      },
    ],
  },
  {
    category: 'Operators & Reviews',
    questions: [
      {
        q: 'How do you verify warehouse operators?',
        a: 'All operators undergo a verification process including business license checks, facility inspections, and compliance with our quality standards.',
      },
      {
        q: 'Can I trust the reviews?',
        a: 'Yes! Reviews can only be left by verified customers who have completed a booking at the facility. We do not allow fake or paid reviews.',
      },
      {
        q: 'What if I have an issue with a facility?',
        a: 'Contact our support team at support@storagecompare.ae and we\'ll help resolve any issues. We take customer satisfaction seriously.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about self-storage in the UAE
            </p>
          </div>

          <div className="space-y-12">
            {faqs.map((category, categoryIdx) => (
              <div key={categoryIdx}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                  {category.category}
                </h2>

                <div className="space-y-6">
                  {category.questions.map((faq, faqIdx) => (
                    <div key={faqIdx} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.q}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-700 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
