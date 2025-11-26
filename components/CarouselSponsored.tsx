'use client';

import { trpc } from '@/lib/trpc';
import type { RouterOutputs } from '@/server/routers/_app';
import Link from 'next/link';
import Image from 'next/image';
import AgencyLogo from './AgencyLogo';
import { ChevronLeft, ChevronRight, Star, MapPin, Users, CheckCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

type SponsoredEntry = RouterOutputs['sponsor']['listHome'][number];

export default function CarouselSponsored() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: sponsored = [], isLoading } = trpc.sponsor.listHome.useQuery();

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-primary/80 via-secondary/80 to-primary/80 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
        <div className="relative px-4 sm:px-8 md:px-16 py-8 md:py-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-6">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded"></div>
            <div className="h-4 w-32 bg-white/20 rounded"></div>
          </div>

          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-xl"></div>
            </div>

            <div className="text-white space-y-4">
              <div className="h-8 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-16 bg-white/20 rounded w-full"></div>
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-white/20 rounded"></div>
                <div className="h-8 w-24 bg-white/20 rounded"></div>
                <div className="h-8 w-24 bg-white/20 rounded"></div>
              </div>
              <div className="h-12 w-48 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sponsored || sponsored.length === 0) {
    return null;
  }

  const next = () => setCurrentIndex((i) => (i + 1) % sponsored.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + sponsored.length) % sponsored.length);

  const current = sponsored[currentIndex];
  const agency = current.agency;

  if (!agency) return null;

  const reviewCount = agency.reviews_count || 0;
  const averageRating = reviewCount > 0 ? (agency.avg_rating || 0) : 0;
  const services = agency.services?.slice(0, 3) || [];
  const employeeRange = agency.employees_min && agency.employees_max 
    ? `${agency.employees_min}-${agency.employees_max} empleados`
    : null;
  const logoUrl = typeof agency.logo_url === 'string' && agency.logo_url.length > 0 
    ? agency.logo_url 
    : null;

  return (
    <div className="relative bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTM2IDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-6 sm:-top-10 right-6 sm:right-12 w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32 opacity-15">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="128px" className="object-contain" />
        </div>
        <div className="absolute bottom-8 sm:bottom-10 left-6 sm:left-12 w-16 sm:w-24 h-16 sm:h-24 opacity-10">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="96px" className="object-contain" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 sm:-translate-y-1/3 left-1/2 sm:left-auto sm:right-24 w-24 sm:w-32 h-24 sm:h-32 opacity-10 rotate-12 hidden sm:block">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="128px" className="object-contain" />
        </div>
      </div>
      
      <div className="relative px-4 sm:px-8 md:px-16 py-8 md:py-12 pb-16 md:pb-12">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-6">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          <span className="text-accent text-xs sm:text-sm font-bold uppercase tracking-wider">
            ⭐ Agencia Destacada
          </span>
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-xl">
              <AgencyLogo 
                name={agency.name || 'Agencia'}
                logoUrl={logoUrl}
                size="lg"
              />
            </div>
          </div>

          <div className="text-white">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="w-full">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{agency.name}</h2>
                  {agency.is_verified && (
                    <div className="bg-accent/20 text-accent px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 text-xs sm:text-sm font-semibold">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      Verificada
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
                  {reviewCount > 0 ? (
                    <>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              i < Math.floor(averageRating)
                                ? 'fill-accent text-accent'
                                : 'text-accent/30'
                            }`}
                          />
                        ))}
                        <span className="ml-1 sm:ml-2 font-bold text-accent">{averageRating.toFixed(1)}</span>
                      </div>
                      <span className="opacity-90">({reviewCount} reseñas)</span>
                    </>
                  ) : (
                    <span className="opacity-90 italic">Sin reseñas aún</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base md:text-lg mt-3 md:mt-4 mb-4 md:mb-6 opacity-95 leading-relaxed max-w-3xl">
              {agency.description}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 md:mb-6">
              {services.map((service: string) => (
                <span
                  key={service}
                  className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold"
                >
                  {service}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm mb-4 md:mb-6 opacity-90">
              {agency.location_city && agency.location_region && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{agency.location_city}, {agency.location_region}</span>
                </div>
              )}
              {employeeRange && (
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{employeeRange}</span>
                </div>
              )}
            </div>

            <Link
              href={`/agencias/${agency.slug}`}
              className="inline-block bg-accent text-dark px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-white transition shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg"
            >
              Ver Portafolio Completo →
            </Link>
          </div>
        </div>
      </div>

      {sponsored.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition backdrop-blur-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition backdrop-blur-sm"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 items-center">
            <button
              onClick={prev}
              className="md:hidden bg-white/20 hover:bg-white/30 p-2 rounded-full transition backdrop-blur-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            
            {sponsored.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition ${
                  i === currentIndex ? 'bg-accent' : 'bg-white/40'
                }`}
                aria-label={`Ir a agencia ${i + 1}`}
              />
            ))}
            
            <button
              onClick={next}
              className="md:hidden bg-white/20 hover:bg-white/30 p-2 rounded-full transition backdrop-blur-sm"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
