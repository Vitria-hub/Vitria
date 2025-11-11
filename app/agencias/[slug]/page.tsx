'use client';

import { trpc } from '@/lib/trpc';
import Badge from '@/components/Badge';
import RatingStars from '@/components/RatingStars';
import PortfolioGrid from '@/components/PortfolioGrid';
import ReviewForm from '@/components/ReviewForm';
import Button from '@/components/Button';
import { MapPin, Globe, Mail, Phone, Users } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function AgencyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showContactForm, setShowContactForm] = useState(false);

  const { data: agencyData, isLoading } = trpc.agency.getBySlug.useQuery({ slug });
  const agency = agencyData as any;
  
  const { data: reviews } = trpc.review.listByAgency.useQuery(
    { agencyId: agency?.id || '', status: 'approved' as const },
    { enabled: !!agency }
  );

  const trackMetric = trpc.metrics.track.useMutation();

  const handleContactClick = () => {
    if (agency?.id) {
      trackMetric.mutate({ agencyId: agency.id, event: 'contact_click' });
      setShowContactForm(true);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-dark/60">Cargando...</p>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-dark/60">Agencia no encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-8">
        {agency.cover_url && (
          <div className="h-64 bg-gradient-to-r from-primary to-secondary">
            <img src={agency.cover_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={agency.logo_url || '/logo-fallback.svg'}
              alt={agency.name}
              className="w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-primary">{agency.name}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <RatingStars rating={agency.avg_rating} size="lg" showNumber />
                    <span className="text-dark/60">({agency.reviews_count} reseñas)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {agency.is_premium && <Badge variant="premium">Premium</Badge>}
                  {agency.is_verified && <Badge variant="verified">Verificada ✓</Badge>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-dark/70">
                {agency.location_city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>
                      {agency.location_city}, {agency.location_region}
                    </span>
                  </div>
                )}
                {agency.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <a href={agency.website} target="_blank" className="hover:text-primary">
                      {agency.website}
                    </a>
                  </div>
                )}
                {agency.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <a href={`mailto:${agency.email}`} className="hover:text-primary">
                      {agency.email}
                    </a>
                  </div>
                )}
                {agency.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>{agency.phone}</span>
                  </div>
                )}
                {agency.employees_min && agency.employees_max && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>
                      {agency.employees_min}-{agency.employees_max} empleados
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button onClick={handleContactClick} variant="accent" size="lg">
                  Contactar Agencia
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Sobre la Agencia</h2>
            <p className="text-dark/80 leading-relaxed">{agency.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Servicios</h2>
            <div className="flex flex-wrap gap-2">
              {agency.services.map((service: string) => (
                <span
                  key={service}
                  className="px-4 py-2 bg-lilac/20 text-primary rounded-lg font-semibold"
                >
                  {service}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Reseñas</h2>
            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div key={review.id} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-sm text-dark/60">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-dark/80">{review.comment}</p>}
                  </div>
                ))
              ) : (
                <p className="text-dark/60">No hay reseñas aún. ¡Sé el primero en opinar!</p>
              )}
            </div>

            <div className="mt-6">
              <ReviewForm agencyId={agency.id} />
            </div>
          </section>
        </div>

        <div>
          <section className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-20">
            <h3 className="font-bold text-lg text-primary mb-4">Información Adicional</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-dark">Rango de Precios</dt>
                <dd className="text-dark/70 mt-1">{agency.price_range || 'No especificado'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-dark">Categorías</dt>
                <dd className="text-dark/70 mt-1">{agency.categories.join(', ')}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-primary mb-4">Contactar Agencia</h3>
            <p className="text-dark/70 mb-4">
              Envía un mensaje directamente a {agency.name} a través de su email:{' '}
              <a href={`mailto:${agency.email}`} className="text-primary font-semibold">
                {agency.email}
              </a>
            </p>
            <Button onClick={() => setShowContactForm(false)}>Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
