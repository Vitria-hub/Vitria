'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Star,
  Download,
  FileText,
  CheckCircle,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const [days, setDays] = useState(30);
  
  const { data: stats } = trpc.analytics.getDashboardStats.useQuery(
    { days },
    { enabled: userData?.role === 'admin' }
  );
  
  const { data: ranking } = trpc.analytics.getAgencyRanking.useQuery(
    { days, limit: 20 },
    { enabled: userData?.role === 'admin' }
  );

  useEffect(() => {
    if (!loading && (!userData || userData.role !== 'admin')) {
      router.push('/');
    }
  }, [userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark/60">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== 'admin') {
    return null;
  }

  const totalViews = stats?.totalViews || 0;
  const totalQuotes = stats?.totalQuotes || 0;
  const contactedQuotes = stats?.contactedQuotes || 0;
  const wonQuotes = stats?.wonQuotes || 0;

  const viewToQuoteRate = totalViews > 0 ? ((totalQuotes / totalViews) * 100).toFixed(1) : '0';
  const quoteToWonRate = totalQuotes > 0 ? ((wonQuotes / totalQuotes) * 100).toFixed(1) : '0';

  const exportToCSV = () => {
    if (!ranking) return;
    
    const headers = ['Posición', 'Agencia', 'Vistas', 'Cotizaciones', 'Ganadas', 'Conv %', 'Rating', 'Reviews', 'Premium'];
    const rows = ranking.map((agency, index) => [
      index + 1,
      agency.name,
      agency.views,
      agency.quotes,
      agency.wonQuotes,
      agency.conversionRate,
      agency.avgRating || 0,
      agency.reviewsCount || 0,
      agency.isPremium ? 'Sí' : 'No'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitria-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-primary hover:underline mb-2 block">
              ← Volver al Panel
            </Link>
            <h1 className="text-4xl font-bold text-primary mb-2">📊 Analytics Completo</h1>
            <p className="text-dark/70">Dashboard ejecutivo con métricas clave y conversión</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
            </select>
            
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Vistas de Perfil"
            value={totalViews.toLocaleString()}
            icon={<Eye className="w-8 h-8" />}
            color="blue"
            subtitle="Visitas únicas a agencias"
          />
          <KPICard
            title="Cotizaciones Recibidas"
            value={totalQuotes.toLocaleString()}
            icon={<FileText className="w-8 h-8" />}
            color="purple"
            subtitle="Leads generados"
          />
          <KPICard
            title="Cotizaciones Contactadas"
            value={contactedQuotes.toLocaleString()}
            icon={<MousePointerClick className="w-8 h-8" />}
            color="orange"
            subtitle="En proceso o ganadas"
          />
          <KPICard
            title="Proyectos Ganados"
            value={wonQuotes.toLocaleString()}
            icon={<CheckCircle className="w-8 h-8" />}
            color="green"
            subtitle={`${quoteToWonRate}% de conversión`}
          />
        </div>

        {/* Embudo de Conversión */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">🎯 Embudo de Conversión</h2>
          
          <div className="space-y-4">
            {/* Vistas */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-dark">{totalViews.toLocaleString()}</div>
                    <div className="text-sm text-dark/60">Vistas de perfil</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">100%</div>
              </div>
              <div className="w-full h-3 bg-blue-600 rounded-full"></div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-dark/40 transform rotate-90" />
            </div>

            {/* Cotizaciones */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-dark">{totalQuotes.toLocaleString()}</div>
                    <div className="text-sm text-dark/60">Cotizaciones enviadas</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">{viewToQuoteRate}%</div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full" 
                  style={{ width: `${viewToQuoteRate}%` }}
                ></div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-dark/40 transform rotate-90" />
            </div>

            {/* Contactadas */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <MousePointerClick className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-dark">{contactedQuotes.toLocaleString()}</div>
                    <div className="text-sm text-dark/60">Contactadas por agencia</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {totalQuotes > 0 ? ((contactedQuotes / totalQuotes) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-600 rounded-full" 
                  style={{ width: totalQuotes > 0 ? `${(contactedQuotes / totalQuotes) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-dark/40 transform rotate-90" />
            </div>

            {/* Ganadas */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-dark">{wonQuotes.toLocaleString()}</div>
                    <div className="text-sm text-dark/60">Proyectos ganados</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">{quoteToWonRate}%</div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full" 
                  style={{ width: `${quoteToWonRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-dark mb-6">
            🏆 Ranking de Agencias - Últimos {days} días
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-dark">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark">Agencia</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Vistas</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Cotizaciones</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Ganadas</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Conv %</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ranking && ranking.length > 0 ? (
                  ranking.map((agency, index) => (
                    <tr key={agency.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className={`font-bold ${
                          index === 0 ? 'text-yellow-600 text-xl' :
                          index === 1 ? 'text-gray-400 text-lg' :
                          index === 2 ? 'text-orange-600' :
                          'text-dark'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {agency.logoUrl && (
                            <img
                              src={agency.logoUrl}
                              alt={agency.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <Link
                              href={`/agencias/${agency.slug}`}
                              className="font-semibold text-primary hover:underline"
                            >
                              {agency.name}
                            </Link>
                            {agency.isPremium && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                Premium
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        {agency.views.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-purple-600">
                        {agency.quotes.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-green-600">
                        {agency.wonQuotes.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          agency.conversionRate >= 30 ? 'bg-green-100 text-green-700' :
                          agency.conversionRate >= 15 ? 'bg-yellow-100 text-yellow-700' :
                          agency.conversionRate > 0 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {agency.conversionRate}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">
                            {agency.avgRating ? agency.avgRating.toFixed(1) : '-'}
                          </span>
                          <span className="text-sm text-dark/60">
                            ({agency.reviewsCount || 0})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {agency.quotes > 0 ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold">
                            <TrendingUp className="w-4 h-4" />
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                            <TrendingDown className="w-4 h-4" />
                            Sin leads
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-dark/60">
                      No hay datos disponibles para el período seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: 'blue' | 'purple' | 'orange' | 'green';
  subtitle?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    green: 'bg-green-50 border-green-200 text-green-600',
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold text-dark mb-1">{value}</div>
      <div className="text-sm font-semibold text-dark/70 mb-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-dark/50">{subtitle}</div>
      )}
    </div>
  );
}
