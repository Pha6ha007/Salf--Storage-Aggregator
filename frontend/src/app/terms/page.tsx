import Link from "next/link";
import { FileText, Users, CreditCard, Building2, AlertTriangle, Scale, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    body: "By accessing and using StorageCompare.ae, you accept and agree to be bound by these terms. StorageCompare.ae is a marketplace platform connecting storage seekers with storage facility operators in the UAE. Using our platform constitutes acceptance of these terms.",
  },
  {
    icon: Building2,
    title: "2. Use of Platform",
    body: "StorageCompare.ae provides an online marketplace for self-storage services. We do not own or operate any storage facilities. All contracts for storage services are made directly between users and operators. We facilitate the booking process and are not party to storage agreements.",
  },
  {
    icon: Users,
    title: "3. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must be at least 18 years old to use the platform. Accounts must not be shared or transferred.",
  },
  {
    icon: CreditCard,
    title: "4. Bookings and Payments",
    body: "All bookings are subject to availability and operator confirmation. Payments are made directly between users and storage operators — StorageCompare.ae does not process or hold payments. Cancellation policies are set by individual operators and shown on each listing.",
  },
  {
    icon: Building2,
    title: "5. Operator Responsibilities",
    body: "Operators must hold valid UAE trade licenses, maintain accurate and up-to-date listings, keep facilities in good condition, and comply with all applicable UAE laws. Operators are solely responsible for the storage services they provide.",
  },
  {
    icon: AlertTriangle,
    title: "6. Limitation of Liability",
    body: "StorageCompare.ae is not liable for any loss, theft, or damage to stored items. We are not responsible for disputes between users and operators. Our total liability in any matter shall not exceed fees paid to us in the preceding 12 months.",
  },
  {
    icon: Scale,
    title: "7. Governing Law",
    body: "These Terms are governed by the laws of the United Arab Emirates. All disputes are subject to the exclusive jurisdiction of the courts of Dubai, UAE. If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.",
  },
  {
    icon: Mail,
    title: "8. Contact",
    body: "For questions about these Terms, email legal@storagecompare.ae. We respond within 3 business days.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Terms of Service"
          subtitle="Please read these terms carefully before using StorageCompare.ae."
          breadcrumbs={[{ label: "Terms of Service" }]}
        />

        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3 mb-10 p-4 rounded-xl"
              style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe" }}>
              <FileText className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Last updated: January 1, 2026</p>
                <p className="text-xs text-blue-700">Effective immediately for all users</p>
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
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">Privacy Policy</Link>
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
