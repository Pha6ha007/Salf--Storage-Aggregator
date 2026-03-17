'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { warehousesApi } from '@/lib/api/warehouses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const warehouseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  address: z.string().min(5, 'Full address is required'),
  emirate: z.string().min(2, 'Emirate is required').max(100),
  district: z.string().max(100).optional(),
  hasClimateControl: z.boolean().default(false),
  has24x7Access: z.boolean().default(false),
  hasSecurityCameras: z.boolean().default(false),
  hasInsurance: z.boolean().default(false),
  hasParkingSpace: z.boolean().default(false),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email('Invalid email').max(255).optional().or(z.literal('')),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

const EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
  'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah',
];

const AMENITIES: { field: keyof WarehouseFormData; label: string; description: string }[] = [
  { field: 'hasClimateControl', label: 'Climate Control', description: 'Temperature-regulated storage' },
  { field: 'has24x7Access', label: '24/7 Access', description: 'Round-the-clock entry' },
  { field: 'hasSecurityCameras', label: 'Security Cameras', description: 'CCTV surveillance' },
  { field: 'hasInsurance', label: 'Insurance Available', description: 'Contents insurance offered' },
  { field: 'hasParkingSpace', label: 'Parking', description: 'On-site parking for customers' },
];

export default function EditWarehousePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState('');

  const { data: warehouse, isLoading } = useQuery({
    queryKey: ['warehouse-edit', id],
    queryFn: () => warehousesApi.getById(id),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
  });

  // Populate form once warehouse data loads
  useEffect(() => {
    if (warehouse) {
      reset({
        name: warehouse.name,
        description: warehouse.description ?? '',
        address: warehouse.address,
        emirate: warehouse.emirate,
        district: warehouse.district ?? '',
        hasClimateControl: warehouse.hasClimateControl ?? false,
        has24x7Access: warehouse.has24x7Access ?? false,
        hasSecurityCameras: warehouse.hasSecurityCameras ?? false,
        hasInsurance: warehouse.hasInsurance ?? false,
        hasParkingSpace: warehouse.hasParkingSpace ?? false,
        contactPhone: (warehouse as any).contactPhone ?? '',
        contactEmail: (warehouse as any).contactEmail ?? '',
      });
    }
  }, [warehouse, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: WarehouseFormData) =>
      warehousesApi.update(id, {
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
      }),
    onSuccess: () => {
      toast.success('Warehouse updated');
      queryClient.invalidateQueries({ queryKey: ['operatorWarehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-edit', id] });
      router.push('/operator/warehouses');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.response?.data?.error || 'Update failed';
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      toast.error('Failed to update warehouse');
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: () => warehousesApi.changeStatus(id, 'pending_moderation'),
    onSuccess: () => {
      toast.success('Warehouse submitted for review');
      queryClient.invalidateQueries({ queryKey: ['operatorWarehouses'] });
      router.push('/operator/warehouses');
    },
    onError: () => toast.error('Failed to submit for review'),
  });

  const amenityValues = watch([
    'hasClimateControl', 'has24x7Access', 'hasSecurityCameras', 'hasInsurance', 'hasParkingSpace',
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="text-center py-24">
        <p className="text-text-secondary">Warehouse not found.</p>
        <Button variant="outline" onClick={() => router.push('/operator/warehouses')} className="mt-4">
          Back to Warehouses
        </Button>
      </div>
    );
  }

  const isDraft = warehouse.status === 'draft';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text-primary">Edit Warehouse</h1>
          <p className="mt-1 text-text-secondary">{warehouse.name}</p>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              warehouse.status === 'active'
                ? 'bg-green-100 text-green-700'
                : warehouse.status === 'pending_moderation'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {warehouse.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Warehouse Name <span className="text-red-500">*</span></Label>
              <Input id="name" {...register('name')} className="mt-1" />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Full Address <span className="text-red-500">*</span></Label>
              <Input id="address" {...register('address')} className="mt-1" />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emirate">Emirate <span className="text-red-500">*</span></Label>
                <select
                  id="emirate"
                  {...register('emirate')}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {EMIRATES.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
                {errors.emirate && (
                  <p className="text-sm text-red-600 mt-1">{errors.emirate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="district">District / Area</Label>
                <Input id="district" {...register('district')} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
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

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input id="contactPhone" {...register('contactPhone')} placeholder="+971501234567" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input id="contactEmail" type="email" {...register('contactEmail')} placeholder="storage@company.ae" className="mt-1" />
                {errors.contactEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <Button type="button" variant="outline" onClick={() => router.push('/operator/warehouses')}>
            Cancel
          </Button>
          <div className="flex flex-1 gap-3 justify-end">
            {isDraft && (
              <Button
                type="button"
                variant="outline"
                disabled={submitForReviewMutation.isPending}
                onClick={() => submitForReviewMutation.mutate()}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
            )}
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
