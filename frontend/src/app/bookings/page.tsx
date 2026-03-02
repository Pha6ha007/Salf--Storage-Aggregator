'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, Calendar, MapPin } from 'lucide-react';
import { bookingsApi } from '@/lib/api/bookings';
import { EmptyState } from '@/components/EmptyState';
import { BookingStatusBadge } from '@/components/user/BookingStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BookingStatus } from '@/types/booking';

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookings', { status: statusFilter, page }],
    queryFn: () => bookingsApi.list({ status: statusFilter, page, per_page: 12 }),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">My Bookings</h1>
        <p className="mt-2 text-text-secondary">
          View and manage your storage bookings
        </p>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)} data-testid="booking-status-filter">
        <TabsList>
          {statusFilters.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-text-secondary">Loading bookings...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Failed to load bookings. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.data.length === 0 && (
        <EmptyState
          icon={Package}
          title="No bookings yet"
          description="Find the perfect storage space and make your first booking."
          actionLabel="Browse Warehouses"
          actionHref="/catalog"
        />
      )}

      {/* Bookings List */}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="grid gap-4" data-testid="bookings-list">
            {data.data.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow" data-testid="booking-card">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {booking.warehouse.name}
                          </h3>
                          <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                            <MapPin className="h-4 w-4" />
                            {booking.warehouse.address.full_address}
                          </p>
                        </div>
                        <BookingStatusBadge status={booking.status} />
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          Box {booking.box.number} ({booking.box.size})
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-text-secondary">
                          {booking.price_per_month.toLocaleString()} AED/month
                        </span>
                        <span className="text-sm text-text-muted">·</span>
                        <span className="font-semibold text-primary-600">
                          Total: {booking.total_price.toLocaleString()} AED
                        </span>
                      </div>
                    </div>

                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.pagination.has_previous}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-text-secondary">
                Page {data.pagination.page} of {data.pagination.total_pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.pagination.has_next}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
