'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Eye, Phone, Mail, Globe, MessageSquare, TrendingUp, Search, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ProfileHealthWidget from '@/components/ProfileHealthWidget';

export default function AgencyAnalyticsPage() {
  const [period, setPeriod] = useState(30);
  const { data: analytics, isLoading } = trpc.analytics.getMyAgencyAnalytics.useQuery({ days: period });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">Análisis de tu Agencia</h1>
        <div className="text-center py-12">
          <p className="text-dark/60">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">Análisis de tu Agencia</h1>
        <div className="text-center py-12">
          <p className="text-dark/60">No tienes una agencia registrada o no hay datos disponibles.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Vistas del Perfil',
      value: analytics.views,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      comparison: analytics.platformAverage.views,
    },
    {
      name: 'Contactos Totales',
      value: analytics.totalContacts,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      comparison: analytics.platformAverage.contacts,
    },
    {
      name: 'Clicks en Teléfono',
      value: analytics.phoneClicks,
      icon: Phone,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'Clicks en Email',
      value: analytics.emailClicks,
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Clicks en Sitio Web',
      value: analytics.websiteClicks,
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Formularios Enviados',
      value: analytics.formSubmissions,
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Análisis de tu Agencia</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod(7)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 7
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
            }`}
          >
            7 días
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 30
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
            }`}
          >
            30 días
          </button>
          <button
            onClick={() => setPeriod(90)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 90
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
            }`}
          >
            90 días
          </button>
        </div>
      </div>

      {/* Profile Health Widget */}
      <div className="mb-8">
        <ProfileHealthWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isAboveAverage = stat.comparison ? stat.value > stat.comparison : null;
          
          return (
            <div key={stat.name} className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-dark/60 text-sm mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-dark">{stat.value.toLocaleString()}</p>
                  
                  {stat.comparison !== undefined && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs text-dark/60">
                        Promedio: {stat.comparison.toLocaleString()}
                      </span>
                      {isAboveAverage !== null && (
                        <span
                          className={`text-xs font-semibold ${
                            isAboveAverage ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {isAboveAverage ? '↑' : '↓'}
                          {' '}
                          {Math.abs(
                            Math.round(((stat.value - stat.comparison) / (stat.comparison || 1)) * 100)
                          )}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent/20 text-accent p-3 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-dark">Tasa de Conversión</h3>
          </div>
          <p className="text-4xl font-bold text-dark">{analytics.conversionRate}%</p>
          <p className="text-sm text-dark/60 mt-2">
            De {analytics.views} vistas, {analytics.totalContacts} contactos
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-dark">Apariciones en Búsqueda</h3>
          </div>
          <p className="text-4xl font-bold text-dark">{analytics.searchAppearances.toLocaleString()}</p>
          <p className="text-sm text-dark/60 mt-2">
            {analytics.searchClicks} clicks desde búsqueda
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-dark">Click-Through Rate</h3>
          </div>
          <p className="text-4xl font-bold text-dark">
            {analytics.searchAppearances > 0
              ? ((analytics.searchClicks / analytics.searchAppearances) * 100).toFixed(1)
              : 0}%
          </p>
          <p className="text-sm text-dark/60 mt-2">
            Desde resultados de búsqueda
          </p>
        </div>
      </div>

      {analytics.dailyTrends && analytics.dailyTrends.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8">
          <h3 className="font-bold text-lg text-dark mb-6">Tendencia de Vistas y Contactos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => {
                  const d = new Date(date);
                  return d.toLocaleDateString('es-CL');
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#1B5568"
                strokeWidth={2}
                name="Vistas"
              />
              <Line
                type="monotone"
                dataKey="contacts"
                stroke="#F5D35E"
                strokeWidth={2}
                name="Contactos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {analytics.topKeywords && analytics.topKeywords.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h3 className="font-bold text-lg text-dark mb-4">Palabras Clave Principales</h3>
          <p className="text-sm text-dark/60 mb-4">
            Términos de búsqueda que llevaron a los usuarios a tu perfil
          </p>
          <div className="space-y-3">
            {analytics.topKeywords.map((keyword, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark">{keyword.keyword}</p>
                </div>
                <div className="text-dark/60 font-semibold">
                  {keyword.count} {keyword.count === 1 ? 'búsqueda' : 'búsquedas'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
