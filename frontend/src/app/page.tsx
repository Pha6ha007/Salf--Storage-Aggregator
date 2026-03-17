"use client";

import Link from "next/link";
import { Search, Package, CheckCircle, MapPin, Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { WarehouseCard } from "@/components/WarehouseCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInView } from "@/hooks/useInView";
import { warehousesApi } from "@/lib/api/warehouses";

const POPULAR_AREAS = [
  { name: "Dubai", count: null, emirate: "Dubai" },
  { name: "Abu Dhabi", count: null, emirate: "Abu Dhabi" },
  { name: "Sharjah", count: null, emirate: "Sharjah" },
  { name: "Ajman", count: null, emirate: "Ajman" },
  { name: "Ras Al Khaimah", count: null, emirate: "Ras Al Khaimah" },
  { name: "Fujairah", count: null, emirate: "Fujairah" },
];

export default function Home() {
  const [howItWorksRef, howItWorksInView] = useInView();
  const [popularAreasRef, popularAreasInView] = useInView();
  const [featuredRef, featuredInView] = useInView();

  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ["warehouses-featured"],
    queryFn: () =>
      warehousesApi.list({
        status: "active",
        sortBy: "rating",
        sortOrder: "desc",
        limit: 6,
        page: 1,
      }),
    staleTime: 5 * 60 * 1000, // 5 min — home page doesn't need real-time freshness
  });

  const featuredWarehouses = featuredData?.data ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-950 via-primary-800 to-primary-700 text-white py-20 md:py-32 overflow-hidden hero-pattern">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent animate-pulse-soft pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight-hero leading-heading mb-6">
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
                  <span>
                    {featuredData?.meta?.total
                      ? `${featuredData.meta.total}+ warehouses`
                      : "50+ warehouses"}
                  </span>
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
        <section
          ref={howItWorksRef}
          className={`py-16 md:py-24 bg-white transition-all duration-700 ${
            howItWorksInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
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
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Search</h3>
                <p className="text-text-secondary">
                  Browse verified warehouses in your area with our advanced search filters
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Compare</h3>
                <p className="text-text-secondary">
                  Compare prices, sizes, features and reviews to find the perfect fit
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Book</h3>
                <p className="text-text-secondary">
                  Reserve your unit online and move in at your convenience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Areas */}
        <section
          ref={popularAreasRef}
          className={`py-16 md:py-24 bg-surface transition-all duration-700 ${
            popularAreasInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
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
                  href={`/catalog?emirate=${encodeURIComponent(area.emirate)}`}
                >
                  <Card className="p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-border hover:border-primary-200 group">
                    <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-text-primary">{area.name}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Warehouses */}
        <section
          ref={featuredRef}
          className={`py-16 md:py-24 bg-white transition-all duration-700 ${
            featuredInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Featured Warehouses
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Top-rated storage facilities across the UAE
              </p>
            </div>

            {loadingFeatured ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
              </div>
            ) : featuredWarehouses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredWarehouses.map((warehouse, i) => (
                    <div
                      key={warehouse.id}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${i * 60}ms`,
                        animationFillMode: "both",
                        opacity: featuredInView ? 1 : 0,
                      }}
                    >
                      <WarehouseCard warehouse={warehouse} />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/catalog">
                    <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                      View All Warehouses
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              /* No data yet — graceful placeholder */
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-primary-200 mx-auto mb-4" />
                <p className="text-text-secondary text-lg mb-4">
                  No warehouses listed yet. Be the first operator!
                </p>
                <Link href="/auth/register">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                    List Your Warehouse
                  </Button>
                </Link>
              </div>
            )}
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
              Our AI-powered box finder helps you determine the perfect storage size based on your
              items
            </p>
            <Link href="/ai/box-finder">
              <Button size="lg" className="bg-white text-accent-600 hover:bg-gray-100">
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
