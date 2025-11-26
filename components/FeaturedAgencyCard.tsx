'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgencyLogo from './AgencyLogo';
import { Check, ChevronDown, ChevronUp, Star, ExternalLink } from 'lucide-react';
import { extractDescriptionBullets } from '@/lib/extractDescriptionBullets';

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  description?: string | null;
  avg_rating?: number | null;
  reviews_count?: number | null;
  is_premium?: boolean;
  whatsapp?: string | null;
  price_range?: string | null;
}

interface FeaturedAgencyCardProps {
  agency: Agency;
}

export default function FeaturedAgencyCard({ agency }: FeaturedAgencyCardProps) {
  const [showAllBullets, setShowAllBullets] = useState(false);
  const router = useRouter();

  const bullets = extractDescriptionBullets(agency.description || '');
  const visibleBullets = showAllBullets ? bullets : bullets.slice(0, 2);
  const hasMoreBullets = bullets.length > 2;

  const reviewCount = agency.reviews_count || 0;
  const averageRating = reviewCount > 0 ? (agency.avg_rating || 0) : 0;
  const isHighRated = averageRating >= 4.5 && reviewCount >= 5;

  const handleViewProfile = () => {
    router.push(`/agencias/${agency.slug}`);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agency.whatsapp) {
      const message = encodeURIComponent(`Hola, vi su perfil en Vitria y me gustaría más información sobre sus servicios.`);
      window.open(`https://wa.me/${agency.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  return (
    <article className={`group flex flex-col h-full rounded-xl transition-all duration-300 ${
      agency.is_premium 
        ? 'bg-gradient-to-br from-amber-50/50 via-white to-blue-50/50 border-2 border-amber-200/50 hover:border-amber-300 hover:shadow-xl' 
        : isHighRated
          ? 'bg-white border-2 border-green-200 hover:border-green-300 hover:shadow-xl'
          : 'bg-white border-2 border-gray-200 hover:border-primary/30 hover:shadow-lg'
    }`}>
      <div className="p-4 md:p-5 flex-grow flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            <AgencyLogo 
              name={agency.name} 
              logoUrl={agency.logo_url ?? null}
              size="md"
              className="rounded-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-base text-dark truncate">
                {agency.name}
              </h3>
              {agency.is_premium && (
                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {reviewCount > 0 ? (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(averageRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-dark">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-dark/50">
                    ({reviewCount})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-dark/50">Sin reseñas</span>
              )}
              
              {isHighRated && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Top
                </span>
              )}
            </div>
          </div>

          {agency.price_range && (
            <span className="text-xs font-medium text-dark/60 bg-gray-100 px-2 py-1 rounded-md flex-shrink-0">
              {agency.price_range}
            </span>
          )}
        </div>

        {agency.is_premium && (
          <div className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md mb-3 self-start">
            <span>✨</span>
            <span>Recomendado</span>
          </div>
        )}

        {bullets.length > 0 && (
          <div className="mb-3 flex-grow">
            <ul className="space-y-1.5">
              {visibleBullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-dark/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                  <span className="line-clamp-2">{bullet}</span>
                </li>
              ))}
            </ul>
            
            {hasMoreBullets && (
              <button
                onClick={() => setShowAllBullets(!showAllBullets)}
                className="mt-2 text-xs font-medium text-primary hover:text-secondary flex items-center gap-1 transition"
              >
                {showAllBullets ? (
                  <>
                    Ver menos <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Ver más ({bullets.length - 2}) <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-3">
          <button
            onClick={handleViewProfile}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-dark text-white font-semibold py-2.5 px-3 rounded-lg transition text-sm min-h-[44px]"
          >
            <ExternalLink className="w-4 h-4" />
            Ver perfil
          </button>
          
          {agency.whatsapp && (
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm min-h-[44px]"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
