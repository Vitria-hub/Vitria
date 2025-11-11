'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Star,
  Download,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

const COLORS = ['#2D6A7E', '#E27154', '#F4A261', '#E76F51', '#264653'];

export default function AnalyticsPage() {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const [days, setDays] = useState(30);
  
  const { data: stats } = trpc.analytics.getDashboardStats.useQuery(
    { days },
    { enabled: userData?.role === 'admin' }
  );
  
  const { data: ranking } = trpc.analytics.getAgencyRanking.useQuery(
    { days, limit: 10 },
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

  const exportToCSV = () => {
    if (!ranking) return;
    
    const headers = ['Posición', 'Agencia', 'Vistas', 'Contactos', 'CTR %', 'Rating', 'Reviews'];
    const rows = ranking.map((agency, index) => [
      index + 1,
      agency.name,
      agency.views,
      agency.contacts,
      agency.ctr,
      agency.avgRating,
      agency.reviewsCount,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitria-ranking-${new Date().toISOString().split('T')[0]}.csv`;
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
            <h1 className="text-4xl font-bold text-primary mb-2">Analytics Completo</h1>
            <p className="text-dark/70">Métricas detalladas y rankings de agencias</p>
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

        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Vistas"
            value={ranking?.reduce((sum, a) => sum + a.views, 0) || 0}
            icon={<Eye className="w-6 h-6 text-blue-600" />}
            change="+12%"
          />
          <KPICard
            title="Total Contactos"
            value={ranking?.reduce((sum, a) => sum + a.contacts, 0) || 0}
            icon={<MousePointerClick className="w-6 h-6 text-green-600" />}
            change="+8%"
          />
          <KPICard
            title="CTR Promedio"
            value={ranking && ranking.length > 0 
              ? `${(ranking.reduce((sum, a) => sum + a.ctr, 0) / ranking.length).toFixed(1)}%`
              : '0%'}
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            isPercentage
          />
          <KPICard
            title="Rating Promedio"
            value={ranking && ranking.length > 0
              ? (ranking.reduce((sum, a) => sum + (a.avgRating || 0), 0) / ranking.length).toFixed(1)
              : '0'}
            icon={<Star className="w-6 h-6 text-yellow-600" />}
            suffix="⭐"
          />
        </div>

        {/* Ranking Table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">
            🏆 Top 10 Agencias - Últimos {days} días
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-dark">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark">Agencia</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Vistas</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Contactos</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">CTR</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Rating</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Reviews</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ranking?.map((agency, index) => (
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
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold">
                      {agency.views.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-green-600">
                      {agency.contacts.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2 py-1 rounded ${
                        agency.ctr >= 10 ? 'bg-green-100 text-green-700' :
                        agency.ctr >= 5 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {agency.ctr.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {agency.avgRating ? `${agency.avgRating.toFixed(1)}⭐` : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-right text-dark/60">
                      {agency.reviewsCount}
                    </td>
                    <td className="py-4 px-4">
                      {agency.isPremium && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                          PREMIUM
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart - Top 5 por Vistas */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-dark mb-4">Top 5 Agencias - Vistas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ranking?.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#2D6A7E" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Top 5 por Contactos */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-dark mb-4">Top 5 Agencias - Contactos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ranking?.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contacts" fill="#E27154" />
              </BarChart>
            </ResponsiveContainer>
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
  change,
  isPercentage,
  suffix,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: string;
  isPercentage?: boolean;
  suffix?: string;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>{icon}</div>
        {change && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-dark mb-1">
        {typeof value === 'number' && !isPercentage ? value.toLocaleString() : value}
        {suffix}
      </h3>
      <p className="text-sm text-dark/60">{title}</p>
    </div>
  );
}
