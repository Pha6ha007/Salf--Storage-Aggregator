import Link from "next/link";
import { Search, Package, CheckCircle, MapPin, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { WarehouseCard } from "@/components/WarehouseCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock data for featured warehouses
const FEATURED_WAREHOUSES = [
  {
    id: "1",
    name: "Al Quoz Secure Storage",
    emirate: "Dubai",
    district: "Al Quoz",
    rating: 4.8,
    totalReviews: 124,
    minPrice: 150,
    verified: true,
    availableSizes: ["S", "M", "L"],
    photoUrl: "https://placehold.co/600x400/1A56DB/white?text=Storage+1",
  },
  {
    id: "2",
    name: "Musaffah Industrial Storage",
    emirate: "Abu Dhabi",
    district: "Musaffah",
    rating: 4.6,
    totalReviews: 89,
    minPrice: 200,
    verified: true,
    availableSizes: ["M", "L", "XL"],
    photoUrl: "https://placehold.co/600x400/1A56DB/white?text=Storage+2",
  },
  {
    id: "3",
    name: "Sharjah City Storage",
    emirate: "Sharjah",
    district: "Industrial Area",
    rating: 4.5,
    totalReviews: 67,
    minPrice: 120,
    verified: true,
    availableSizes: ["S", "M"],
    photoUrl: "https://placehold.co/600x400/1A56DB/white?text=Storage+3",
  },
  {
    id: "4",
    name: "JLT Premium Storage",
    emirate: "Dubai",
    district: "JLT",
    rating: 4.9,
    totalReviews: 156,
    minPrice: 250,
    verified: true,
    availableSizes: ["S", "M", "L"],
    photoUrl: "https://placehold.co/600x400/1A56DB/white?text=Storage+4",
  },
  {
    id: "5",
    name: "Dubai Marina Storage",
    emirate: "Dubai",
    district: "Marina",
    rating: 4.7,
    totalReviews: 98,
    minPrice: 300,
    verified: true,
    availableSizes: ["S", "M"],
    photoUrl: "https://placehold.co/600x400/1A56DB/white?text=Storage+5",
  },
  {
    id: "6",
    name: "Ajman Budget Storage",
    emirate: "Ajman",
    district: "Industrial",
    rating: 4.3,
    totalReviews: 45,
    minPrice: 100,
    verified: false,
    availableSizes: ["S", "M", "L"],
    photoUrl: "https://placehold.co/600x400/1A56DB/white?text=Storage+6",
  },
];

const POPULAR_AREAS = [
  { name: "Dubai", count: 127, emirate: "dubai" },
  { name: "Abu Dhabi", count: 89, emirate: "abu-dhabi" },
  { name: "Sharjah", count: 56, emirate: "sharjah" },
  { name: "Ajman", count: 34, emirate: "ajman" },
  { name: "Ras Al Khaimah", count: 23, emirate: "ras-al-khaimah" },
  { name: "Fujairah", count: 18, emirate: "fujairah" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Find Storage in the UAE
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Compare self-storage solutions across all 7 emirates
              </p>

              {/* Search Bar */}
              <SearchBar variant="hero" />

              {/* Trust Counter */}
              <div className="mt-8 flex items-center justify-center gap-8 text-primary-100">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span>50+ warehouses</span>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>All 7 emirates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Find and book your storage in three simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Search
                </h3>
                <p className="text-text-secondary">
                  Browse verified warehouses in your area with our advanced
                  search filters
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Compare
                </h3>
                <p className="text-text-secondary">
                  Compare prices, sizes, features and reviews to find the
                  perfect fit
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Book
                </h3>
                <p className="text-text-secondary">
                  Reserve your unit online and move in at your convenience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Areas */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Popular Areas
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {POPULAR_AREAS.map((area) => (
                <Link
                  key={area.emirate}
                  href={`/catalog?emirate=${area.emirate}`}
                >
                  <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-text-primary">
                      {area.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      {area.count} warehouses
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Warehouses */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Featured Warehouses
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Top-rated storage facilities across the UAE
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_WAREHOUSES.map((warehouse) => (
                <WarehouseCard key={warehouse.id} warehouse={warehouse} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/catalog">
                <Button
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  View All Warehouses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Box Finder CTA */}
        <section className="py-16 md:py-24 bg-accent-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not sure what size you need?
            </h2>
            <p className="text-xl text-accent-100 mb-8">
              Our AI-powered box finder helps you determine the perfect storage
              size based on your items
            </p>
            <Link href="/ai/box-finder">
              <Button
                size="lg"
                className="bg-white text-accent-600 hover:bg-gray-100"
              >
                Try AI Box Finder
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
