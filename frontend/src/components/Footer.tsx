import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/about#how-it-works" },
      { label: "Contact Us", href: "/contact" },
    ],
    renters: [
      { label: "Find Storage", href: "/catalog" },
      { label: "FAQ", href: "/faq" },
      { label: "My Bookings", href: "/bookings" },
      { label: "Favorites", href: "/favorites" },
    ],
    operators: [
      { label: "List Your Warehouse", href: "/operator/dashboard" },
      { label: "Operator Dashboard", href: "/operator/dashboard" },
      { label: "Pricing", href: "/operator/pricing" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Renters Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              For Renters
            </h3>
            <ul className="space-y-2">
              {footerLinks.renters.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Operators Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              For Operators
            </h3>
            <ul className="space-y-2">
              {footerLinks.operators.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:info@storagecompare.ae"
                  className="hover:text-white transition-colors"
                >
                  info@storagecompare.ae
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+971501234567"
                  className="hover:text-white transition-colors"
                >
                  +971 50 123 4567
                </a>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>
            © {currentYear} StorageCompare.ae. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
