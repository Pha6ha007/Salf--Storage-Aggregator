"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Heart, ShieldCheck, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./RatingStars";

interface WarehouseCardProps {
  warehouse: {
    id: string | number;
    name: string;
    emirate: string;
    district?: string | null;
    rating?: number | string | null;
    totalReviews?: number | null;
    reviewCount?: number | null;
    minPrice?: number | null;
    verified?: boolean | null;
    availableSizes?: string[] | null;
    photoUrl?: string | null;
    primaryPhoto?: string | null;
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
    onFavoriteClick?.(String(warehouse.id));
  };

  const photoUrl = warehouse.photoUrl || warehouse.primaryPhoto;
  const rating = warehouse.rating || 0;
  const reviewCount = warehouse.totalReviews ?? warehouse.reviewCount ?? 0;
  const availableSizes = warehouse.availableSizes || ["S", "M", "L"];

  return (
    <Link href={`/warehouse/${warehouse.id}`}>
      <Card className="overflow-hidden bg-white rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 ease-smooth border border-border hover:border-primary-200 group">
        {/* Photo */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
          {photoUrl ? (
            <>
            <img
              src={photoUrl}
              alt={warehouse.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#eff6ff 0%,#dbeafe 50%,#e0f2fe 100%)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
                style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}>
                <Building2 className="w-7 h-7 text-blue-400" />
              </div>
              <p className="text-xs font-medium text-blue-400">No photo yet</p>
            </div>
          )}
          {/* Verified Badge */}
          {warehouse.verified && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 backdrop-blur-sm text-green-700 border border-green-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          )}
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
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
              <div>
                <span className="text-xs text-text-muted">From</span>
                <span className="text-2xl font-light text-primary-600 ml-1">{warehouse.minPrice}</span>
                <span className="text-sm text-text-secondary"> AED/month</span>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Contact for pricing</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
