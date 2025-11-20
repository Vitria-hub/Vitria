import Link from 'next/link';
import RatingStars from './RatingStars';
import Badge from './Badge';
import AgencyLogo from './AgencyLogo';
import { MapPin, DollarSign, BadgeCheck } from 'lucide-react';
import { normalizeSpecialties } from '@/lib/specialties';

interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  location_city: string | null;
  location_region: string | null;
  services: string[];
  specialties?: string[];
  avg_rating: number;
  reviews_count: number;
  is_premium: boolean;
  is_verified: boolean;
  price_range: string | null;
}

export default function AgencyCard({ agency }: { agency: Agency }) {
  const specialties = agency.specialties ?? [];
  const normalizedSpecialties = normalizeSpecialties(specialties);
  
  return (
    <Link
      href={`/agencias/${agency.slug}`}
      className={`block rounded-lg border-2 p-6 transition relative overflow-hidden ${
        agency.is_premium 
          ? 'border-transparent bg-gradient-to-br from-blue-50 via-white to-amber-50 hover:shadow-2xl' 
          : 'border-gray-200 hover:border-primary hover:shadow-lg'
      }`}
      style={agency.is_premium ? {
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3B82F6, #F59E0B, #3B82F6) border-box',
        borderWidth: '3px',
        borderStyle: 'solid',
      } : undefined}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AgencyLogo 
            name={agency.name}
            logoUrl={agency.logo_url}
            size="md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-bold text-lg text-dark truncate">{agency.name}</h3>
              {agency.is_premium && (
                <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" fill="#3B82F6" />
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {agency.is_premium && <Badge variant="premium">Premium</Badge>}
              {agency.is_verified && <Badge variant="verified">✓</Badge>}
            </div>
          </div>

          {agency.price_range && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg font-bold text-sm mb-3">
              <DollarSign className="w-4 h-4" />
              <span>{agency.price_range}</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <RatingStars rating={agency.avg_rating} size="sm" showNumber />
            <span className="text-sm text-dark/60">({agency.reviews_count} reseñas)</span>
          </div>

          <div className="flex items-center gap-2 mb-3 text-sm text-dark/70">
            <MapPin className="w-4 h-4" />
            <span>
              {agency.location_city}, {agency.location_region}
            </span>
          </div>

          <div className="mb-3">
            <p className="text-xs font-semibold text-dark/60 mb-2">Servicios:</p>
            <div className="flex flex-wrap gap-2">
              {agency.services.slice(0, 4).map((service) => (
                <span
                  key={service}
                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-md font-medium"
                >
                  {service}
                </span>
              ))}
              {agency.services.length > 4 && (
                <span className="text-xs px-3 py-1.5 bg-gray-100 text-dark/60 rounded-md font-medium">
                  +{agency.services.length - 4} servicios
                </span>
              )}
            </div>
          </div>

          {normalizedSpecialties.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-dark/60 mb-2">Especialidades:</p>
              <div className="flex flex-wrap gap-2">
                {normalizedSpecialties.map((category) => (
                  <span
                    key={category}
                    className="px-2.5 py-1 text-xs rounded-md bg-secondary/10 text-secondary font-medium border border-secondary/20"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
