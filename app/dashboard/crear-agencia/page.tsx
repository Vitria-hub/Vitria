'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';
import { ChevronRight, ChevronLeft, Check, Upload, X, Image as ImageIcon } from 'lucide-react';
import { MAIN_CATEGORIES } from '@/lib/categories';
import { SPECIALTY_CATEGORIES } from '@/lib/specialties';
import { uploadAgencyLogo, validateImageFile } from '@/lib/storage';
import Image from 'next/image';

const INDUSTRIES = [
  'Retail', 'Tech/Startups', 'E-commerce', 'Salud', 'Educación',
  'Inmobiliaria', 'Finanzas', 'Alimentos y Bebidas', 'Turismo',
  'Automotriz', 'Moda', 'Deportes', 'Entretenimiento', 'ONG'
];

const TEAM_SIZES = [
  { min: 1, max: 5, label: '1-5 empleados (Boutique)' },
  { min: 5, max: 15, label: '5-15 empleados (Pequeña)' },
  { min: 15, max: 30, label: '15-30 empleados (Mediana)' },
  { min: 30, max: 50, label: '30-50 empleados (Grande)' },
  { min: 50, max: 200, label: '50+ empleados (Enterprise)' },
];

export default function CrearAgenciaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
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
    specialties: [] as string[],
    employeesMin: undefined as number | undefined,
    employeesMax: undefined as number | undefined,
    priceRange: '' as '' | 'Menos de 1M' | '1-3M' | '3-5M' | '5M+',
    industries: [] as string[],
  });

  const createMutation = trpc.agency.create.useMutation({
    onSuccess: (data) => {
      // Redirect to dashboard with success message
      // Agency is pending approval, so public page won't be visible yet
      router.push('/dashboard?agencia_creada=true');
    },
    onError: (error) => {
      console.error('Error creating agency:', error);
      scrollToTop();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Only submit if we're on step 3 and validation passes
    if (currentStep !== 3) {
      return;
    }
    
    if (!validateStep(3)) {
      return;
    }
    
    const submitData = {
      ...formData,
      priceRange: formData.priceRange as 'Menos de 1M' | '1-3M' | '3-5M' | '5M+',
    };
    
    createMutation.mutate(submitData);
  };

  const [validationError, setValidationError] = useState('');

  const validateStep = (step: number): boolean => {
    setValidationError('');
    
    if (step === 1) {
      if (!formData.name || formData.name.length < 2) {
        setValidationError('El nombre de la agencia es requerido (mínimo 2 caracteres)');
        return false;
      }
      if (!formData.description || formData.description.length < 50) {
        setValidationError('La descripción es requerida (mínimo 50 caracteres)');
        return false;
      }
      if (!formData.email || !formData.email.includes('@')) {
        setValidationError('Email de contacto público válido es requerido');
        return false;
      }
      if (!formData.phone || formData.phone.length < 8) {
        setValidationError('WhatsApp válido es requerido (mínimo 8 caracteres)');
        return false;
      }
      if (!formData.city || formData.city.length < 2) {
        setValidationError('Ciudad es requerida');
        return false;
      }
      if (!formData.region) {
        setValidationError('Región es requerida');
        return false;
      }
    }
    
    if (step === 2) {
      if (formData.categories.length === 0) {
        setValidationError('Debes seleccionar al menos una categoría principal');
        return false;
      }
    }
    
    if (step === 3) {
      if (!formData.employeesMin || !formData.employeesMax) {
        setValidationError('Debes seleccionar el tamaño del equipo');
        return false;
      }
      if (!formData.priceRange) {
        setValidationError('Debes seleccionar un rango de precios');
        return false;
      }
    }
    
    return true;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      scrollToTop();
    }
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || step === currentStep + 1) {
      setCurrentStep(step);
      scrollToTop();
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  // Limpiar el error de logo cuando el usuario ingresa el nombre
  useEffect(() => {
    if (formData.name && logoError === 'Primero ingresa el nombre de la agencia') {
      setLogoError('');
    }
  }, [formData.name]);

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo_url: '' }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!formData.name) {
      setLogoError('Primero ingresa el nombre de la agencia');
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setLogoError(validation.error || 'Archivo inválido');
      return;
    }

    setLogoError('');
    setUploadingLogo(true);

    try {
      const agencySlug = formData.name.toLowerCase().replace(/\s+/g, '-');
      const logoUrl = await uploadAgencyLogo(file, agencySlug);
      setFormData(prev => ({ ...prev, logo_url: logoUrl }));
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      setLogoError(error.message || 'Error al subir el logo. Por favor intenta de nuevo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-2">Crear Mi Agencia</h1>
      <p className="text-dark/70 mb-8">Completa la información en 3 simples pasos</p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          {[
            { num: 1, label: 'Información Básica' },
            { num: 2, label: 'Servicios' },
            { num: 3, label: 'Detalles del Negocio' }
          ].map((step, index) => (
            <div key={step.num} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div className={`flex-1 h-1 ${
                    step.num <= currentStep ? 'bg-accent' : 'bg-gray-200'
                  }`} />
                )}
                <button
                  type="button"
                  onClick={() => goToStep(step.num)}
                  disabled={step.num > currentStep}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold flex-shrink-0 transition-all ${
                    step.num === currentStep ? 'bg-primary text-white' :
                    step.num < currentStep ? 'bg-accent text-dark cursor-pointer hover:scale-110' :
                    'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step.num < currentStep ? <Check className="w-5 h-5" /> : step.num}
                </button>
                {index < 2 && (
                  <div className={`flex-1 h-1 ${
                    step.num < currentStep ? 'bg-accent' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              <span className={`mt-2 text-xs sm:text-sm text-center ${
                step.num === currentStep ? 'text-primary font-semibold' : 'text-dark/60'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={(e) => {
        // Prevent Enter key from submitting the form except on the submit button
        if (e.key === 'Enter' && e.target !== e.currentTarget) {
          const target = e.target as HTMLElement;
          if (target.tagName !== 'TEXTAREA' && target.getAttribute('type') !== 'submit') {
            e.preventDefault();
          }
        }
      }} className="bg-white border-2 border-gray-200 rounded-xl p-8">
        {/* PASO 1: Información Básica */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark mb-6">Información Básica</h2>
            
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

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Logo de la Agencia (opcional)
              </label>
              <p className="text-sm text-dark/60 mb-3">
                Sube el logo de tu agencia. Formatos aceptados: JPG, PNG, WebP. Máximo 5MB.
              </p>
              
              {formData.logo_url ? (
                <div className="mb-4">
                  <div className="relative w-40 h-40 border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={formData.logo_url}
                      alt="Logo preview"
                      fill
                      className="object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-2">Logo subido exitosamente</p>
                </div>
              ) : (
                <div>
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
                    disabled={uploadingLogo || !formData.name}
                    className="w-full"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {uploadingLogo ? 'Subiendo logo...' : 'Seleccionar Logo'}
                  </Button>
                  
                  {!formData.name && (
                    <p className="text-xs text-orange-600 mt-2">
                      Primero ingresa el nombre de la agencia
                    </p>
                  )}
                </div>
              )}
              
              {logoError && (
                <p className="text-sm text-red-600 mt-2">{logoError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Descripción * (mínimo 50 caracteres)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los servicios y especialidad de tu agencia. ¿Qué te hace diferente?"
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
                  Este email será visible para clientes potenciales. Puede ser diferente a tu email personal.
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
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="vitria.cl o www.vitria.cl (https:// es opcional)"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none"
                  required
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
            </div>
          </div>
        )}

        {/* PASO 2: Servicios y Categoría */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Servicios y Especialidad</h2>
            
            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                ¿Qué categorías principales ofreces? * (selecciona todas las que apliquen)
              </label>
              <p className="text-sm text-dark/60 mb-4">
                Puedes seleccionar múltiples categorías si tu agencia ofrece varios servicios
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MAIN_CATEGORIES.map((category) => (
                  <label
                    key={category.id}
                    className={`flex flex-col gap-2 px-5 py-4 border-2 rounded-lg cursor-pointer transition ${
                      formData.categories.includes(category.id)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => setFormData({
                          ...formData,
                          categories: toggleArrayItem(formData.categories, category.id)
                        })}
                        className="w-5 h-5 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-base mb-1">{category.label}</div>
                        <div className={`text-xs ${formData.categories.includes(category.id) ? 'text-primary/80' : 'text-dark/60'}`}>
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-sm text-dark/60 mt-3">
                Categorías seleccionadas: {formData.categories.length}
              </p>
            </div>

            {/* Servicios específicos por categoría */}
            {formData.categories.length > 0 && (
              <div className="border-t-2 border-gray-200 pt-6">
                <label className="block text-sm font-semibold text-dark mb-3">
                  Servicios específicos (opcional)
                </label>
                <p className="text-sm text-dark/60 mb-4">
                  Marca los servicios específicos que ofreces dentro de tus categorías
                </p>
                
                <div className="space-y-6">
                  {MAIN_CATEGORIES.filter(cat => formData.categories.includes(cat.id)).map((category) => (
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
                              onChange={() => setFormData({
                                ...formData,
                                services: toggleArrayItem(formData.services, service)
                              })}
                              className="w-4 h-4"
                            />
                            <span>{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Especialidades Técnicas */}
            <div className="border-t-2 border-gray-200 pt-6">
              <label className="block text-sm font-semibold text-dark mb-3">
                Especialidades Técnicas (opcional)
              </label>
              <p className="text-sm text-dark/60 mb-4">
                Selecciona las plataformas, herramientas y tecnologías que dominas. Esto ayuda a los clientes a encontrarte más fácilmente.
              </p>
              
              <div className="space-y-6">
                {SPECIALTY_CATEGORIES.map((category) => (
                  <div key={category.id} className="bg-lilac/10 rounded-lg p-4">
                    <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                      <span className="text-primary">{category.label}</span>
                      <span className="text-xs text-dark/50 font-normal">
                        ({formData.specialties.filter(s => category.specialties.includes(s)).length} seleccionadas)
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.specialties.map((specialty) => (
                        <label
                          key={specialty}
                          className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-md cursor-pointer transition ${
                            formData.specialties.includes(specialty)
                              ? 'border-secondary bg-secondary/10 text-secondary font-medium'
                              : 'border-gray-200 bg-white hover:border-secondary/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.specialties.includes(specialty)}
                            onChange={() => setFormData({
                              ...formData,
                              specialties: toggleArrayItem(formData.specialties, specialty)
                            })}
                            className="w-4 h-4"
                          />
                          <span>{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {formData.specialties.length > 0 && (
                <div className="mt-4 p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                  <p className="text-sm text-dark font-medium">
                    ✓ {formData.specialties.length} especialidad{formData.specialties.length !== 1 ? 'es' : ''} seleccionada{formData.specialties.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialties.map((spec) => (
                      <span key={spec} className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASO 3: Detalles del Negocio */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark mb-6">Detalles del Negocio</h2>
            
            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Tamaño del Equipo *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {TEAM_SIZES.map((size) => (
                  <label
                    key={size.label}
                    className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.employeesMin === size.min && formData.employeesMax === size.max
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="teamSize"
                      checked={formData.employeesMin === size.min && formData.employeesMax === size.max}
                      onChange={() => {
                        setFormData({
                          ...formData,
                          employeesMin: size.min,
                          employeesMax: size.max
                        });
                        setValidationError('');
                      }}
                      className="w-4 h-4"
                    />
                    <span>{size.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Rango de Precios *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'Menos de 1M', label: 'Menos de 1M', desc: 'Presupuesto mínimo CLP' },
                  { value: '1-3M', label: '1-3 Millones', desc: 'Presupuesto mínimo CLP' },
                  { value: '3-5M', label: '3-5 Millones', desc: 'Presupuesto mínimo CLP' },
                  { value: '5M+', label: '5+ Millones', desc: 'Presupuesto mínimo CLP' },
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
                      onChange={() => {
                        setFormData({ ...formData, priceRange: price.value as any });
                        setValidationError('');
                      }}
                      className="sr-only"
                    />
                    <span className="text-lg font-bold mb-1">{price.value}</span>
                    <span className="font-semibold">{price.label}</span>
                    <span className="text-xs text-dark/60 mt-1">{price.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Industrias con las que trabajas (opcional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INDUSTRIES.map((industry) => (
                  <label
                    key={industry}
                    className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.industries.includes(industry)
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.industries.includes(industry)}
                      onChange={() => setFormData({
                        ...formData,
                        industries: toggleArrayItem(formData.industries, industry)
                      })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{industry}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {validationError && (
          <div className="bg-orange-50 border-2 border-orange-200 text-orange-700 px-4 py-3 rounded-lg mt-6">
            {validationError}
          </div>
        )}

        {createMutation.error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
            {createMutation.error.message}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
              Cancelar
            </Button>
            {currentStep < 3 ? (
              <Button type="button" variant="primary" onClick={nextStep}>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" loading={createMutation.isPending}>
                Crear Agencia
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
