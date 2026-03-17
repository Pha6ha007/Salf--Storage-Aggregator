'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  Building2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '@/lib/api/bookings';
import { BookingStatusBadge } from '@/components/user/BookingStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary text-right">{value}</span>
    </div>
  );
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getById(id),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancel(id),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Failed to cancel booking'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">Booking not found</h2>
        <p className="text-text-secondary mb-6">This booking doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  // Backend may return { data: booking } or booking directly
  const booking: any = (data as any)?.data ?? data;

  const canCancel = booking.status === 'pending';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary">Booking Details</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Ref: {booking.bookingNumber || `#${booking.id}`}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Warehouse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary-600" />
            Storage Facility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-semibold text-text-primary">{booking.warehouse?.name}</p>
          {(booking.warehouse?.address || booking.warehouse?.emirate) && (
            <p className="text-sm text-text-secondary flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {booking.warehouse?.address}
              {booking.warehouse?.emirate ? `, ${booking.warehouse.emirate}` : ''}
            </p>
          )}
          <Link
            href={`/warehouse/${booking.warehouseId}`}
            className="text-sm text-primary-600 hover:text-primary-700 hover:underline mt-1 inline-block"
          >
            View warehouse →
          </Link>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-primary-600" />
            Booking Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow
            label="Box"
            value={`${booking.box?.boxNumber ?? '—'} · Size ${booking.box?.size ?? '—'}`}
          />
          <DetailRow
            label="Start Date"
            value={
              booking.startDate
                ? new Date(booking.startDate).toLocaleDateString('en-AE', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : '—'
            }
          />
          <DetailRow
            label="End Date"
            value={
              booking.endDate
                ? new Date(booking.endDate).toLocaleDateString('en-AE', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : '—'
            }
          />
          <DetailRow
            label="Duration"
            value={`${booking.durationMonths ?? '—'} month${booking.durationMonths !== 1 ? 's' : ''}`}
          />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-primary-600" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow
            label="Monthly Rate"
            value={`${Number(booking.monthlyPrice || 0).toLocaleString()} AED`}
          />
          {booking.durationMonths && (
            <DetailRow
              label="Duration"
              value={`× ${booking.durationMonths} months`}
            />
          )}
          <div className="flex justify-between py-3 mt-2 bg-primary-50 rounded-lg px-3">
            <span className="font-semibold text-text-primary">Total Amount</span>
            <span className="font-bold text-primary-700 text-lg">
              {Number(booking.priceTotal || 0).toLocaleString()} AED
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Payment is collected offline by the operator.
          </p>
        </CardContent>
      </Card>

      {/* Notes */}
      {booking.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">{booking.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {canCancel && (
        <div className="flex justify-end pb-8">
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            disabled={cancelMutation.isPending}
            onClick={() => {
              if (confirm('Are you sure you want to cancel this booking?')) {
                cancelMutation.mutate();
              }
            }}
          >
            {cancelMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Cancel Booking
          </Button>
        </div>
      )}
    </div>
  );
}
