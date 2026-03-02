import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
        <Icon className="h-10 w-10 text-primary-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-text-primary">{title}</h3>
      <p className="mb-6 max-w-md text-text-secondary">{description}</p>
      {(actionLabel && actionHref) && (
        <Link href={actionHref}>
          <Button className="bg-primary-600 hover:bg-primary-700">
            {actionLabel}
          </Button>
        </Link>
      )}
      {(actionLabel && onAction) && (
        <Button onClick={onAction} className="bg-primary-600 hover:bg-primary-700">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
