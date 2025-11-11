'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';

export default function CrearAgenciaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    city: '',
    region: '',
  });

  const createMutation = trpc.agency.create.useMutation({
    onSuccess: (data) => {
      router.push(`/agencias/${data.slug}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Crear Mi Agencia</h1>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-xl p-8 space-y-6">
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
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe los servicios y especialidad de tu agencia..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none resize-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Sitio Web
            </label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://miagencia.cl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contacto@miagencia.cl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Teléfono
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Ciudad
            </label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Santiago"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-2">
            Región
          </label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none"
          >
            <option value="">Selecciona una región</option>
            <option value="RM">Región Metropolitana</option>
            <option value="V">Valparaíso</option>
            <option value="VIII">Biobío</option>
            <option value="IV">Coquimbo</option>
            <option value="VII">Maule</option>
            <option value="IX">Araucanía</option>
            <option value="X">Los Lagos</option>
          </select>
        </div>

        {createMutation.error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error al crear la agencia. Inténtalo de nuevo.
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={createMutation.isLoading}>
            {createMutation.isLoading ? 'Creando...' : 'Crear Agencia'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
