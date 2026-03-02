"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Heart, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./RatingStars";

interface WarehouseCardProps {
  warehouse: {
    id: string;
    name: string;
    emirate: string;
    district?: string;
    rating?: number;
    totalReviews?: number;
    minPrice?: number;
    verified?: boolean;
    availableSizes?: string[];
    photoUrl?: string;
  };
  onFavoriteClick?: (id: string) => void;
  isFavorite?: boolean;
}

export function WarehouseCard({
  warehouse,
  onFavoriteClick,
  isFavorite = false,
}: WarehouseCardProps) {
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    onFavoriteClick?.(warehouse.id);
  };

  const photoUrl = warehouse.photoUrl || "/placeholder-warehouse.jpg";
  const rating = warehouse.rating || 0;
  const reviewCount = warehouse.totalReviews || 0;
  const availableSizes = warehouse.availableSizes || ["S", "M", "L"];

  return (
    <Link href={`/warehouse/${warehouse.id}`}>
      <Card className="overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border group">
        {/* Photo */}
        <div className="relative w-full aspect-[4/3] bg-gray-200">
          <img
            src={photoUrl}
            alt={warehouse.name}
            className="w-full h-full object-cover"
          />
          {/* Verified Badge */}
          {warehouse.verified && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          )}
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-4 h-4 ${
                localFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          {/* Warehouse Name */}
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
            {warehouse.name}
          </h3>

          {/* Rating & Location */}
          <div className="flex items-center gap-3">
            <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
            <span className="text-sm text-text-secondary">·</span>
            <div className="flex items-center text-sm text-text-secondary">
              <MapPin className="w-3 h-3 mr-1" />
              {warehouse.district || warehouse.emirate}
            </div>
          </div>

          {/* Available Sizes */}
          <div className="flex items-center gap-1.5">
            {availableSizes.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="bg-primary-50 text-primary-700 rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {size}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="pt-1">
            {warehouse.minPrice ? (
              <p className="text-lg font-bold text-primary-600">
                From {warehouse.minPrice} AED/month
              </p>
            ) : (
              <p className="text-sm text-text-muted">Contact for pricing</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
