'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { warehousesApi } from '@/lib/api/warehouses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateWarehouseDto } from '@/types/warehouse';
import type { ApiErrorResponse } from '@/types/api-error';

const warehouseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  full_address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  street: z.string().optional(),
  building: z.string().optional(),
  landmark: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

export default function NewWarehousePage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      latitude: 25.2048, // Dubai default
      longitude: 55.2708,
    },
  });

  const createMutation = useMutation({
    mutationFn: warehousesApi.create,
    onSuccess: (response) => {
      toast.success('Warehouse created successfully');
      router.push(`/operator/warehouses/${response.data.id}/edit`);
    },
    onError: (error) => {
      const apiErr = error as ApiErrorResponse;
      setApiError(
        apiErr?.response?.data?.error?.message || 'Failed to create warehouse'
      );
      toast.error('Failed to create warehouse');
    },
  });

  const onSubmit = (data: WarehouseFormData) => {
    setApiError('');

    const createData: CreateWarehouseDto = {
      name: data.name,
      description: data.description,
      address: {
        full_address: data.full_address,
        city: data.city,
        district: data.district,
        street: data.street,
        building: data.building,
        landmark: data.landmark,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      operating_hours: {
        is_24_7: false,
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '08:00', close: '18:00' },
        sunday: { is_closed: true, open: '00:00', close: '00:00' },
      },
      features: {
        climate_controlled: false,
        security_cameras: false,
        access_24_7: false,
        parking_available: false,
        loading_dock: false,
        insurance_available: false,
        online_payment: true,
      },
    };

    createMutation.mutate(createData);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Add New Warehouse
          </h1>
          <p className="mt-2 text-text-secondary">
            Create a new storage facility
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input
                id="name"
                {...registerField('name')}
                placeholder="e.g., Downtown Storage Center"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                {...registerField('description')}
                placeholder="Describe your warehouse facility..."
                className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_address">Full Address *</Label>
              <Input
                id="full_address"
                {...registerField('full_address')}
                placeholder="Street address, building, etc."
              />
              {errors.full_address && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.full_address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Emirate *</Label>
                <Input
                  id="city"
                  {...registerField('city')}
                  placeholder="e.g., Dubai"
                />
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  {...registerField('district')}
                  placeholder="e.g., Business Bay"
                />
                {errors.district && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  {...registerField('street')}
                  placeholder="Optional"
                />
              </div>

              <div>
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  {...registerField('building')}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                {...registerField('landmark')}
                placeholder="e.g., Near Metro Station"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...registerField('latitude', { valueAsNumber: true })}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...registerField('longitude', { valueAsNumber: true })}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-text-secondary">
              You can get coordinates from Google Maps by right-clicking on the
              location
            </p>
          </CardContent>
        </Card>

        {/* Error Display */}
        {apiError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-sm text-red-600">{apiError}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {createMutation.isPending ? 'Creating...' : 'Create Warehouse'}
          </Button>
        </div>
      </form>
    </div>
  );
}
