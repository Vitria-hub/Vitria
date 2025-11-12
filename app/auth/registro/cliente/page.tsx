'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MAIN_CATEGORIES } from '@/lib/categories';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ClientRegisterPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [businessName, setBusinessName] = useState('');
  const [businessInstagram, setBusinessInstagram] = useState('');
  const [budgetRange, setBudgetRange] = useState<'$' | '$$' | '$$$' | ''>('');
  const [desiredCategories, setDesiredCategories] = useState<string[]>([]);
  const [aboutBusiness, setAboutBusiness] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createProfileMutation = trpc.client.createProfile.useMutation();

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
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

    setLoading(true);

    try {
      await signUp(email, password, fullName, 'user');
      
      await createProfileMutation.mutateAsync({
        businessName,
        businessInstagram: businessInstagram || undefined,
        budgetRange,
        desiredCategories,
        aboutBusiness: aboutBusiness || undefined,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setDesiredCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Registro de Cliente</h1>
          <p className="text-dark/70">
            {step === 1 ? 'Paso 1: Crea tu cuenta' : 'Paso 2: Cuéntanos sobre tu negocio'}
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <div className={`h-1 w-20 rounded ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`h-1 w-20 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Nombre Completo *
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Contraseña *
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Confirmar Contraseña *
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Link href="/auth/registro" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Button>
                </Link>
                <Button type="submit" variant="primary" className="flex-1">
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
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
                        {range === '$' && 'Hasta $1M CLP'}
                        {range === '$$' && '$1M - $5M CLP'}
                        {range === '$$$' && 'Más de $5M CLP'}
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
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-dark/60">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
