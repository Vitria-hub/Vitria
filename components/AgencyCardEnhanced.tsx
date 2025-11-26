'use client';

import { useState } from 'react';
import Link from 'next/link';
import RatingStars from './RatingStars';
import AgencyLogo from './AgencyLogo';
import { Check, ChevronDown, ChevronUp, Star, MessageCircle, ExternalLink } from 'lucide-react';
import { extractDescriptionBullets } from '@/lib/extractDescriptionBullets';
import { useRouter } from 'next/navigation';

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
  whatsapp_number: string | null;
}

interface AgencyCardEnhancedProps {
  agency: Agency;
  showRecommendedBadge?: boolean;
}

const INITIAL_BULLETS_COUNT = 3;
const HIGH_RATING_THRESHOLD = 4.5;
const MIN_REVIEWS_FOR_BADGE = 5;

export default function AgencyCardEnhanced({ agency, showRecommendedBadge = true }: AgencyCardEnhancedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const bullets = extractDescriptionBullets(agency.description);
  const router = useRouter();
  
  const hasMoreBullets = bullets.length > INITIAL_BULLETS_COUNT;
  const visibleBullets = isExpanded ? bullets : bullets.slice(0, INITIAL_BULLETS_COUNT);
  
  const isHighRated = agency.avg_rating >= HIGH_RATING_THRESHOLD && agency.reviews_count >= MIN_REVIEWS_FOR_BADGE;

  const handleViewAgency = () => {
    router.push(`/agencias/${agency.slug}`);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappUrl = `https://wa.me/${agency.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Vi tu perfil en Vitria y me gustaría saber más sobre ${agency.name}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getBorderStyle = () => {
    if (agency.is_premium) {
      return {
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3B82F6, #F59E0B, #3B82F6) border-box',
        borderWidth: '3px',
        borderStyle: 'solid' as const,
        borderColor: 'transparent',
      };
    }
    if (isHighRated) {
      return {
        borderWidth: '2px',
        borderStyle: 'solid' as const,
        borderColor: '#22c55e',
      };
    }
    return undefined;
  };
  
  return (
    <article
      className={`group flex flex-col rounded-xl transition-all duration-300 relative overflow-hidden ${
        agency.is_premium 
          ? 'bg-gradient-to-br from-blue-50/50 via-white to-amber-50/50 hover:shadow-xl' 
          : isHighRated
          ? 'bg-gradient-to-br from-green-50/30 via-white to-white hover:shadow-lg border-green-500'
          : 'border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
      style={getBorderStyle()}
    >
      <div className="p-4 sm:p-5">
        {isHighRated && !agency.is_premium && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />
        )}
        
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <div className="flex-shrink-0">
            <AgencyLogo 
              name={agency.name}
              logoUrl={agency.logo_url}
              size="sm"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-dark truncate group-hover:text-primary transition-colors">
                  {agency.name}
                </h3>
                {agency.is_premium && (
                  <div 
                    className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center" 
                    title="Agencia Premium"
                  >
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              
              {agency.price_range && (
                <span className="flex-shrink-0 inline-block px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-md border border-secondary/20 whitespace-nowrap">
                  {agency.price_range}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <RatingStars rating={agency.avg_rating} size="sm" showNumber />
              <span className="text-xs text-dark/60 whitespace-nowrap">
                ({agency.reviews_count} {agency.reviews_count === 1 ? 'reseña' : 'reseñas'})
              </span>
              
              {isHighRated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Top
                </span>
              )}
            </div>
          </div>
        </div>

        {agency.is_premium && showRecommendedBadge && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md text-xs font-semibold text-blue-700">
              <span className="text-sm">✨</span>
              Recomendado para ti
            </span>
          </div>
        )}

        {visibleBullets.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2 text-sm text-dark/80">
              {visibleBullets.map((bullet, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-2 leading-relaxed"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">•</span>
                  <span className={`${!isExpanded && index === INITIAL_BULLETS_COUNT - 1 && hasMoreBullets ? 'line-clamp-2' : ''}`}>
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
            
            {hasMoreBullets && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-semibold transition-colors group/btn"
              >
                <span>{isExpanded ? 'Ver menos' : `Ver más (${bullets.length - INITIAL_BULLETS_COUNT})`}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 transition-transform group-hover/btn:translate-y-0.5" />
                )}
              </button>
            )}
          </div>
        )}

        <div className="mt-auto pt-2">
          {agency.is_premium && agency.whatsapp_number ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleViewAgency}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all active:scale-[0.98] touch-manipulation min-h-[48px]"
              >
                <ExternalLink className="w-4 h-4" />
                Ver perfil
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition-all active:scale-[0.98] touch-manipulation min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar
              </button>
            </div>
          ) : (
            <button
              onClick={handleViewAgency}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all active:scale-[0.98] touch-manipulation min-h-[48px]"
            >
              <ExternalLink className="w-4 h-4" />
              Ver perfil
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
