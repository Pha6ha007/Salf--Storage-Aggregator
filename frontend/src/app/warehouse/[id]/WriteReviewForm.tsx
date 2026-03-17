'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { reviewsApi } from '@/lib/api/reviews';
import { bookingsApi } from '@/lib/api/bookings';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Minimum 10 characters').max(2000),
});

type FormData = z.infer<typeof schema>;

interface Props {
  warehouseId: number;
}

export function WriteReviewForm({ warehouseId }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = watch('rating');

  // Find completed bookings for this warehouse
  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.list(),
    enabled: !!user,
  });

  const completedBooking = (Array.isArray(bookings) ? bookings : (bookings as any).data ?? [])
    .find((b: any) => b.box?.warehouseId === warehouseId && b.status === 'completed');

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      reviewsApi.create(warehouseId, {
        booking_id: completedBooking.id,
        rating: data.rating,
        comment: data.comment,
      }),
    onSuccess: () => {
      toast.success('Review submitted!');
      reset();
      queryClient.invalidateQueries({ queryKey: ['warehouse-reviews'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    },
  });

  if (!user) return null;
  if (!completedBooking) return null;

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        {/* Star rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue('rating', star, { shouldValidate: true })}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-0.5 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredStar || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-sm text-red-500 mt-1">Please select a rating</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <Textarea
            {...register('comment')}
            rows={4}
            placeholder="Share your experience with this storage facility..."
            className={errors.comment ? 'border-red-400' : ''}
          />
          {errors.comment && (
            <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending || rating === 0}
          className="w-full sm:w-auto"
        >
          {mutation.isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
}
