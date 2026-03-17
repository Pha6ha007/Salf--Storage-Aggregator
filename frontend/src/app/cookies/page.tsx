import Link from "next/link";
import { Cookie, Settings, Shield, ToggleLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";

const sections = [
  {
    icon: Cookie,
    title: "What Are Cookies",
    body: "Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and improve functionality. We use only essential cookies — no advertising or tracking cookies.",
  },
  {
    icon: Shield,
    title: "How We Use Cookies",
    body: "StorageCompare.ae uses httpOnly cookies for authentication — these cannot be read by JavaScript, providing an important security layer. We use cookies to keep you logged in between sessions and to protect against CSRF attacks.",
  },
  {
    icon: Settings,
    title: "Managing Cookies",
    body: "You can block or delete cookies in your browser settings. However, this will log you out and some platform features will not work. We recommend keeping authentication cookies enabled for the best experience.",
  },
  {
    icon: ToggleLeft,
    title: "Third-Party Cookies",
    body: "We do not use third-party advertising or tracking cookies. We may use essential third-party services (like analytics) that set their own cookies — these are always covered by their respective privacy policies.",
  },
];

const COOKIE_TABLE = [
  { name: "auth_token", duration: "15 minutes", purpose: "Keeps you authenticated during your browser session. Refreshed automatically while active." },
  { name: "refresh_token", duration: "7 days", purpose: "Allows automatic renewal of your auth_token without requiring you to log in again." },
];

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Cookie Policy"
          subtitle="We use only essential authentication cookies. No advertising, no tracking."
          breadcrumbs={[{ label: "Cookie Policy" }]}
        />

        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3 mb-10 p-4 rounded-xl"
              style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0" }}>
              <Shield className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-900">Privacy-first approach</p>
                <p className="text-xs text-green-700">We use the minimum cookies required for the platform to function. No tracking, no ads.</p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {sections.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-5 rounded-2xl border border-gray-100 p-6"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
                    <Icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cookie table */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-4 border-b border-gray-100"
                style={{ background: "linear-gradient(135deg,#f8faff,#eff6ff)" }}>
                <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <Cookie className="h-4 w-4 text-blue-600" />
                  Cookies We Set
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {COOKIE_TABLE.map(({ name, duration, purpose }) => (
                  <div key={name} className="px-6 py-5">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-semibold">{name}</code>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{duration}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
              <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
              <div className="flex gap-4">
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">Privacy Policy</Link>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600">Terms of Service</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
