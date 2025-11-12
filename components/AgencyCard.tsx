import Link from 'next/link';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { MapPin, DollarSign } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  location_city: string | null;
  location_region: string | null;
  services: string[];
  avg_rating: number;
  reviews_count: number;
  is_premium: boolean;
  is_verified: boolean;
  price_range: string | null;
}

export default function AgencyCard({ agency }: { agency: Agency }) {
  return (
    <Link
      href={`/agencias/${agency.slug}`}
      className="block rounded-lg border-2 border-gray-200 p-6 hover:border-primary hover:shadow-lg transition"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={agency.logo_url || '/logo-fallback.svg'}
            alt={agency.name}
            className="h-16 w-16 rounded-lg object-cover border"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-dark truncate">{agency.name}</h3>
            <div className="flex gap-1 flex-shrink-0">
              {agency.is_premium && <Badge variant="premium">Premium</Badge>}
              {agency.is_verified && <Badge variant="verified">✓</Badge>}
            </div>
          </div>

          <p className="text-sm text-dark/70 line-clamp-2 mt-2">{agency.description}</p>

          <div className="flex items-center gap-3 mt-3">
            <RatingStars rating={agency.avg_rating} size="sm" showNumber />
            <span className="text-sm text-dark/60">({agency.reviews_count} reseñas)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-dark/70">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {agency.location_city}, {agency.location_region}
              </span>
            </div>
            {agency.price_range && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-accent/10 text-accent rounded-md font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{agency.price_range.replace(/\s/g, '')}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {agency.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="text-xs px-2 py-1 bg-lilac/20 text-primary rounded"
              >
                {service}
              </span>
            ))}
            {agency.services.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-dark/60 rounded">
                +{agency.services.length - 3} más
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
