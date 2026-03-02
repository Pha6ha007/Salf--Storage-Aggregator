import type { BookingStatus } from '@/types/booking';
import { Badge } from '../ui/badge';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-700' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
}
