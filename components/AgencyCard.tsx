import Link from 'next/link';
import RatingStars from './RatingStars';
import AgencyLogo from './AgencyLogo';
import { Check } from 'lucide-react';
import { extractDescriptionBullets } from '@/lib/extractDescriptionBullets';

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
  const bullets = extractDescriptionBullets(agency.description);
  
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
      {agency.price_range && (
        <div className="absolute top-4 right-4">
          <span className="inline-block px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded border border-secondary/20">
            ${agency.price_range}
          </span>
        </div>
      )}

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
            {agency.is_premium && (
              <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center" title="Premium">
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

      {bullets.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-1.5 text-xs text-dark/70">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
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
