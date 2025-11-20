'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { ChevronLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MAIN_CATEGORIES, REGIONS } from '@/lib/categories';
import { useToast } from '@/contexts/ToastContext';

const TEAM_SIZES = [
  { min: 1, max: 5, label: '1-5 empleados' },
  { min: 5, max: 15, label: '5-15 empleados' },
  { min: 15, max: 30, label: '15-30 empleados' },
  { min: 30, max: 50, label: '30-50 empleados' },
  { min: 50, max: 200, label: '50+ empleados' },
];

export default function AdminCrearAgenciaPage() {
  const router = useRouter();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    region: '',
    description: '',
    services: [] as string[],
    categories: [] as string[],
    specialties: [] as string[],
    employeesMin: undefined as number | undefined,
    employeesMax: undefined as number | undefined,
    priceRange: '' as '' | 'Menos de 1M' | '1-3M' | '3-5M' | '5M+',
    logoUrl: '',
    coverUrl: '',
    approvalStatus: 'approved' as 'pending' | 'approved',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const createMutation = trpc.admin.createAgency.useMutation({
    onSuccess: () => {
      toast.success('Agencia creada exitosamente');
      router.push('/admin/agencias');
    },
    onError: (error) => {
      setErrorMessage(error.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(categoryId);
      const newCategories = isSelected
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId];
      
      const newServices = isSelected
        ? prev.services.filter(s => !getCategoryServices(categoryId).includes(s))
        : prev.services;
      
      return {
        ...prev,
        categories: newCategories,
        services: newServices,
      };
    });
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleTeamSizeSelect = (min: number, max: number) => {
    setFormData(prev => ({
      ...prev,
      employeesMin: min,
      employeesMax: max,
    }));
  };

  const getCategoryServices = (categoryId: string) => {
    const category = MAIN_CATEGORIES.find(c => c.id === categoryId);
    return category?.services || [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || formData.name.length < 2) {
      setErrorMessage('El nombre de la agencia es requerido (mínimo 2 caracteres)');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('Email válido es requerido');
      return;
    }
    if (!formData.phone || formData.phone.length < 8) {
      setErrorMessage('Teléfono válido es requerido (mínimo 8 caracteres)');
      return;
    }
    if (!formData.city || formData.city.length < 2) {
      setErrorMessage('Ciudad es requerida');
      return;
    }
    if (!formData.region) {
      setErrorMessage('Región es requerida');
      return;
    }
    if (formData.categories.length === 0) {
      setErrorMessage('Selecciona al menos una categoría');
      return;
    }

    createMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || null,
      city: formData.city,
      region: formData.region,
      description: formData.description || null,
      services: formData.services,
      categories: formData.categories,
      specialties: formData.specialties,
      employeesMin: formData.employeesMin || null,
      employeesMax: formData.employeesMax || null,
      priceRange: formData.priceRange || null,
      logoUrl: formData.logoUrl || null,
      coverUrl: formData.coverUrl || null,
      approvalStatus: formData.approvalStatus,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/admin/agencias"
          className="inline-flex items-center text-primary hover:underline mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver a gestionar agencias
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Crear Nueva Agencia</h1>
          <p className="text-dark/70">Crea una agencia desde el panel de administración</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Información Básica</h2>
            
            <div className="space-y-6">
              <Input
                label="Nombre de la Agencia"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Scale Lab"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email de Contacto"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@agencia.cl"
                />

                <Input
                  label="Teléfono / WhatsApp"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+56912345678"
                />
              </div>

              <Input
                label="Sitio Web (opcional)"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.agencia.cl"
              />

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe los servicios y experiencia de la agencia..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Ciudad"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Santiago"
                />

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Región <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Selecciona una región</option>
                    {REGIONS.map((region) => (
                      <option key={region.value} value={region.label}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="URL del Logo (opcional)"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                />

                <Input
                  label="URL de Portada (opcional)"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Servicios y Categorías</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Categorías <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MAIN_CATEGORIES.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.categories.includes(category.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-dark">{category.label}</div>
                        <div className="text-xs text-dark/60">{category.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.categories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-dark mb-3">
                    Servicios Específicos (opcional)
                  </label>
                  <div className="space-y-4">
                    {formData.categories.map((categoryId) => {
                      const category = MAIN_CATEGORIES.find(c => c.id === categoryId);
                      if (!category) return null;
                      
                      return (
                        <div key={categoryId} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-semibold text-primary mb-2">{category.label}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {category.services.map((service) => (
                              <label key={service} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={formData.services.includes(service)}
                                  onChange={() => handleServiceToggle(service)}
                                />
                                <span className="text-dark">{service}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Detalles del Negocio</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Tamaño del Equipo (opcional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TEAM_SIZES.map((size) => (
                    <label
                      key={size.label}
                      className={`flex items-center px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.employeesMin === size.min && formData.employeesMax === size.max
                          ? 'border-primary bg-primary/5 font-semibold'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="teamSize"
                        checked={formData.employeesMin === size.min && formData.employeesMax === size.max}
                        onChange={() => handleTeamSizeSelect(size.min, size.max)}
                        className="mr-3"
                      />
                      <span className="text-dark">{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Rango de Precios (opcional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'Menos de 1M', label: 'Menos de 1M' },
                    { value: '1-3M', label: '1-3 Millones' },
                    { value: '3-5M', label: '3-5 Millones' },
                    { value: '5M+', label: '5+ Millones' },
                  ].map((price) => (
                    <label
                      key={price.value}
                      className={`flex flex-col items-center px-4 py-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.priceRange === price.value
                          ? 'border-primary bg-primary/5 text-primary font-semibold'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={formData.priceRange === price.value}
                        onChange={() => setFormData({ ...formData, priceRange: price.value as any })}
                        className="sr-only"
                      />
                      <span className="text-lg font-bold mb-1">{price.value}</span>
                      <span className="text-xs text-dark/60">Presupuesto mínimo CLP</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-3">
                  Estado de Aprobación
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="approvalStatus"
                      value="approved"
                      checked={formData.approvalStatus === 'approved'}
                      onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value as 'approved' })}
                    />
                    <span className="text-dark">Aprobada (visible inmediatamente)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="approvalStatus"
                      value="pending"
                      checked={formData.approvalStatus === 'pending'}
                      onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value as 'pending' })}
                    />
                    <span className="text-dark">Pendiente de aprobación</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/admin/agencias" className="flex-1">
              <Button variant="secondary" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={createMutation.isPending}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Crear Agencia
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
