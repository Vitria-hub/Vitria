'use client';

import { trpc } from '@/lib/trpc';
import { 
  Users, 
  Building2, 
  Star, 
  Search,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery();
  const { data: analyticsStats, isLoading: analyticsLoading } = trpc.analytics.getDashboardStats.useQuery({ days: 30 });

  if (statsLoading || analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark/60">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Panel de Administración</h1>
          <p className="text-dark/70">Gestiona el marketplace de Vitria</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Estadísticas Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Agencias"
              value={stats?.totalAgencies || 0}
              icon={<Building2 className="w-8 h-8 text-primary" />}
              subtitle={`+${analyticsStats?.newAgencies || 0} este mes`}
              href="/admin/agencias"
            />
            <StatsCard
              title="Total Usuarios"
              value={stats?.totalUsers || 0}
              icon={<Users className="w-8 h-8 text-secondary" />}
              subtitle={`+${analyticsStats?.newUsers || 0} este mes`}
              href="/admin/usuarios"
            />
            <StatsCard
              title="Total Reseñas"
              value={stats?.totalReviews || 0}
              icon={<Star className="w-8 h-8 text-accent" />}
              subtitle={`${stats?.pendingReviews || 0} pendientes`}
              href="/admin/resenas"
            />
            <StatsCard
              title="Agencias Premium"
              value={analyticsStats?.premiumAgencies || 0}
              icon={<TrendingUp className="w-8 h-8 text-green-600" />}
              subtitle={`de ${stats?.totalAgencies || 0} totales`}
              href="/admin/agencias"
            />
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Analytics (Últimos 30 días)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Búsquedas"
              value={analyticsStats?.totalSearches || 0}
              icon={<Search className="w-8 h-8 text-blue-600" />}
              subtitle="Búsquedas realizadas"
              href="/admin/analytics"
            />
            <StatsCard
              title="Contactos Generados"
              value={analyticsStats?.totalContacts || 0}
              icon={<MousePointerClick className="w-8 h-8 text-purple-600" />}
              subtitle="Leads para agencias"
              href="/admin/cotizaciones"
            />
            <StatsCard
              title="Ver Analytics Completo"
              value={0}
              icon={<BarChart3 className="w-8 h-8 text-orange-600" />}
              customContent={
                <Link 
                  href="/admin/analytics" 
                  className="text-primary hover:underline font-semibold"
                >
                  Ir al Dashboard →
                </Link>
              }
              href="/admin/analytics"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Gestión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminCard
              title="Gestionar Agencias"
              description="Aprobar, verificar o eliminar agencias"
              href="/admin/agencias"
              icon={<Building2 className="w-6 h-6" />}
              badge={stats?.pendingAgencies}
            />
            <AdminCard
              title="Agencias Destacadas"
              description="Control del carrusel de homepage"
              href="/admin/destacados"
              icon={<Star className="w-6 h-6 text-purple-600" />}
            />
            <AdminCard
              title="Gestionar Reseñas"
              description="Moderar reseñas pendientes"
              href="/admin/resenas"
              icon={<Star className="w-6 h-6" />}
              badge={stats?.pendingReviews}
            />
            <AdminCard
              title="Gestionar Usuarios"
              description="Ver y administrar usuarios"
              href="/admin/usuarios"
              icon={<Users className="w-6 h-6" />}
            />
            <AdminCard
              title="Analytics Completo"
              description="Gráficos, rankings y métricas detalladas"
              href="/admin/analytics"
              icon={<BarChart3 className="w-6 h-6" />}
            />
            <AdminCard
              title="Gestionar Cotizaciones"
              description="Ver y trackear solicitudes de cotización"
              href="/admin/cotizaciones"
              icon={<FileText className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  subtitle,
  customContent,
  href,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  customContent?: React.ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div>{icon}</div>
      </div>
      {customContent ? (
        customContent
      ) : (
        <>
          <h3 className="text-2xl font-bold text-dark mb-1">{value.toLocaleString()}</h3>
          <p className="text-sm text-dark/60">{title}</p>
          {subtitle && <p className="text-xs text-primary mt-2">{subtitle}</p>}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link 
        href={href}
        className="bg-gray-50 border border-gray-300 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
      {content}
    </div>
  );
}

function AdminCard({
  title,
  description,
  href,
  icon,
  badge,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-all group relative"
    >
      {badge && badge > 0 ? (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {badge}
        </div>
      ) : null}
      <div className="mb-4 text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
      <p className="text-sm text-dark/60">{description}</p>
    </Link>
  );
}
