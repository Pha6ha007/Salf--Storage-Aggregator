import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - UAE Self-Storage Platform | StorageCompare.ae',
  description: 'Learn about StorageCompare.ae, the leading platform for finding and comparing self-storage solutions across the UAE. Our mission is to connect people with trusted warehouse operators.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About StorageCompare.ae
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              We are the UAE&apos;s leading platform for finding and comparing self-storage solutions.
              Our mission is to make storage simple, transparent, and accessible to everyone.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 mb-6">
              StorageCompare.ae was founded to address a common challenge in the UAE: finding
              reliable, affordable storage space. Whether you&apos;re moving homes, decluttering,
              storing business inventory, or need temporary storage during renovations, we make
              it easy to find the perfect solution.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connect You with Trusted Operators
                </h3>
                <p className="text-gray-700">
                  All warehouse operators on our platform are verified and reviewed by our community,
                  ensuring you get reliable, quality service.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Transparent Pricing
                </h3>
                <p className="text-gray-700">
                  Compare prices across different facilities to find the best deal for your budget.
                  No hidden fees, no surprises.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Easy Online Booking
                </h3>
                <p className="text-gray-700">
                  Reserve your storage unit online in just a few clicks. Simple, fast, and secure.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  UAE-Wide Coverage
                </h3>
                <p className="text-gray-700">
                  Find storage facilities across all seven Emirates, from Dubai to Fujairah.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Comprehensive database of verified storage facilities</li>
              <li>Real customer reviews and ratings</li>
              <li>Advanced search and filtering options</li>
              <li>Secure online booking system</li>
              <li>Dedicated customer support</li>
              <li>Mobile-friendly platform</li>
            </ul>

            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-lg mt-12">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Find Your Storage Space?
              </h2>
              <p className="text-text-secondary mb-6">
                Join thousands of satisfied customers who have found their perfect storage solution
                through StorageCompare.ae.
              </p>
              <Link
                href="/catalog"
                className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition"
              >
                Browse Storage Facilities
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
