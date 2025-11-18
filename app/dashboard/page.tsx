'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import { TrendingUp, Eye, MousePointerClick, Users, Building2, Settings, UserCircle, Briefcase, CheckCircle, X, FileText, Mail, Phone } from 'lucide-react';

function DashboardContent() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'profile' | 'metrics' | 'quotes'>('profile');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('agencia_creada') === 'true') {
      setShowSuccessMessage(true);
      // Clean up the URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const isAdmin = userData?.role === 'admin';

  const { data: userAgency, isLoading: agencyLoading, error: agencyError, status: agencyStatus } = trpc.agency.myAgency.useQuery(undefined, {
    enabled: !loading && !!user && !isAdmin,
  });
  const { data: clientProfile, isLoading: clientProfileLoading, error: clientProfileError, status: clientProfileStatus } = trpc.clientProfile.getMyProfile.useQuery(undefined, {
    enabled: !loading && !!user && !isAdmin,
  });

  const { data: agencyQuotes } = trpc.quotes.getAgencyQuotes.useQuery(
    { status: 'all', limit: 50 },
    { enabled: !loading && !!user && !!userAgency }
  );

  const mockMetrics = [
    { label: 'Vistas', value: 1234, icon: Eye, change: '+12%' },
    { label: 'Clics en Perfil', value: 456, icon: MousePointerClick, change: '+8%' },
    { label: 'Contactos', value: 89, icon: Users, change: '+15%' },
    { label: 'Leads', value: 34, icon: TrendingUp, change: '+22%' },
  ];

  if (loading || agencyLoading || clientProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-dark/60">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasAgency = !!userAgency;
  const hasClientProfile = !!clientProfile;
  const agencySlug = userAgency?.slug;

  const showAgencyCTA = agencyStatus === 'success' && !hasAgency && !isAdmin;
  const showClientCTA = clientProfileStatus === 'success' && !hasClientProfile && !isAdmin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-dark/70">
          Bienvenido, {userData?.full_name || 'Usuario'}
        </p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-6 flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-1">¡Tu agencia ha sido creada exitosamente!</h3>
            <p className="text-green-700 text-sm mb-3">
              Tu agencia está ahora en nuestra lista de espera. Recibirás un correo cuando sea aprobada y publicada en el directorio.
            </p>
            <p className="text-green-700 text-sm font-medium">
              📧 Hemos enviado una confirmación a tu correo electrónico.
            </p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-600 hover:text-green-800 transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {isAdmin && (
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Settings className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Panel de Administrador</h3>
                <p className="text-white/90 mb-4">
                  Tienes acceso completo al panel de administración de Vitria.
                </p>
                <Link href="/admin">
                  <Button variant="outline" className="bg-white text-primary hover:bg-white/90">
                    Ir al Panel de Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasAgency && (
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-accent/10 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-dark" />
                  <h2 className="text-xl font-bold text-dark">Mi Agencia</h2>
                </div>
                {userAgency?.approval_status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    userAgency.approval_status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : userAgency.approval_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userAgency.approval_status === 'approved' && 'Aprobada'}
                    {userAgency.approval_status === 'pending' && 'En lista de espera'}
                    {userAgency.approval_status === 'rejected' && 'No aprobada'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Status message for pending/rejected */}
            {userAgency?.approval_status === 'pending' && (
              <div className="bg-yellow-50 border-b-2 border-yellow-200 px-6 py-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Tu agencia está en lista de espera.</strong> Recibirás un correo cuando sea aprobada y publicada en el directorio.
                </p>
              </div>
            )}
            
            {userAgency?.approval_status === 'rejected' && (
              <div className="bg-red-50 border-b-2 border-red-200 px-6 py-4">
                <p className="text-red-800 text-sm">
                  <strong>Tu agencia no fue aprobada.</strong> Por favor contacta a nuestro equipo para más información.
                </p>
              </div>
            )}
            
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setTab('profile')}
                  className={`px-6 py-4 font-semibold transition ${
                    tab === 'profile'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-dark/60 hover:text-primary'
                  }`}
                >
                  Perfil
                </button>
                {userAgency?.approval_status === 'approved' && (
                  <>
                    <button
                      onClick={() => setTab('metrics')}
                      className={`px-6 py-4 font-semibold transition ${
                        tab === 'metrics'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-dark/60 hover:text-primary'
                      }`}
                    >
                      Métricas
                    </button>
                    <button
                      onClick={() => setTab('quotes')}
                      className={`px-6 py-4 font-semibold transition ${
                        tab === 'quotes'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-dark/60 hover:text-primary'
                      }`}
                    >
                      Cotizaciones {agencyQuotes && agencyQuotes.length > 0 && `(${agencyQuotes.length})`}
                    </button>
                  </>
                )}
              </nav>
            </div>

            <div className="p-8">
              {tab === 'profile' && (
                <div>
                  <h3 className="text-lg font-bold text-dark mb-6">Gestionar Perfil de Agencia</h3>
                  <div className="space-y-4">
                    {userAgency?.approval_status === 'approved' ? (
                      <>
                        <Link href={`/agencias/${agencySlug}`}>
                          <Button variant="primary" className="w-full sm:w-auto">
                            Ver Perfil Público
                          </Button>
                        </Link>
                        <Link href="/dashboard/editar-perfil" className="block sm:inline-block sm:ml-4">
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Settings className="w-4 h-4 mr-2" />
                            Editar Información
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                        <p className="text-dark/70 text-sm mb-4">
                          {userAgency?.approval_status === 'pending' 
                            ? 'Tu perfil público estará disponible una vez que tu agencia sea aprobada.'
                            : 'Tu agencia no está publicada en el directorio.'}
                        </p>
                        <Link href="/dashboard/editar-perfil">
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Settings className="w-4 h-4 mr-2" />
                            Editar Información
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h4 className="font-bold text-dark mb-2">
                      {userAgency?.name}
                    </h4>
                    <p className="text-dark/60 text-sm">
                      {userAgency?.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
              )}

              {tab === 'metrics' && userAgency?.approval_status === 'approved' && (
                <div>
                  <h3 className="text-lg font-bold text-dark mb-6">Métricas (Últimos 30 días)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockMetrics.map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div
                          key={metric.label}
                          className="bg-lilac/10 rounded-lg p-6 border-2 border-lilac/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="w-8 h-8 text-primary" />
                            <span className="text-sm font-semibold text-mint">{metric.change}</span>
                          </div>
                          <p className="text-3xl font-bold text-dark mb-1">{metric.value}</p>
                          <p className="text-sm text-dark/60">{metric.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab === 'quotes' && userAgency?.approval_status === 'approved' && (
                <div>
                  <h3 className="text-lg font-bold text-dark mb-6">Solicitudes de Cotización</h3>
                  
                  {agencyQuotes && agencyQuotes.length > 0 ? (
                    <div className="space-y-4">
                      {agencyQuotes.map((quote: any) => (
                        <div
                          key={quote.id}
                          className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-dark mb-2">{quote.project_name}</h4>
                              <div className="flex items-center gap-2 text-sm text-dark/60 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  quote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  quote.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                  quote.status === 'won' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {quote.status === 'pending' ? 'Pendiente' :
                                   quote.status === 'contacted' ? 'Contactado' :
                                   quote.status === 'won' ? 'Ganado' : 'Perdido'}
                                </span>
                                <span>•</span>
                                <span>{new Date(quote.created_at).toLocaleDateString('es-CL')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-dark/70">{quote.project_description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-semibold text-dark/60 mb-2">Información del Cliente</div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <UserCircle className="w-4 h-4 text-dark/60" />
                                  <span>{quote.client_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-dark/60" />
                                  <a href={`mailto:${quote.client_email}`} className="hover:text-primary">
                                    {quote.client_email}
                                  </a>
                                </div>
                                {quote.client_phone && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-dark/60" />
                                    <a href={`tel:${quote.client_phone}`} className="hover:text-primary">
                                      {quote.client_phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs font-semibold text-dark/60 mb-2">Detalles del Proyecto</div>
                              <div className="space-y-1 text-sm text-dark/70">
                                {quote.budget_range && (
                                  <div><strong>Presupuesto:</strong> {quote.budget_range}</div>
                                )}
                                {quote.service_category && (
                                  <div><strong>Categoría:</strong> {quote.service_category}</div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <a 
                              href={`mailto:${quote.client_email}?subject=Re: ${quote.project_name}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                              Contactar Cliente
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <FileText className="w-16 h-16 text-dark/20 mx-auto mb-4" />
                      <p className="text-dark/60 mb-2">No has recibido cotizaciones aún</p>
                      <p className="text-sm text-dark/50">
                        Las solicitudes de cotización aparecerán aquí cuando los clientes te contacten
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {agencyError && !isAdmin && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-800 font-semibold mb-2">Error al cargar información de agencia</p>
            <p className="text-yellow-700 text-sm">
              Hubo un problema al verificar si tienes una agencia. Por favor, recarga la página.
            </p>
          </div>
        )}

        {showAgencyCTA && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Building2 className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark mb-2">
                  ¿Tienes una agencia de marketing?
                </h3>
                <p className="text-dark/60 mb-4">
                  Crea tu perfil de agencia para comenzar a recibir clientes y gestionar tu presencia en la plataforma.
                </p>
                <Link href="/dashboard/crear-agencia">
                  <Button variant="primary">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Crear Mi Agencia
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasClientProfile && (
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-primary/10 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-dark">Mi Perfil de Cliente</h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-dark">Información del Negocio</h3>
                  <Link href="/dashboard/perfil">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-dark font-semibold">{clientProfile.business_name}</p>
                  <p className="text-dark/60 text-sm mt-1">Presupuesto: {clientProfile.budget_range}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-dark mb-4">Agencias Favoritas</h3>
                <p className="text-dark/60 mb-4">
                  Aún no has guardado agencias favoritas. Explora el directorio y guarda las que más te interesen.
                </p>
                <Link href="/agencias">
                  <Button variant="primary">Explorar Agencias</Button>
                </Link>
              </div>

              <div>
                <h3 className="text-lg font-bold text-dark mb-4">Mis Reseñas</h3>
                <p className="text-dark/60">
                  No has dejado reseñas aún. Comparte tu experiencia con otras empresas.
                </p>
              </div>
            </div>
          </div>
        )}

        {clientProfileError && !isAdmin && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-800 font-semibold mb-2">Error al cargar perfil de cliente</p>
            <p className="text-yellow-700 text-sm">
              Hubo un problema al verificar tu perfil de cliente. Por favor, recarga la página.
            </p>
          </div>
        )}

        {showClientCTA && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <UserCircle className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark mb-2">
                  ¿Buscas una agencia de marketing?
                </h3>
                <p className="text-dark/60 mb-4">
                  Completa tu perfil de cliente para recibir recomendaciones personalizadas y contactar agencias.
                </p>
                <Link href="/dashboard/perfil">
                  <Button variant="primary">
                    <Settings className="w-4 h-4 mr-2" />
                    Completar Perfil de Cliente
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-dark/60">Cargando...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
