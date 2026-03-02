import { Card } from "@/components/ui/card";

export function WarehouseCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white rounded-xl shadow-card border border-border">
      {/* Image skeleton */}
      <div className="aspect-[4/3] skeleton-shimmer" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 rounded skeleton-shimmer" />

        {/* Rating + Location */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 rounded skeleton-shimmer" />
          <div className="h-4 w-16 rounded skeleton-shimmer" />
        </div>

        {/* Size pills */}
        <div className="flex gap-1.5">
          <div className="h-6 w-8 rounded-full skeleton-shimmer" />
          <div className="h-6 w-8 rounded-full skeleton-shimmer" />
          <div className="h-6 w-8 rounded-full skeleton-shimmer" />
        </div>

        {/* Price */}
        <div className="h-6 w-32 rounded skeleton-shimmer" />
      </div>
    </Card>
  );
}
