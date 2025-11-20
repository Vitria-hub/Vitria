'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { getCurrentUser } from '@/lib/auth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MAIN_CATEGORIES } from '@/lib/categories';

export default function ClientProfilePage() {
  const [businessName, setBusinessName] = useState('');
  const [businessInstagram, setBusinessInstagram] = useState('');
  const [budgetRange, setBudgetRange] = useState<'Menos de 1M' | '1-3M' | '3-5M' | '5M+' | ''>('');
  const [desiredCategories, setDesiredCategories] = useState<string[]>([]);
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const createProfileMutation = trpc.clientProfile.createProfile.useMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      await createProfileMutation.mutateAsync({
        businessName,
        businessInstagram: businessInstagram || undefined,
        budgetRange,
        desiredCategories,
        aboutBusiness: aboutBusiness || undefined,
      });

      router.push('/dashboard/perfil');
    } catch (err: any) {
      setError(err.message || 'Error al crear el perfil');
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

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-dark/70">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Completa tu Perfil</h1>
          <p className="text-dark/70">
            Cuéntanos sobre tu negocio para recomendarte las mejores agencias
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['Menos de 1M', '1-3M', '3-5M', '5M+'] as const).map((range) => (
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
                    <div className="text-lg font-bold mb-1">{range}</div>
                    <div className="text-xs">Millones CLP</div>
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

            <Button type="submit" variant="primary" className="w-full" loading={submitting}>
              Completar Perfil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
