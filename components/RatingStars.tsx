import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRate,
}: RatingStarsProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = i === Math.floor(rating) && rating % 1 !== 0;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn('relative', interactive && 'cursor-pointer hover:scale-110 transition')}
          >
            <Star
              className={cn(
                sizes[size],
                filled ? 'fill-accent text-accent' : 'fill-gray-200 text-gray-200'
              )}
            />
            {partial && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star className={cn(sizes[size], 'fill-accent text-accent')} />
              </div>
            )}
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-semibold text-dark">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
