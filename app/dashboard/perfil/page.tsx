'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MAIN_CATEGORIES } from '@/lib/categories';
import Link from 'next/link';

export default function ClientProfileEditPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const utils = trpc.useUtils();
  
  const [businessName, setBusinessName] = useState('');
  const [businessInstagram, setBusinessInstagram] = useState('');
  const [budgetRange, setBudgetRange] = useState<'$' | '$$' | '$$$' | ''>('');
  const [desiredCategories, setDesiredCategories] = useState<string[]>([]);
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: existingProfile, isLoading: profileLoading } = trpc.client.getMyProfile.useQuery();
  const createProfileMutation = trpc.client.createProfile.useMutation();
  const updateProfileMutation = trpc.client.updateProfile.useMutation();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (existingProfile) {
      setBusinessName(existingProfile.business_name || '');
      setBusinessInstagram(existingProfile.business_instagram || '');
      setBudgetRange(existingProfile.budget_range as '$' | '$$' | '$$$');
      setDesiredCategories(existingProfile.desired_categories || []);
      setAboutBusiness(existingProfile.about_business || '');
    } else {
      setIsEditing(true);
    }
  }, [existingProfile]);

  const resetFormToProfile = (profile: typeof existingProfile) => {
    if (profile) {
      setBusinessName(profile.business_name || '');
      setBusinessInstagram(profile.business_instagram || '');
      setBudgetRange(profile.budget_range as '$' | '$$' | '$$$');
      setDesiredCategories(profile.desired_categories || []);
      setAboutBusiness(profile.about_business || '');
    }
  };

  const handleCancel = () => {
    resetFormToProfile(existingProfile);
    setError('');
    setSuccessMessage('');
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!budgetRange) {
      setError('Selecciona un rango de presupuesto');
      return;
    }

    if (desiredCategories.length === 0) {
      setError('Selecciona al menos una categoría');
      return;
    }

    setSubmitting(true);

    try {
      const profileData = {
        businessName,
        businessInstagram: businessInstagram || undefined,
        budgetRange,
        desiredCategories,
        aboutBusiness: aboutBusiness || undefined,
      };

      if (existingProfile) {
        await updateProfileMutation.mutateAsync(profileData);
        setSuccessMessage('Perfil actualizado correctamente');
      } else {
        await createProfileMutation.mutateAsync(profileData);
        setSuccessMessage('Perfil creado correctamente');
      }

      await utils.client.getMyProfile.invalidate();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setDesiredCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-dark/70">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (userData?.role !== 'user') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
          Esta página es solo para clientes. Las agencias pueden gestionar su perfil desde el dashboard.
        </div>
        <Link href="/dashboard" className="inline-block mt-4">
          <Button variant="secondary">Volver al Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            {existingProfile ? 'Mi Perfil de Cliente' : 'Completar Perfil'}
          </h1>
          <p className="text-dark/70">
            {existingProfile 
              ? 'Gestiona la información de tu negocio'
              : 'Cuéntanos sobre tu negocio para recomendarte las mejores agencias'
            }
          </p>
        </div>
        {existingProfile && !isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {existingProfile && !isEditing ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-dark/60 mb-1">Nombre del Negocio</h3>
              <p className="text-lg">{businessName}</p>
            </div>

            {businessInstagram && (
              <div>
                <h3 className="text-sm font-semibold text-dark/60 mb-1">Instagram</h3>
                <p className="text-lg">{businessInstagram}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-dark/60 mb-1">Presupuesto</h3>
              <p className="text-lg">{budgetRange}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-dark/60 mb-1">Servicios de Interés</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {desiredCategories.map(catId => {
                  const category = MAIN_CATEGORIES.find(c => c.id === catId);
                  return category ? (
                    <span key={catId} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                      {category.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {aboutBusiness && (
              <div>
                <h3 className="text-sm font-semibold text-dark/60 mb-1">Sobre tu Proyecto</h3>
                <p className="text-dark/80">{aboutBusiness}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <Link href="/dashboard">
                <Button variant="secondary">Volver al Dashboard</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Nombre de tu Negocio/Empresa *
              </label>
              <Input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej: Café Central, TechStartup Chile"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Instagram de tu Negocio (opcional)
              </label>
              <Input
                type="text"
                value={businessInstagram}
                onChange={(e) => setBusinessInstagram(e.target.value)}
                placeholder="@tunegocio"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                ¿Cuánto quieres invertir? *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['$', '$$', '$$$'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setBudgetRange(range)}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      budgetRange === range
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{range}</div>
                    <div className="text-xs">
                      {range === '$' && 'Menos de $1M CLP'}
                      {range === '$$' && '$1M a $3M CLP'}
                      {range === '$$$' && '$3M a $5M CLP'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                ¿Qué tipo de servicio buscas? * (selecciona todos los que apliquen)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {MAIN_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`p-3 border-2 rounded-lg text-left transition ${
                      desiredCategories.includes(category.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-semibold text-sm ${
                      desiredCategories.includes(category.id) ? 'text-primary' : 'text-dark'
                    }`}>
                      {category.label}
                    </div>
                    <div className="text-xs text-dark/60 mt-1">{category.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Cuéntanos un poco sobre tu proyecto (opcional)
              </label>
              <textarea
                value={aboutBusiness}
                onChange={(e) => setAboutBusiness(e.target.value)}
                placeholder="Ej: Buscamos una agencia para rediseñar nuestra imagen de marca..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition resize-none"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                {submitting ? 'Guardando...' : existingProfile ? 'Guardar Cambios' : 'Completar Perfil'}
              </Button>
              {existingProfile && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
