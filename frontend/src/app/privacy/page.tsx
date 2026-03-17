import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

export default function PrivacyPage() {
  const sections = [
    { title: "1. Information We Collect", body: "StorageCompare.ae collects information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This includes your name, email address, phone number, and payment information." },
    { title: "2. How We Use Your Information", body: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions." },
    { title: "3. Information Sharing", body: "We do not share your personal information with third parties except as described in this policy. We may share your information with storage facility operators to facilitate your bookings, and with service providers who assist in our operations." },
    { title: "4. Data Security", body: "We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. All data is encrypted in transit and at rest." },
    { title: "5. Cookies", body: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier." },
    { title: "6. Your Rights", body: "You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us at privacy@storagecompare.ae." },
    { title: "7. Contact Us", body: "If you have any questions about this Privacy Policy, please contact us at info@storagecompare.ae or call +971 50 123 4567." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Privacy Policy"
          subtitle="Last updated: January 1, 2026"
          breadcrumbs={[{ label: 'Privacy Policy' }]}
        />
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {sections.map(({ title, body }) => (
                <div key={title} className="rounded-xl border border-gray-100 p-6"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-gray-100">
              <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
