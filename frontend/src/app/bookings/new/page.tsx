'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Package, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '@/lib/api/bookings';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const DURATION_OPTIONS = [
  { months: 1, label: '1 month' },
  { months: 3, label: '3 months' },
  { months: 6, label: '6 months' },
  { months: 12, label: '12 months' },
  { months: 24, label: '24 months' },
];

function NewBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boxId = Number(searchParams.get('boxId'));
  const warehouseId = Number(searchParams.get('warehouseId'));

  const [durationMonths, setDurationMonths] = useState(1);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Default: tomorrow
    return d.toISOString().split('T')[0];
  });

  // Load box details
  const { data: boxData, isLoading: loadingBox } = useQuery({
    queryKey: ['box', boxId],
    queryFn: () => api.get(`/boxes/${boxId}`).then((r) => r.data),
    enabled: !!boxId,
  });

  // Load warehouse details
  const { data: warehouseData } = useQuery({
    queryKey: ['warehouse', warehouseId],
    queryFn: () => api.get(`/warehouses/${warehouseId}`).then((r) => r.data),
    enabled: !!warehouseId,
  });

  const box = (boxData as any)?.data ?? boxData;
  const warehouse = (warehouseData as any)?.data ?? warehouseData;

  const pricePerMonth = Number(box?.priceMonthly ?? box?.pricePerMonth ?? 0);
  const totalPrice = pricePerMonth * durationMonths;

  const endDate = (() => {
    if (!startDate) return '';
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + durationMonths);
    return d.toISOString().split('T')[0];
  })();

  const createMutation = useMutation({
    mutationFn: () =>
      bookingsApi.create({
        warehouseId,
        boxId,
        startDate,
        durationMonths,
      }),
    onSuccess: (result) => {
      toast.success('Booking created successfully!');
      router.push('/bookings');
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create booking';
      toast.error(typeof msg === 'string' ? msg : 'Failed to create booking');
    },
  });

  if (!boxId || !warehouseId) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <p className="text-text-secondary mb-4">Invalid booking link — missing box or warehouse ID.</p>
        <Button variant="outline" onClick={() => router.push('/catalog')}>
          Browse Warehouses
        </Button>
      </div>
    );
  }

  if (loadingBox) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8 px-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-text-primary">Confirm Booking</h1>
      </div>

      {/* Warehouse + Box Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-primary-600" />
            Storage Unit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {warehouse && (
            <div>
              <p className="font-semibold text-text-primary">{warehouse.name}</p>
              <p className="text-sm text-text-secondary">{warehouse.address}, {warehouse.emirate}</p>
            </div>
          )}
          {box && (
            <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Unit {box.boxNumber} · {box.size}
                </p>
                {box.name && <p className="text-xs text-text-secondary">{box.name}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary-700">
                  AED {pricePerMonth.toLocaleString()}/month
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary-600" />
            Booking Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Start Date */}
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Duration */}
          <div>
            <Label>Duration</Label>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.months}
                  type="button"
                  onClick={() => setDurationMonths(opt.months)}
                  className={`py-2 px-1 text-sm rounded-lg border font-medium transition ${
                    durationMonths === opt.months
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-border text-text-secondary hover:border-primary-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* End date preview */}
          {endDate && (
            <p className="text-sm text-text-secondary">
              Your storage ends on{' '}
              <strong>
                {new Date(endDate).toLocaleDateString('en-AE', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card className="border-primary-200 bg-primary-50">
        <CardContent className="pt-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">
              AED {pricePerMonth.toLocaleString()} × {durationMonths} month{durationMonths !== 1 ? 's' : ''}
            </span>
            <span className="font-medium">AED {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-primary-200 pt-2">
            <span className="text-text-primary">Total</span>
            <span className="text-primary-700">AED {totalPrice.toLocaleString()}</span>
          </div>
          <p className="text-xs text-text-secondary pt-1">
            Payment is collected offline by the operator after confirmation.
          </p>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3 pb-8">
        <Button variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending || !startDate || !boxId || !warehouseId}
          className="flex-1 bg-primary-600 hover:bg-primary-700"
        >
          {createMutation.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Booking...</>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    }>
      <NewBookingContent />
    </Suspense>
  );
}
