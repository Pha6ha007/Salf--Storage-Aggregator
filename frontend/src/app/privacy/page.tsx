import Link from "next/link";
import { Shield, Eye, Share2, Lock, Cookie, UserCheck, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

const sections = [
  {
    icon: Eye,
    title: "1. Information We Collect",
    body: "We collect information you provide when creating an account, making a booking, or contacting support: your name, email address, phone number, and payment information. We also collect usage data such as pages visited and search queries to improve our platform.",
  },
  {
    icon: Shield,
    title: "2. How We Use Your Information",
    body: "We use your information to provide and improve our services, process bookings, send booking confirmations and support messages, and respond to your questions. We do not sell your data to third parties.",
  },
  {
    icon: Share2,
    title: "3. Information Sharing",
    body: "We share your information with storage operators only as needed to facilitate your bookings (e.g. your name and contact details). We use trusted service providers (payment processors, email services) under strict data processing agreements.",
  },
  {
    icon: Lock,
    title: "4. Data Security",
    body: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use secure, httpOnly cookies for authentication. Our infrastructure is hosted in certified data centers with regular security audits.",
  },
  {
    icon: Cookie,
    title: "5. Cookies",
    body: "We use essential httpOnly cookies for authentication and session management. We do not use tracking or advertising cookies. See our Cookie Policy for full details.",
  },
  {
    icon: UserCheck,
    title: "6. Your Rights",
    body: "You have the right to access, update, export, or delete your personal data at any time via your account settings. To request data deletion, contact privacy@storagecompare.ae. We respond within 30 days.",
  },
  {
    icon: Mail,
    title: "7. Contact Us",
    body: "Questions about this Privacy Policy? Email privacy@storagecompare.ae or call +971 4 300 0000. We're available Sunday–Thursday, 9 AM–6 PM GST.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Privacy Policy"
          subtitle="We take your privacy seriously. Here's exactly what we collect, how we use it, and your rights."
          breadcrumbs={[{ label: "Privacy Policy" }]}
        />

        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Last updated */}
            <div className="flex items-center gap-3 mb-10 p-4 rounded-xl"
              style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe" }}>
              <Shield className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Last updated: January 1, 2026</p>
                <p className="text-xs text-blue-700">Applies to all StorageCompare.ae users and operators</p>
              </div>
            </div>

            <div className="space-y-4">
              {sections.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-5 rounded-2xl border border-gray-100 p-6"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" }}>
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
              <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
              <div className="flex gap-4">
                <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600">Terms of Service</Link>
                <Link href="/cookies" className="text-sm text-gray-400 hover:text-gray-600">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
