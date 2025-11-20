'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Building2, Save, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MAIN_CATEGORIES } from '@/lib/categories';
import { uploadAgencyLogo, validateImageFile } from '@/lib/storage';
import Image from 'next/image';

const REGIONS = [
  'Región Metropolitana',
  'Región de Valparaíso',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Lagos',
  'Región de Antofagasta',
  'Región de Coquimbo',
  'Región de O\'Higgins',
  'Región del Maule',
  'Región de Ñuble',
  'Región de Los Ríos',
  'Región de Aysén',
  'Región de Magallanes',
  'Región de Arica y Parinacota',
  'Región de Tarapacá',
  'Región de Atacama',
];

const TEAM_SIZES = [
  { min: 1, max: 5, label: '1-5 empleados (Boutique)' },
  { min: 5, max: 15, label: '5-15 empleados (Pequeña)' },
  { min: 15, max: 30, label: '15-30 empleados (Mediana)' },
  { min: 30, max: 50, label: '30-50 empleados (Grande)' },
  { min: 50, max: 200, label: '50+ empleados (Enterprise)' },
];

export default function EditarPerfilPage() {
  const router = useRouter();
  const { data: agency, isLoading: loadingAgency } = trpc.agency.myAgency.useQuery();
  const utils = trpc.useUtils();
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    city: '',
    region: '',
    services: [] as string[],
    categories: [] as string[],
    employeesMin: undefined as number | undefined,
    employeesMax: undefined as number | undefined,
    priceRange: '' as '' | 'Menos de 1M' | '1-3M' | '3-5M' | '5M+',
  });

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || '',
        logo_url: agency.logo_url || '',
        description: agency.description || '',
        website: agency.website || '',
        email: agency.email || '',
        phone: agency.phone || '',
        city: agency.location_city || '',
        region: agency.location_region || '',
        services: (agency.services as string[]) || [],
        categories: (agency.categories as string[]) || [],
        employeesMin: agency.employees_min || undefined,
        employeesMax: agency.employees_max || undefined,
        priceRange: (agency.price_range as '' | 'Menos de 1M' | '1-3M' | '3-5M' | '5M+') || '',
      });
      if (agency.logo_url) {
        setLogoPreview(agency.logo_url);
      }
    }
  }, [agency]);

  const updateMutation = trpc.agency.update.useMutation({
    onSuccess: () => {
      utils.agency.myAgency.invalidate();
      setSuccessMessage('¡Perfil actualizado exitosamente!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError('');
    
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setLogoError(validation.error || 'Error de validación');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadLogo = async () => {
    if (!logoFile || !agency) return formData.logo_url;

    setUploadingLogo(true);
    setLogoError('');

    try {
      const logoUrl = await uploadAgencyLogo(logoFile, agency.slug);
      setFormData({ ...formData, logo_url: logoUrl });
      return logoUrl;
    } catch (error: any) {
      setLogoError(error.message || 'Error al subir el logo');
      throw error;
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setFormData({ ...formData, logo_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name || formData.name.length < 2) {
      setErrorMessage('El nombre debe tener al menos 2 caracteres');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.description || formData.description.length < 50) {
      setErrorMessage('La descripción debe tener al menos 50 caracteres');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('Email de contacto público válido es requerido');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.phone || formData.phone.length < 8) {
      setErrorMessage('WhatsApp válido es requerido');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.city || formData.city.length < 2) {
      setErrorMessage('Ciudad es requerida');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.region) {
      setErrorMessage('Región es requerida');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.categories || formData.categories.length === 0) {
      setErrorMessage('Selecciona al menos una categoría');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.priceRange) {
      setErrorMessage('Selecciona un rango de precios');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      let logoUrl = formData.logo_url;
      if (logoFile) {
        logoUrl = await uploadLogo();
        if (!logoUrl) {
          setErrorMessage('Error al subir el logo. Intenta nuevamente.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      const submitData: any = {
        ...formData,
        logo_url: logoUrl,
      };

      updateMutation.mutate(submitData);
    } catch (error: any) {
      console.error('Error updating agency:', error);
      setErrorMessage(error.message || 'Error al actualizar la agencia. Intenta nuevamente.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loadingAgency) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-dark/60">Cargando información de tu agencia...</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    router.push('/dashboard');
    return null;
  }

  const allServices = MAIN_CATEGORIES.flatMap(cat => cat.services);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Dashboard
      </Link>

      <form onSubmit={handleSubmit}>
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
            {successMessage && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-dark mb-4">Información Básica</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Nombre de la Agencia *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Agencia Creativa Chile"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Logo de la Agencia
                    </label>
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      {logoPreview ? (
                        <div className="relative inline-block">
                          <div className="w-32 h-32 relative border-2 border-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition"
                        >
                          <Upload className="w-5 h-5 text-dark/60" />
                          <span className="text-dark/60">Subir logo</span>
                        </button>
                      )}
                      {logoError && (
                        <p className="text-sm text-red-600">{logoError}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Descripción * (mínimo 50 caracteres)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe los servicios y especialidad de tu agencia"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none resize-none"
                      rows={4}
                      required
                    />
                    <p className={`text-sm mt-1 ${
                      formData.description.length >= 50 ? 'text-green-600 font-medium' : 'text-dark/60'
                    }`}>
                      {formData.description.length} caracteres
                      {formData.description.length < 50 && ` (mínimo: 50)`}
                      {formData.description.length >= 50 && ' ✓'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Email de Contacto Público *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contacto@miagencia.cl"
                        required
                      />
                      <p className="text-xs text-dark/60 mt-1">
                        Este email será visible para clientes potenciales.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        WhatsApp *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+56 9 1234 5678"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Sitio Web (opcional)
                    </label>
                    <Input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://miagencia.cl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Ciudad *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Santiago"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Región *
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none bg-white"
                        required
                      >
                        <option value="">Selecciona una región</option>
                        {REGIONS.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services and Categories */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-dark mb-4">Servicios y Categorías</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Categoría Principal * (máximo 3)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MAIN_CATEGORIES.map((category) => (
                        <label
                          key={category.id}
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                            formData.categories.includes(category.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (formData.categories.length < 3) {
                                  setFormData({ ...formData, categories: [...formData.categories, category.id] });
                                }
                              } else {
                                setFormData({ ...formData, categories: formData.categories.filter(c => c !== category.id) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-dark">{category.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Servicios Ofrecidos
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {allServices.map((service) => (
                        <label
                          key={service}
                          className={`flex items-center p-2 border-2 rounded-lg cursor-pointer transition text-sm ${
                            formData.services.includes(service)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, services: [...formData.services, service] });
                              } else {
                                setFormData({ ...formData, services: formData.services.filter(s => s !== service) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-dark">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-dark mb-4">Detalles del Negocio</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Tamaño del Equipo
                    </label>
                    <div className="space-y-2">
                      {TEAM_SIZES.map((size) => (
                        <label
                          key={size.label}
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                            formData.employeesMin === size.min && formData.employeesMax === size.max
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="teamSize"
                            checked={formData.employeesMin === size.min && formData.employeesMax === size.max}
                            onChange={() => setFormData({ ...formData, employeesMin: size.min, employeesMax: size.max })}
                            className="mr-3"
                          />
                          <span className="text-dark">{size.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Rango de Precios *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(['Menos de 1M', '1-3M', '3-5M', '5M+'] as const).map((range) => (
                        <label
                          key={range}
                          className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                            formData.priceRange === range
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            value={range}
                            checked={formData.priceRange === range}
                            onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as 'Menos de 1M' | '1-3M' | '3-5M' | '5M+' })}
                            className="sr-only"
                          />
                          <span className="text-lg font-bold text-primary mb-1">{range}</span>
                          <span className="text-xs text-dark/60 text-center">Millones CLP</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-gray-200 flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={updateMutation.isPending || uploadingLogo}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
