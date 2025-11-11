'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { TrendingUp, Eye, MousePointerClick, Users } from 'lucide-react';

export default function DashboardPage() {
  const [tab, setTab] = useState<'profile' | 'metrics' | 'subscription'>('profile');

  const mockMetrics = [
    { label: 'Vistas', value: 1234, icon: Eye, change: '+12%' },
    { label: 'Clics en Perfil', value: 456, icon: MousePointerClick, change: '+8%' },
    { label: 'Contactos', value: 89, icon: Users, change: '+15%' },
    { label: 'Leads', value: 34, icon: TrendingUp, change: '+22%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Dashboard de Agencia</h1>

      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
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
              onClick={() => setTab('subscription')}
              className={`px-6 py-4 font-semibold transition ${
                tab === 'subscription'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-dark/60 hover:text-primary'
              }`}
            >
              Suscripción
            </button>
          </nav>
        </div>

        <div className="p-8">
          {tab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Editar Perfil</h2>
              <p className="text-dark/60 mb-4">
                Funcionalidad para editar perfil (logo, cover, descripción, servicios, etc.)
                próximamente disponible.
              </p>
              <Button>Guardar Cambios</Button>
            </div>
          )}

          {tab === 'metrics' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Métricas (Últimos 30 días)</h2>
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

          {tab === 'subscription' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Plan de Suscripción</h2>
              <div className="bg-mint/10 border-2 border-mint rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-dark mb-2">Plan Actual: Free</h3>
                <p className="text-dark/70 mb-4">
                  Actualiza a Premium para destacar tu agencia y acceder a funcionalidades
                  exclusivas.
                </p>
              </div>

              <div className="bg-white border-2 border-primary rounded-lg p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Plan Premium - $49/mes</h3>
                <ul className="space-y-2 mb-6 text-dark/80">
                  <li>✓ Destacado en el carrusel principal</li>
                  <li>✓ Badge Premium en tu perfil</li>
                  <li>✓ Portafolio ilimitado</li>
                  <li>✓ Métricas avanzadas</li>
                  <li>✓ Prioridad en resultados de búsqueda</li>
                </ul>
                <Button variant="accent" size="lg">
                  Actualizar a Premium
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
