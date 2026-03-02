'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WarehouseMap } from '@/components/WarehouseMap';
import { warehousesApi } from '@/lib/api/warehouses';
import { PhotoGallery } from './PhotoGallery';
import { BoxList } from './BoxList';
import { ReviewList } from './ReviewList';
import { Loader2 } from 'lucide-react';

export function WarehouseClient() {
  const params = useParams();
  const id = params.id as string;

  const { data: warehouse, isLoading: loadingWarehouse } = useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => warehousesApi.getById(id),
  });

  const { data: boxes = [] } = useQuery({
    queryKey: ['warehouse-boxes', id],
    queryFn: () => warehousesApi.getBoxes(id),
    enabled: !!warehouse,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['warehouse-reviews', id],
    queryFn: async () => {
      try {
        return await warehousesApi.getReviews(id);
      } catch (error) {
        // Reviews may require auth - return empty array if unauthorized
        return [];
      }
    },
    enabled: !!warehouse,
    retry: false, // Don't retry on auth errors
  });

  if (loadingWarehouse) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading warehouse details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Warehouse Not Found</h1>
            <p className="text-gray-600 mb-4">The warehouse you're looking for doesn't exist.</p>
            <Link href="/catalog" className="text-blue-600 hover:text-blue-800">
              Return to Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const availableBoxes = boxes.filter((b: any) => b.status === 'available');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50">
        {/* Photo Gallery */}
        <PhotoGallery warehouseId={warehouse.id} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            {' / '}
            <Link href="/catalog" className="text-blue-600 hover:text-blue-800">
              Catalog
            </Link>
            {' / '}
            <span className="text-gray-600">{warehouse.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {warehouse.name}
                </h1>

                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {warehouse.emirate}
                    {warehouse.district && `, ${warehouse.district}`}
                  </div>

                  {warehouse.rating && Number(warehouse.rating) > 0 && (
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-gray-900">
                        {Number(warehouse.rating).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({warehouse.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {warehouse.description && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {warehouse.description}
                  </p>
                )}

                {/* Features */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {warehouse.hasClimateControl && (
                      <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-blue-50 rounded-full">
                        Climate Control
                      </span>
                    )}
                    {warehouse.has24x7Access && (
                      <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-blue-50 rounded-full">
                        24/7 Access
                      </span>
                    )}
                    {warehouse.hasSecurityCameras && (
                      <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-blue-50 rounded-full">
                        Security Cameras
                      </span>
                    )}
                    {warehouse.hasParkingSpace && (
                      <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-blue-50 rounded-full">
                        Parking Available
                      </span>
                    )}
                    {warehouse.hasInsurance && (
                      <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-blue-50 rounded-full">
                        Insurance Available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Available Boxes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Available Units
                </h2>
                <BoxList boxes={boxes} warehouseId={warehouse.id} />
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Customer Reviews
                </h2>
                <ReviewList reviews={reviews} />
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Location</h2>
                  <p className="text-gray-600 text-sm mt-1">{warehouse.address}</p>
                </div>
                <WarehouseMap warehouses={[warehouse]} height="400px" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h3>

                {warehouse.operator && (
                  <div className="space-y-3">
                    {warehouse.operator.companyName && (
                      <div>
                        <p className="text-sm text-gray-500">Operator</p>
                        <p className="font-semibold text-gray-900">
                          {warehouse.operator.companyName}
                        </p>
                      </div>
                    )}

                    {warehouse.contactEmail && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a
                          href={`mailto:${warehouse.contactEmail}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {warehouse.contactEmail}
                        </a>
                      </div>
                    )}

                    {warehouse.contactPhone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a
                          href={`tel:${warehouse.contactPhone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {warehouse.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-1">Available Units</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {availableBoxes.length}
                    </p>
                  </div>

                  <Link
                    href="/auth/login"
                    className="block w-full py-3 px-4 bg-blue-600 text-white text-center font-semibold rounded-md hover:bg-blue-700 transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
