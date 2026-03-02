import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number | string;
  reviewCount?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({
  rating,
  reviewCount = 0,
  showCount = true,
  size = "md",
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Convert rating to number in case it comes as a string from API
  const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(numericRating)
                ? "fill-accent-500 text-accent-500"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className={`${textSizeClasses[size]} text-text-secondary ml-1`}>
          {numericRating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
