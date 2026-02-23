'use client';

import { trpc } from '@/lib/trpc';
import Badge from '@/components/Badge';
import RatingStars from '@/components/RatingStars';
import PortfolioGrid from '@/components/PortfolioGrid';
import ReviewForm from '@/components/ReviewForm';
import Button from '@/components/Button';
import QuoteRequestModal from '@/components/QuoteRequestModal';
import LoginModal from '@/components/LoginModal';
import AgencyLogo from '@/components/AgencyLogo';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { MapPin, Globe, Mail, Users } from 'lucide-react';
import { useState } from 'react';
import { useTrackPageView, useTracking } from '@/hooks/useTracking';
import { useAuth } from '@/hooks/useAuth';

export default function AgencyDetailClient({ slug }: { slug: string }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showDirectContact, setShowDirectContact] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  const { data: agencyData, isLoading } = trpc.agency.getBySlug.useQuery({ slug });
  const agency = agencyData as any;
  const specialties = agency?.specialties ?? [];

  const { data: reviews } = trpc.review.listByAgency.useQuery(
    { agencyId: agency?.id || '', status: 'approved' as const },
    { enabled: !!agency }
  );

  const { trackContact } = useTracking();

  useTrackPageView(agency?.id);

  const handleContactClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (agency?.id) {
      trackContact(agency.id, 'form_submit');
      setShowContactForm(true);
    }
  };

  const handleLoginSuccess = () => {
    if (agency?.id) {
      trackContact(agency.id, 'form_submit');
      setShowContactForm(true);
    }
  };

  const handlePhoneClick = () => {
    if (agency?.id) {
      trackContact(agency.id, 'phone_click');
    }
  };

  const handleEmailClick = () => {
    if (agency?.id) {
      trackContact(agency.id, 'email_click');
    }
  };

  const handleWebsiteClick = () => {
    if (agency?.id) {
      trackContact(agency.id, 'website_click');
    }
  };

  const getCleanPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 8 ? cleaned : '';
  };

  const cleanPhoneNumber = getCleanPhoneNumber(agency?.phone);
  const hasValidPhone = cleanPhoneNumber.length > 0;

  const getSafeWebsiteUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.href;
      }
    } catch {
      return null;
    }
    return null;
  };

  const handleWhatsAppClick = () => {
    if (!hasValidPhone) return;
    if (agency?.id) {
      trackContact(agency.id, 'whatsapp_click');
    }
    const message = encodeURIComponent(`Hola! Vi tu perfil en Vitria y me gustaría saber más sobre ${agency?.name}`);
    window.open(`https://wa.me/${cleanPhoneNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
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
            <AgencyLogo
              name={agency.name}
              logoUrl={agency.logo_url}
              size="xl"
              className="border-4 border-white shadow-lg"
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

              <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleContactClick} variant="accent" size="lg" className="w-full sm:w-auto">
                    Solicitar Cotización Gratis
                  </Button>
                  {hasValidPhone && (
                    <button
                      onClick={handleWhatsAppClick}
                      aria-label={`Contactar a ${agency.name} por WhatsApp`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto min-h-[48px]"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Hablemos por WhatsApp
                    </button>
                  )}
                </div>
                <p className="text-sm text-dark/60 mt-2">
                  Recibe una propuesta personalizada sin compromiso
                </p>
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
                {agency.employees_min && agency.employees_max && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>
                      {agency.employees_min}-{agency.employees_max} empleados
                    </span>
                  </div>
                )}
              </div>

              {(agency.email || getSafeWebsiteUrl(agency.website)) && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowDirectContact(!showDirectContact)}
                    aria-expanded={showDirectContact}
                    className="text-sm text-primary hover:underline font-semibold"
                  >
                    {showDirectContact ? '▼ Ocultar' : '▶'} Ver más formas de contacto
                  </button>

                  {showDirectContact && (
                    <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {agency.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-dark/60" />
                          <a
                            href={`mailto:${agency.email}`}
                            onClick={handleEmailClick}
                            className="hover:text-primary text-dark/80"
                          >
                            {agency.email}
                          </a>
                        </div>
                      )}
                      {getSafeWebsiteUrl(agency.website) && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-dark/60" />
                          <a
                            href={getSafeWebsiteUrl(agency.website)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWebsiteClick}
                            className="hover:text-primary text-dark/80"
                          >
                            {agency.website?.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <QuoteRequestModal
                agencyId={agency.id}
                agencyName={agency.name}
                isOpen={showContactForm}
                onClose={() => setShowContactForm(false)}
              />

              <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
                contextMessage="Inicia sesión para solicitar una cotización"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:hidden order-first">
          <section className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
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

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Sobre la Agencia</h2>
            <p className="text-dark/80 leading-relaxed whitespace-pre-line">{agency.description}</p>
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

          {specialties.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Especialidades Técnicas</h2>
              <p className="text-dark/60 text-sm mb-4">
                Plataformas y herramientas que domina esta agencia
              </p>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty: string) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg font-semibold"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Reseñas</h2>
            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div key={review.id} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            {(review.author?.full_name || review.author_name || 'U')?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-dark">
                            {review.author?.full_name || review.author_name || 'Usuario Anónimo'}
                          </p>
                          <RatingStars rating={review.rating} size="sm" />
                        </div>
                      </div>
                      <span className="text-sm text-dark/60">
                        {new Date(review.created_at).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                    {review.comment && <p className="text-dark/80 leading-relaxed">{review.comment}</p>}
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

        <div className="hidden lg:block">
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

      <section className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ¿Listo para trabajar con {agency.name}?
        </h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Da el primer paso y solicita una cotización sin compromiso. Te responderemos a la brevedad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleContactClick} variant="accent" size="lg">
            Solicitar Cotización Gratis
          </Button>
          {hasValidPhone && (
            <button
              onClick={handleWhatsAppClick}
              aria-label={`Contactar a ${agency.name} por WhatsApp`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#25D366] font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Escríbenos por WhatsApp
            </button>
          )}
        </div>
      </section>

      {hasValidPhone && (
        <WhatsAppFloatingButton
          phoneNumber={cleanPhoneNumber}
          agencyName={agency.name}
          onTrack={() => trackContact(agency.id, 'whatsapp_floating_click')}
        />
      )}
    </div>
  );
}
