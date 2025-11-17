'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { MAIN_CATEGORIES, REGIONS } from '@/lib/categories';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { ChevronLeft, AlertCircle, Save } from 'lucide-react';

export default function EditAgencyPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const agencyId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    location_city: '',
    location_region: '',
    categories: [] as string[],
    services: [] as string[],
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: agency, isLoading } = trpc.admin.getAgency.useQuery(
    { agencyId },
    { enabled: userData?.role === 'admin' }
  );

  const updateMutation = trpc.admin.updateAgency.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push(`/admin/agencias/${agencyId}`), 2000);
    },
    onError: (err) => {
      setError(err.message || 'Error al actualizar la agencia');
    },
  });

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || '',
        slug: agency.slug || '',
        description: agency.description || '',
        email: agency.email || '',
        phone: agency.phone || '',
        website: agency.website || '',
        location_city: agency.location_city || '',
        location_region: agency.location_region || '',
        categories: agency.categories || [],
        services: agency.services || [],
      });
    }
  }, [agency]);

  useEffect(() => {
    if (!authLoading && (!userData || userData.role !== 'admin')) {
      router.push('/');
    }
  }, [userData, authLoading, router]);

  if (authLoading || !userData || userData.role !== 'admin') {
    return null;
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre de la agencia es requerido');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    updateMutation.mutate({
      agencyId,
      ...formData,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark/60">Cargando información de la agencia...</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">Agencia no encontrada</h1>
          <Button variant="primary" onClick={() => router.push('/admin/agencias')}>
            Volver al panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push(`/admin/agencias/${agencyId}`)}
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver a detalles
          </button>
          <h1 className="text-4xl font-bold text-primary mb-2">Editar Agencia</h1>
          <p className="text-dark/70">Modifica la información de {agency.name}</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
            <Save className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">¡Cambios guardados!</p>
              <p className="text-sm text-green-700">Redirigiendo...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-xl p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Información Básica</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Nombre de la Agencia *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mi Agencia Digital"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Slug (URL) *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="mi-agencia-digital"
                  required
                />
                <p className="text-sm text-dark/60 mt-1">
                  URL: vitria.cl/agencias/{formData.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la agencia..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Información de Contacto</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@agencia.cl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Teléfono *
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Sitio Web
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.agencia.cl"
                />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Ubicación</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Ciudad *
                </label>
                <Input
                  value={formData.location_city}
                  onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                  placeholder="Santiago"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Región *
                </label>
                <select
                  value={formData.location_region}
                  onChange={(e) => setFormData({ ...formData, location_region: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary appearance-none"
                  required
                >
                  <option value="">Selecciona una región</option>
                  {REGIONS.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Categorías y Servicios</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Categorías *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MAIN_CATEGORIES.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.categories.includes(category.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            categories: toggleArrayItem(formData.categories, category.id),
                          })
                        }
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-base">{category.label}</div>
                        <div className="text-xs text-dark/60">{category.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.categories.length > 0 && (
                <div className="border-t-2 border-gray-200 pt-6">
                  <label className="block text-sm font-semibold text-dark mb-3">
                    Servicios Específicos
                  </label>
                  <div className="space-y-6">
                    {MAIN_CATEGORIES.filter((cat) => formData.categories.includes(cat.id)).map(
                      (category) => (
                        <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-bold text-primary mb-3">{category.label}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {category.services.map((service) => (
                              <label
                                key={service}
                                className={`flex items-center gap-2 px-3 py-2 text-sm border rounded cursor-pointer transition ${
                                  formData.services.includes(service)
                                    ? 'border-primary bg-white text-primary font-medium'
                                    : 'border-gray-200 bg-white hover:border-primary/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.services.includes(service)}
                                  onChange={() =>
                                    setFormData({
                                      ...formData,
                                      services: toggleArrayItem(formData.services, service),
                                    })
                                  }
                                  className="w-4 h-4"
                                />
                                <span>{service}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8 flex gap-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.push(`/admin/agencias/${agencyId}`)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
