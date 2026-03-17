import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import { ChatWidget } from "@/components/chat/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://storagecompare.ae'),
  title: {
    default: "StorageCompare.ae - Find Self-Storage in UAE",
    template: "%s | StorageCompare.ae",
  },
  description: "UAE's leading platform for finding and comparing self-storage solutions. Connect with trusted warehouse operators across Dubai, Abu Dhabi, and all Emirates.",
  keywords: [
    "self storage UAE",
    "storage Dubai",
    "warehouse Abu Dhabi",
    "storage units UAE",
    "self storage Dubai",
    "storage facilities UAE",
  ],
  authors: [{ name: "StorageCompare.ae" }],
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "/",
    siteName: "StorageCompare.ae",
    title: "StorageCompare.ae - Find Self-Storage in UAE",
    description: "UAE's leading platform for finding and comparing self-storage solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "StorageCompare.ae - Find Self-Storage in UAE",
    description: "UAE's leading platform for finding and comparing self-storage solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StorageCompare.ae',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
            <ChatWidget />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
