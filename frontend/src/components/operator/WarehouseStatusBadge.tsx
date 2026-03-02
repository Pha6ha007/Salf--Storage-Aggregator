import { cn } from '@/lib/utils';
import type { WarehouseStatus } from '@/types/warehouse';

interface WarehouseStatusBadgeProps {
  status: WarehouseStatus;
  className?: string;
}

const statusConfig: Record<
  WarehouseStatus,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  pending_moderation: {
    label: 'Pending Review',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  blocked: {
    label: 'Blocked',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

export function WarehouseStatusBadge({
  status,
  className,
}: WarehouseStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
