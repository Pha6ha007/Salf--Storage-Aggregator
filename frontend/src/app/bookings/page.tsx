'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, Calendar, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

type StatusFilter = 'all' | BookingStatus;

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const queryClient = useQueryClient();

  const { data: listData, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.list(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => bookingsApi.cancel(id),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Failed to cancel booking'),
  });

  const allBookings = listData?.data ?? [];

  // Client-side status filter (backend doesn't paginate)
  const filtered = useMemo(() => {
    if (statusFilter === 'all') return allBookings;
    return allBookings.filter((b: any) => b.status === statusFilter);
  }, [allBookings, statusFilter]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">My Bookings</h1>
        <p className="mt-2 text-text-secondary">
          {allBookings.length} total booking{allBookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Status Filter Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as StatusFilter)}
      >
        <TabsList>
          {statusFilters.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Failed to load bookings. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          icon={Package}
          title={statusFilter === 'all' ? 'No bookings yet' : `No ${statusFilter} bookings`}
          description={
            statusFilter === 'all'
              ? 'Find the perfect storage space and make your first booking.'
              : 'Try a different status filter.'
          }
          actionLabel={statusFilter === 'all' ? 'Browse Warehouses' : undefined}
          actionHref={statusFilter === 'all' ? '/catalog' : undefined}
        />
      )}

      {/* Bookings List */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map((booking: any) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                          {booking.warehouse?.name ?? '—'}
                        </h3>
                        {(booking.warehouse?.address || booking.warehouse?.emirate) && (
                          <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            {booking.warehouse?.address}
                            {booking.warehouse?.emirate ? `, ${booking.warehouse.emirate}` : ''}
                          </p>
                        )}
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                      {booking.box && (
                        <span className="flex items-center gap-1.5">
                          <Package className="h-4 w-4" />
                          Box {booking.box.boxNumber} · {booking.box.size}
                        </span>
                      )}
                      {booking.startDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.startDate).toLocaleDateString('en-AE', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                          {' — '}
                          {new Date(booking.endDate).toLocaleDateString('en-AE', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 text-sm">
                      <span className="text-text-secondary">
                        {Number(booking.monthlyPrice || 0).toLocaleString()} AED/month
                      </span>
                      <span className="text-text-muted">·</span>
                      <span className="font-semibold text-primary-600">
                        Total: {Number(booking.priceTotal || 0).toLocaleString()} AED
                      </span>
                    </div>

                    {/* Booking ref */}
                    <p className="text-xs text-text-muted">
                      Ref: {booking.bookingNumber || `#${booking.id}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </Link>
                    {booking.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        disabled={cancelMutation.isPending}
                        onClick={() => {
                          if (confirm('Cancel this booking?')) {
                            cancelMutation.mutate(booking.id);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
