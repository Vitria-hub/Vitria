'use client';

import { trpc } from '@/lib/trpc';
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ProfileHealthWidget() {
  const { data: health, isLoading } = trpc.agency.getProfileHealth.useQuery({});

  if (isLoading) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!health) return null;

  const { score, checks, missingCount } = health;

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreEmoji = () => {
    if (score >= 80) return '🟢';
    if (score >= 50) return '🟡';
    return '🔴';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-dark mb-1">
            💪 Fortaleza del Perfil
          </h3>
          <p className="text-sm text-dark/60">
            Optimiza tu perfil para recibir más cotizaciones
          </p>
        </div>
        <div className={`text-3xl font-bold px-4 py-2 rounded-lg border-2 ${getScoreColor()}`}>
          {getScoreEmoji()} {score}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 mb-6">
        {checks.map((check) => (
          <div
            key={check.field}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              check.completed ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            {check.completed ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span
              className={`text-sm ${
                check.completed ? 'text-green-900 font-semibold' : 'text-dark/70'
              }`}
            >
              {check.label}
            </span>
            {!check.completed && (
              <span className="ml-auto text-xs text-primary font-semibold">
                +{check.weight}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      {missingCount > 0 && (
        <div className="border-t-2 border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3 text-sm text-dark/70">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span>
              Te faltan <strong>{missingCount} elementos</strong> para alcanzar el 100%
            </span>
          </div>
          <Link
            href="/dashboard/editar-perfil"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-dark transition"
          >
            <TrendingUp className="w-5 h-5" />
            Completar Perfil
          </Link>
          <p className="text-xs text-center text-dark/60 mt-3">
            💡 Perfiles al 100% reciben <strong>3x más cotizaciones</strong>
          </p>
        </div>
      )}

      {score === 100 && (
        <div className="border-t-2 border-green-200 pt-4 bg-green-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-xl">
          <p className="text-center text-green-700 font-bold text-lg">
            🎉 ¡Perfil perfecto! Estás maximizando tus oportunidades
          </p>
        </div>
      )}
    </div>
  );
}
