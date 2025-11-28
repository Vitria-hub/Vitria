'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { MAIN_CATEGORIES, REGIONS, INDUSTRIES } from '@/lib/categories';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { uploadAgencyLogo, validateImageFile } from '@/lib/storage';
import { ChevronLeft, AlertCircle, Save, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/contexts/ToastContext';

export default function EditAgencyPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const agencyId = params.id as string;
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    website: '',
    location_city: '',
    location_region: '',
    categories: [] as string[],
    services: [] as string[],
    logo_url: '',
    cover_url: '',
    employees_min: null as number | null,
    employees_max: null as number | null,
    price_range: '',
    specialties: [] as string[],
    industries: [] as string[],
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [logoError, setLogoError] = useState('');
  const [coverError, setCoverError] = useState('');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { data: agency, isLoading, error: queryError } = trpc.admin.getAgency.useQuery(
    { agencyId },
    { 
      enabled: !!userData && userData.role === 'admin',
      retry: false
    }
  );

  const updateMutation = trpc.admin.updateAgency.useMutation({
    onSuccess: () => {
      setSuccess(true);
      toast.success('Agencia actualizada exitosamente');
      setTimeout(() => router.push(`/admin/agencias/${agencyId}`), 2000);
    },
    onError: (err) => {
      setError(err.message || 'Error al actualizar la agencia');
      toast.error(`Error al actualizar: ${err.message || 'Error desconocido'}`);
    },
  });

  useEffect(() => {
    if (agency) {
      try {
        setFormData({
          name: agency.name || '',
          slug: agency.slug || '',
          description: agency.description || '',
          email: agency.email || '',
          phone: agency.phone || '',
          whatsapp_number: agency.whatsapp_number || '',
          website: agency.website || '',
          location_city: agency.location_city || '',
          location_region: agency.location_region || '',
          categories: Array.isArray(agency.categories) ? agency.categories : [],
          services: Array.isArray(agency.services) ? agency.services : [],
          logo_url: agency.logo_url || '',
          cover_url: agency.cover_url || '',
          employees_min: agency.employees_min ?? null,
          employees_max: agency.employees_max ?? null,
          price_range: agency.price_range || '',
          specialties: Array.isArray(agency.specialties) ? agency.specialties : [],
          industries: Array.isArray(agency.industries) ? agency.industries : [],
        });
      } catch (err) {
        console.error('Error setting form data:', err);
        setError('Error al cargar los datos de la agencia');
      }
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

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setLogoError(validation.error || 'Archivo inválido');
      return;
    }

    setLogoError('');
    setUploadingLogo(true);

    try {
      const agencySlug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
      const logoUrl = await uploadAgencyLogo(file, agencySlug);
      setFormData({ ...formData, logo_url: logoUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
      setLogoError('Error al subir el logo. Por favor intenta de nuevo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setCoverError(validation.error || 'Archivo inválido');
      return;
    }

    setCoverError('');
    setUploadingCover(true);

    try {
      const agencySlug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
      const coverUrl = await uploadAgencyLogo(file, `${agencySlug}-cover`);
      setFormData({ ...formData, cover_url: coverUrl });
    } catch (error) {
      console.error('Error uploading cover:', error);
      setCoverError('Error al subir la portada. Por favor intenta de nuevo.');
    } finally {
      setUploadingCover(false);
    }
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

  if (queryError || (!isLoading && !agency)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">Agencia no encontrada</h1>
          {queryError && (
            <p className="text-dark/60 mb-4">{queryError.message}</p>
          )}
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
                  WhatsApp *
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
                  WhatsApp Adicional (Premium)
                </label>
                <Input
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="+56 9 1234 5678"
                />
                <p className="text-sm text-dark/60 mt-1">Número WhatsApp adicional, solo visible para agencias premium</p>
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
                  Región (opcional)
                </label>
                <select
                  value={formData.location_region}
                  onChange={(e) => setFormData({ ...formData, location_region: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary appearance-none"
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

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Imágenes</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Logo de la Agencia
                </label>
                
                {formData.logo_url && (
                  <div className="mb-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={formData.logo_url}
                          alt="Logo actual"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-dark/80 font-medium">Logo actual</p>
                        <p className="text-xs text-dark/60 mt-1">{formData.logo_url}</p>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingLogo ? 'Subiendo...' : 'Subir Logo'}
                </Button>
                
                {logoError && (
                  <p className="text-sm text-red-600 mt-2">{logoError}</p>
                )}
                <p className="text-sm text-dark/60 mt-2">
                  Recomendado: 200x200px, formato PNG con fondo transparente (máx. 5MB)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Imagen de Portada
                </label>
                
                {formData.cover_url && (
                  <div className="mb-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                    <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                      <Image
                        src={formData.cover_url}
                        alt="Portada actual"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-dark/60 mt-2">{formData.cover_url}</p>
                  </div>
                )}

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingCover ? 'Subiendo...' : 'Subir Portada'}
                </Button>
                
                {coverError && (
                  <p className="text-sm text-red-600 mt-2">{coverError}</p>
                )}
                <p className="text-sm text-dark/60 mt-2">
                  Recomendado: 1200x400px, formato JPG o PNG (máx. 10MB)
                </p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Tamaño del Equipo</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Número Mínimo de Empleados
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.employees_min ?? ''}
                  onChange={(e) => setFormData({ ...formData, employees_min: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Número Máximo de Empleados
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.employees_max ?? ''}
                  onChange={(e) => setFormData({ ...formData, employees_max: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="50"
                />
              </div>
            </div>
            <p className="text-sm text-dark/60 mt-2">
              Ejemplo: 5-50 empleados, 50-100 empleados, etc.
            </p>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Rango de Precios</h2>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Nivel de Precios
              </label>
              <select
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary appearance-none"
              >
                <option value="">Sin especificar</option>
                <option value="Menos de 1M">Menos de 1 Millón CLP</option>
                <option value="1-3M">1-3 Millones CLP</option>
                <option value="3-5M">3-5 Millones CLP</option>
                <option value="5M+">5+ Millones CLP</option>
              </select>
              <p className="text-sm text-dark/60 mt-1">
                Indica el rango de precios aproximado de los servicios (presupuesto mínimo de proyecto)
              </p>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Especialidades Técnicas</h2>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Especialidades (una por línea)
              </label>
              <textarea
                value={formData.specialties.join('\n')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specialties: e.target.value.split('\n').filter(s => s.trim()) 
                })}
                placeholder="React&#10;Node.js&#10;Python&#10;Google Ads&#10;SEO"
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none font-mono text-sm"
              />
              <p className="text-sm text-dark/60 mt-1">
                Tecnologías, plataformas o habilidades específicas (por ejemplo: React, Shopify, Google Analytics, Adobe Creative Suite)
              </p>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Industrias / Nichos</h2>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Selecciona las industrias en las que la agencia tiene experiencia
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INDUSTRIES.map((industry) => (
                  <label
                    key={industry}
                    className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.industries.includes(industry)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.industries.includes(industry)}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          industries: toggleArrayItem(formData.industries, industry),
                        })
                      }
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{industry}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-dark/60 mt-3">
                Estas industrias aparecerán en los filtros del explorador para que los clientes encuentren agencias especializadas en su sector
              </p>
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
