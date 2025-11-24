import Link from 'next/link';
import RatingStars from './RatingStars';
import Badge from './Badge';
import AgencyLogo from './AgencyLogo';
import { MapPin, Check } from 'lucide-react';
import { normalizeSpecialties } from '@/lib/specialties';
import { generateAgencySummary } from '@/lib/agencySummary';

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
  const summary = generateAgencySummary(agency.description, agency.services);
  const specialties = agency.specialties ?? [];
  const normalizedSpecialties = normalizeSpecialties(specialties);
  const maxServices = 3;
  
  return (
    <div
      className={`block rounded-lg border-2 p-5 transition relative overflow-hidden ${
        agency.is_premium 
          ? 'border-transparent bg-gradient-to-br from-blue-50 via-white to-amber-50 hover:shadow-2xl' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
      style={agency.is_premium ? {
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3B82F6, #F59E0B, #3B82F6) border-box',
        borderWidth: '3px',
        borderStyle: 'solid',
      } : undefined}
    >
      <div className="absolute top-4 right-4 flex gap-1.5">
        {agency.is_premium && <Badge variant="premium">Premium</Badge>}
        {agency.is_verified && <Badge variant="verified">Verificada</Badge>}
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          <AgencyLogo 
            name={agency.name}
            logoUrl={agency.logo_url}
            size="sm"
          />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-dark truncate">{agency.name}</h3>
            {agency.is_verified && (
              <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center" title="Verificada">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <RatingStars rating={agency.avg_rating} size="sm" showNumber />
            <span className="text-xs text-dark/60">({agency.reviews_count} reseñas)</span>
          </div>
        </div>
      </div>

      {agency.is_premium && (
        <div className="mb-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md inline-block">
          <span className="text-xs font-semibold text-blue-700">✨ Recomendado para ti</span>
        </div>
      )}

      <p className="text-sm font-semibold text-dark mb-3 leading-snug">
        {summary}
      </p>

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-dark/60">
          <MapPin className="w-3.5 h-3.5" />
          <span>{agency.location_city}, {agency.location_region}</span>
        </div>
        {agency.price_range && (
          <span className="text-xs font-semibold text-secondary px-2 py-1 bg-secondary/10 rounded">
            {agency.price_range}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="flex flex-wrap gap-1.5">
          {agency.services.slice(0, maxServices).map((service) => (
            <span
              key={service}
              className="text-xs px-2.5 py-1 bg-gray-100 text-dark/70 rounded-md"
            >
              {service}
            </span>
          ))}
          {agency.services.length > maxServices && (
            <span className="text-xs px-2.5 py-1 text-primary font-medium">
              +{agency.services.length - maxServices} servicios
            </span>
          )}
        </div>
      </div>

      {normalizedSpecialties.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {normalizedSpecialties.slice(0, 2).map((specialty) => (
              <span
                key={specialty}
                className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded border border-secondary/20"
              >
                {specialty}
              </span>
            ))}
            {normalizedSpecialties.length > 2 && (
              <span className="text-xs px-2 py-0.5 text-dark/50">
                +{normalizedSpecialties.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      <Link
        href={`/agencias/${agency.slug}`}
        className="block w-full text-center px-4 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
      >
        Ver agencia
      </Link>
    </div>
  );
}
