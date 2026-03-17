import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

export default function TermsPage() {
  const sections = [
    { title: "1. Acceptance of Terms", body: "By accessing and using StorageCompare.ae, you accept and agree to be bound by the terms and provision of this agreement. StorageCompare.ae is a marketplace platform connecting storage seekers with storage facility operators in the UAE." },
    { title: "2. Use of Platform", body: "StorageCompare.ae provides an online marketplace for self-storage services. We do not own or operate any storage facilities. Contracts for storage services are between users and operators directly. We facilitate the booking process only." },
    { title: "3. User Accounts", body: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account." },
    { title: "4. Bookings and Payments", body: "All bookings are subject to availability and confirmation by the storage operator. Payments are processed directly between users and operators. StorageCompare.ae is not responsible for payment disputes between users and operators." },
    { title: "5. Operator Responsibilities", body: "Storage operators are responsible for the accuracy of their listings, availability of units, maintaining their facilities in good condition, and complying with all applicable UAE laws and regulations. Operators must hold valid trade licenses." },
    { title: "6. Limitation of Liability", body: "StorageCompare.ae shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service. Our total liability shall not exceed the fees paid to us in the last 12 months." },
    { title: "7. Governing Law", body: "These Terms shall be governed by the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE." },
    { title: "8. Contact", body: "For questions about these Terms, contact us at legal@storagecompare.ae." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Terms of Service"
          subtitle="Last updated: January 1, 2026"
          breadcrumbs={[{ label: 'Terms of Service' }]}
        />
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
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
