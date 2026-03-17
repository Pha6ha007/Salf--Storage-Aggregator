import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: January 1, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using StorageCompare.ae, you accept and agree to be bound by the terms and
              provision of this agreement. StorageCompare.ae is a marketplace platform connecting storage seekers
              with storage facility operators in the UAE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use of Platform</h2>
            <p className="text-gray-600 leading-relaxed">
              StorageCompare.ae provides an online marketplace for self-storage services. We do not own or
              operate any storage facilities. Contracts for storage services are between users and operators directly.
              We facilitate the booking process only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password and for
              restricting access to your computer. You agree to accept responsibility for all activities that
              occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Bookings and Payments</h2>
            <p className="text-gray-600 leading-relaxed">
              All bookings are subject to availability and confirmation by the storage operator. Payments are
              processed directly between users and operators. StorageCompare.ae is not responsible for payment
              disputes between users and operators.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Operator Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed">
              Storage operators are responsible for the accuracy of their listings, availability of units,
              maintaining their facilities in good condition, and complying with all applicable UAE laws and regulations.
              Operators must hold valid trade licenses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              StorageCompare.ae shall not be liable for any indirect, incidental, special, consequential or
              punitive damages resulting from your use of the service. Our total liability shall not exceed
              the fees paid to us in the last 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by the laws of the United Arab Emirates. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of Dubai, UAE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms, contact us at{" "}
              <a href="mailto:legal@storagecompare.ae" className="text-blue-600 hover:underline">
                legal@storagecompare.ae
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
