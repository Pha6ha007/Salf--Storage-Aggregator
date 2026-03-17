import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: January 1, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              StorageCompare.ae collects information you provide directly to us, such as when you create an account,
              make a booking, or contact us for support. This includes your name, email address, phone number,
              and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process
              transactions, send you technical notices and support messages, and respond to your comments and questions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not share your personal information with third parties except as described in this policy.
              We may share your information with storage facility operators to facilitate your bookings,
              and with service providers who assist in our operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse,
              unauthorized access, disclosure, alteration, and destruction. All data is encrypted in transit
              and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and hold certain
              information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time.
              You can do this through your account settings or by contacting us at{" "}
              <a href="mailto:privacy@storagecompare.ae" className="text-blue-600 hover:underline">
                privacy@storagecompare.ae
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:info@storagecompare.ae" className="text-blue-600 hover:underline">
                info@storagecompare.ae
              </a>{" "}
              or call <a href="tel:+97150123456" className="text-blue-600 hover:underline">+971 50 123 4567</a>.
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
