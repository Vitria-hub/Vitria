'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, MapPin, Users, CheckCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function CarouselSponsored() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: sponsored } = trpc.sponsor.listHome.useQuery();

  if (!sponsored || sponsored.length === 0) {
    return null;
  }

  const next = () => setCurrentIndex((i) => (i + 1) % sponsored.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + sponsored.length) % sponsored.length);

  const current = sponsored[currentIndex];
  const agency = current.agency;

  if (!agency) return null;

  const averageRating = agency.average_rating || 4.5;
  const reviewCount = agency.review_count || 0;
  const services = agency.services?.slice(0, 3) || [];
  const employeeRange = agency.employees_min && agency.employees_max 
    ? `${agency.employees_min}-${agency.employees_max} empleados`
    : null;

  return (
    <div className="relative bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTM2IDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative px-8 md:px-16 py-12">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="text-accent text-sm font-bold uppercase tracking-wider">
            ⭐ Agencia Destacada
          </span>
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-white rounded-xl p-4 shadow-xl flex items-center justify-center">
              {agency.logo_url ? (
                <img 
                  src={agency.logo_url} 
                  alt={agency.name || 'Logo'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-3xl">
                  {agency.name?.charAt(0) || 'A'}
                </div>
              )}
            </div>
          </div>

          <div className="text-white">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl md:text-4xl font-bold">{agency.name}</h2>
                  {agency.is_verified && (
                    <div className="bg-accent/20 text-accent px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Verificada
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? 'fill-accent text-accent'
                            : 'text-accent/30'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-bold text-accent">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="opacity-90">({reviewCount} reseñas)</span>
                </div>
              </div>
            </div>

            <p className="text-lg mt-4 mb-6 opacity-95 leading-relaxed max-w-3xl">
              {agency.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              {services.map((service) => (
                <span
                  key={service}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  {service}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 text-sm mb-6 opacity-90">
              {agency.location_city && agency.location_region && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{agency.location_city}, {agency.location_region}</span>
                </div>
              )}
              {employeeRange && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{employeeRange}</span>
                </div>
              )}
            </div>

            <Link
              href={`/agencias/${agency.slug}`}
              className="inline-block bg-accent text-dark px-8 py-4 rounded-lg font-bold hover:bg-white transition shadow-lg hover:shadow-xl text-lg"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition backdrop-blur-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition backdrop-blur-sm"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {sponsored.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentIndex ? 'bg-accent' : 'bg-white/40'
                }`}
                aria-label={`Ir a agencia ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
