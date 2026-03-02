/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone for optimal Docker/Vercel deployment
  output: 'standalone',

  // Strict mode for better development experience
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: [
      'storagecompare-media-production.s3.me-south-1.amazonaws.com',
      'placehold.co', // For development/testing
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;
