'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Calendar, User, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { operatorBookingsApi } from '@/lib/api/operator-bookings';
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

export default function OperatorBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['operatorBookings', { status: statusFilter, page }],
    queryFn: () =>
      operatorBookingsApi.list({ status: statusFilter, page, per_page: 12 }),
  });

  const confirmMutation = useMutation({
    mutationFn: operatorBookingsApi.confirm,
    onSuccess: () => {
      toast.success('Booking confirmed successfully');
      queryClient.invalidateQueries({ queryKey: ['operatorBookings'] });
    },
    onError: () => {
      toast.error('Failed to confirm booking');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) =>
      operatorBookingsApi.reject(id, { reason: 'Not available' }),
    onSuccess: () => {
      toast.success('Booking rejected');
      queryClient.invalidateQueries({ queryKey: ['operatorBookings'] });
    },
    onError: () => {
      toast.error('Failed to reject booking');
    },
  });

  const handleConfirm = (id: number) => {
    if (window.confirm('Confirm this booking?')) {
      confirmMutation.mutate(id);
    }
  };

  const handleReject = (id: number) => {
    if (window.confirm('Reject this booking?')) {
      rejectMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Bookings</h1>
        <p className="mt-2 text-text-secondary">
          Manage bookings for your warehouses
        </p>
      </div>

      {/* Status Filter Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
        data-testid="booking-status-filter"
      >
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
            <p className="text-center text-red-600">
              Failed to load bookings. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.data.length === 0 && (
        <EmptyState
          icon={Package}
          title="No bookings yet"
          description="Bookings from customers will appear here"
          actionLabel="View Warehouses"
          actionHref="/operator/warehouses"
        />
      )}

      {/* Bookings List */}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="grid gap-4" data-testid="bookings-list">
            {data.data.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
                data-testid="booking-card"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-text-primary">
                              {booking.warehouse.name}
                            </h3>
                            <BookingStatusBadge status={booking.status} />
                          </div>
                          <p className="text-sm text-text-secondary">
                            Booking #{booking.booking_number}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2 text-sm">
                          <User className="h-4 w-4 text-text-muted mt-0.5" />
                          <div>
                            <p className="font-medium text-text-primary">
                              {booking.user.name}
                            </p>
                            <p className="text-text-secondary">{booking.user.email}</p>
                            <p className="text-text-secondary">{booking.user.phone}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Package className="h-4 w-4" />
                            Box {booking.box.number} ({booking.box.size})
                          </div>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.start_date).toLocaleDateString()} —{' '}
                            {new Date(booking.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 pt-2 border-t border-border">
                        <span className="text-sm text-text-secondary">
                          {booking.price_per_month.toLocaleString()} AED/month
                        </span>
                        <span className="text-sm text-text-muted">·</span>
                        <span className="font-semibold text-primary-600">
                          Total: {booking.total_price.toLocaleString()} AED
                        </span>
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleConfirm(booking.id)}
                          disabled={confirmMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(booking.id)}
                          disabled={rejectMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
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
