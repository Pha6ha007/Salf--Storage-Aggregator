'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-600">
                StorageCompare
              </span>
              <span className="ml-1 text-sm text-gray-500">.ae</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              UAE's leading platform for finding and comparing self-storage
              solutions. Connect with trusted warehouse operators across the
              Emirates.
            </p>
            <p className="text-gray-500 text-xs">
              Serving Dubai, Abu Dhabi, Sharjah, and all UAE Emirates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Find Storage
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Operators */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Operators</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auth/register"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  List Your Warehouse
                </Link>
              </li>
              <li>
                <Link
                  href="/operator/dashboard"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Operator Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} StorageCompare.ae. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
