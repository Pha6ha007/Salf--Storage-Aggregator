'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Save,
  Send,
  Building2,
  MapPin,
  Phone,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { warehousesApi } from '@/lib/api/warehouses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── Schema matches backend CreateWarehouseDto exactly ─────────────────────────
const warehouseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  address: z.string().min(5, 'Full address is required'),
  emirate: z.string().min(2, 'Emirate is required').max(100),
  district: z.string().max(100).optional(),
  latitude: z
    .number({ invalid_type_error: 'Enter a valid latitude' })
    .min(-90)
    .max(90),
  longitude: z
    .number({ invalid_type_error: 'Enter a valid longitude' })
    .min(-180)
    .max(180),
  // Amenities
  hasClimateControl: z.boolean().default(false),
  has24x7Access: z.boolean().default(false),
  hasSecurityCameras: z.boolean().default(false),
  hasInsurance: z.boolean().default(false),
  hasParkingSpace: z.boolean().default(false),
  // Contact
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email('Invalid email').max(255).optional().or(z.literal('')),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

const AMENITIES: {
  field: keyof WarehouseFormData;
  label: string;
  description: string;
}[] = [
  { field: 'hasClimateControl', label: 'Climate Control', description: 'Temperature-regulated storage' },
  { field: 'has24x7Access', label: '24/7 Access', description: 'Round-the-clock entry' },
  { field: 'hasSecurityCameras', label: 'Security Cameras', description: 'CCTV surveillance' },
  { field: 'hasInsurance', label: 'Insurance Available', description: 'Contents insurance offered' },
  { field: 'hasParkingSpace', label: 'Parking', description: 'On-site parking for customers' },
];

export default function NewWarehousePage() {
  const router = useRouter();
  const [submitMode, setSubmitMode] = useState<'draft' | 'review'>('draft');
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      latitude: 25.2048,
      longitude: 55.2708,
      hasClimateControl: false,
      has24x7Access: false,
      hasSecurityCameras: false,
      hasInsurance: false,
      hasParkingSpace: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: warehousesApi.create,
    onSuccess: () => {
      toast.success(
        submitMode === 'draft'
          ? 'Warehouse saved as draft'
          : 'Warehouse submitted for review'
      );
      router.push('/operator/warehouses');
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create warehouse';
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      toast.error('Failed to create warehouse');
    },
  });

  const onSubmit = (data: WarehouseFormData) => {
    setApiError('');
    // Backend DTO fields — flat, camelCase
    createMutation.mutate({
      name: data.name,
      description: data.description,
      address: data.address,
      emirate: data.emirate,
      district: data.district || undefined,
      hasClimateControl: data.hasClimateControl,
      has24x7Access: data.has24x7Access,
      hasSecurityCameras: data.hasSecurityCameras,
      hasInsurance: data.hasInsurance,
      hasParkingSpace: data.hasParkingSpace,
      contactPhone: data.contactPhone || undefined,
      contactEmail: data.contactEmail || undefined,
    });
  };

  const amenityValues = watch([
    'hasClimateControl',
    'has24x7Access',
    'hasSecurityCameras',
    'hasInsurance',
    'hasParkingSpace',
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">New Warehouse</h1>
          <p className="mt-1 text-text-secondary">
            Fill in the details below. You can save as a draft and submit for review later.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Basic Information ──────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">
                Warehouse Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Al Quoz Secure Storage"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Describe your storage facility — size, security features, access policies..."
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Location ──────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">
                Full Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Building, street, area, UAE"
                className="mt-1"
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emirate">
                  Emirate <span className="text-red-500">*</span>
                </Label>
                <select
                  id="emirate"
                  {...register('emirate')}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select emirate...</option>
                  {EMIRATES.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
                {errors.emirate && (
                  <p className="text-sm text-red-600 mt-1">{errors.emirate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="district">District / Area</Label>
                <Input
                  id="district"
                  {...register('district')}
                  placeholder="e.g., Business Bay"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">
                  Latitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register('latitude', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.latitude && (
                  <p className="text-sm text-red-600 mt-1">{errors.latitude.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="longitude">
                  Longitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...register('longitude', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.longitude && (
                  <p className="text-sm text-red-600 mt-1">{errors.longitude.message}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-text-secondary">
              Right-click your location on{' '}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                Google Maps
              </a>{' '}
              to copy coordinates.
            </p>
          </CardContent>
        </Card>

        {/* ── Amenities ─────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-600" />
              Amenities & Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AMENITIES.map(({ field, label, description }, i) => {
                const checked = amenityValues[i] as boolean;
                return (
                  <label
                    key={field}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      checked
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-border hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      {...register(field as any)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{label}</p>
                      <p className="text-xs text-text-secondary">{description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-secondary">
              Optional — shown to customers on your warehouse page.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  {...register('contactPhone')}
                  placeholder="+971501234567"
                  className="mt-1"
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-600 mt-1">{errors.contactPhone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail')}
                  placeholder="storage@company.ae"
                  className="mt-1"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API error */}
        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex flex-1 gap-3 justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => setSubmitMode('draft')}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              onClick={() => setSubmitMode('review')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {createMutation.isPending ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
