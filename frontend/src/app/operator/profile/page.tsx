'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { operatorsApi } from '@/lib/api/operators';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  description: z.string().max(1000).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof schema>;

export default function OperatorProfilePage() {
  const queryClient = useQueryClient();

  const { data: operator, isLoading } = useQuery({
    queryKey: ['operatorProfile'],
    queryFn: () => operatorsApi.getProfile(),
  });

  const profile = (operator as any)?.data ?? operator;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    values: profile ? {
      companyName: profile.companyName ?? '',
      contactEmail: profile.contactEmail ?? profile.businessEmail ?? '',
      contactPhone: profile.contactPhone ?? profile.businessPhone ?? '',
      description: profile.description ?? '',
      website: profile.website ?? '',
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileFormData) => operatorsApi.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['operatorProfile'] });
      reset(undefined, { keepValues: true });
    },
    onError: () => toast.error('Failed to update profile'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Business Profile</h1>
        <p className="mt-2 text-text-secondary">Update your company information visible to customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>This information is shown on your warehouse listings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Company Name *</label>
              <Input {...register('companyName')} className={errors.companyName ? 'border-red-400' : ''} />
              {errors.companyName && <p className="text-sm text-red-500 mt-1">{errors.companyName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Business Email</label>
                <Input {...register('contactEmail')} type="email" className={errors.contactEmail ? 'border-red-400' : ''} />
                {errors.contactEmail && <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Business Phone</label>
                <Input {...register('contactPhone')} type="tel" placeholder="+971..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Website</label>
              <Input {...register('website')} type="url" placeholder="https://..." className={errors.website ? 'border-red-400' : ''} />
              {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Tell customers about your storage facilities..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
                Discard
              </Button>
              <Button type="submit" disabled={!isDirty || mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
