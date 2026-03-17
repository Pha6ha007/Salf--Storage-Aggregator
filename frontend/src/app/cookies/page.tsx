import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: January 1, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">What Are Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit
              a website. They are widely used to make websites work more efficiently and to provide information
              to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">How We Use Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              StorageCompare.ae uses cookies for authentication (to keep you logged in), security, and to
              remember your preferences. We use httpOnly cookies for authentication tokens which cannot be
              accessed by JavaScript, providing enhanced security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Types of Cookies We Use</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="font-medium text-gray-800 w-40 shrink-0">auth_token</span>
                <span>Authentication cookie (15 minutes). Keeps you logged in during your session.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-gray-800 w-40 shrink-0">refresh_token</span>
                <span>Refresh token (7 days). Allows automatic renewal of your session.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              You can control and manage cookies in your browser settings. Please note that removing or
              blocking cookies may impact your user experience and parts of the website may no longer be
              fully accessible. If you delete cookies, you will need to log in again.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about our use of cookies, contact us at{" "}
              <a href="mailto:info@storagecompare.ae" className="text-blue-600 hover:underline">
                info@storagecompare.ae
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
