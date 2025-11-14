'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function EditarPerfilPage() {
  const router = useRouter();
  const { data: agency, isLoading } = trpc.agency.myAgency.useQuery();
  const [message, setMessage] = useState('');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-dark/60">Cargando información de tu agencia...</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Dashboard
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="bg-accent/10 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-dark" />
              <h1 className="text-2xl font-bold text-dark">Editar Perfil de Agencia</h1>
            </div>
            {agency.approval_status && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                agency.approval_status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : agency.approval_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {agency.approval_status === 'approved' && 'Aprobada'}
                {agency.approval_status === 'pending' && 'En lista de espera'}
                {agency.approval_status === 'rejected' && 'No aprobada'}
              </span>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-2">🚧 Función en desarrollo</h3>
            <p className="text-blue-800 text-sm mb-3">
              La edición de perfil estará disponible próximamente. Por ahora, puedes visualizar la información de tu agencia aquí.
            </p>
            <p className="text-blue-800 text-sm">
              Si necesitas actualizar información importante, por favor contacta a nuestro equipo.
            </p>
          </div>

          {/* Agency Information Display */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-dark mb-4">Información de la Agencia</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Nombre</label>
                  <p className="text-dark/70">{agency.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Ubicación</label>
                  <p className="text-dark/70">{agency.location_city}, {agency.location_region}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Email de Contacto Público</label>
                  <p className="text-dark/70">{agency.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Teléfono</label>
                  <p className="text-dark/70">{agency.phone}</p>
                </div>

                {agency.website && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-dark mb-2">Sitio Web</label>
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {agency.website}
                    </a>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-dark mb-2">Descripción</label>
                  <p className="text-dark/70 whitespace-pre-wrap">{agency.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Categorías</label>
                  <div className="flex flex-wrap gap-2">
                    {(agency.categories as string[])?.map((cat) => (
                      <span key={cat} className="px-3 py-1 bg-lilac/20 text-dark rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Servicios</label>
                  <div className="flex flex-wrap gap-2">
                    {(agency.services as string[])?.map((service) => (
                      <span key={service} className="px-3 py-1 bg-mint/20 text-dark rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/dashboard">
              <Button variant="outline">
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
