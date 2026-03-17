import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

export default function CookiesPage() {
  const sections = [
    { title: "What Are Cookies", body: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners." },
    { title: "How We Use Cookies", body: "StorageCompare.ae uses cookies for authentication (to keep you logged in), security, and to remember your preferences. We use httpOnly cookies for authentication tokens which cannot be accessed by JavaScript, providing enhanced security." },
    { title: "Managing Cookies", body: "You can control and manage cookies in your browser settings. Removing or blocking cookies may impact your user experience and you may need to log in again. Parts of the website may no longer be fully accessible." },
    { title: "Contact", body: "If you have any questions about our use of cookies, contact us at info@storagecompare.ae." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Cookie Policy"
          subtitle="Last updated: January 1, 2026"
          breadcrumbs={[{ label: 'Cookie Policy' }]}
        />
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 mb-8">
              {sections.map(({ title, body }) => (
                <div key={title} className="rounded-xl border border-gray-100 p-6"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* Cookie table */}
            <div className="rounded-xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900 text-sm">Types of Cookies We Use</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { name: 'auth_token', desc: 'Authentication cookie (15 min). Keeps you logged in during your session.' },
                  { name: 'refresh_token', desc: 'Refresh token (7 days). Allows automatic renewal of your session.' },
                ].map(({ name, desc }) => (
                  <div key={name} className="flex gap-4 px-6 py-4">
                    <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded shrink-0 self-start mt-0.5">{name}</code>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
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
