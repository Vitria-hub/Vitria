'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/useAuth';
import Button from './Button';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactAgencyModalProps {
  agencyId: string;
  agencyName: string;
  agencyEmail?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactAgencyModal({
  agencyId,
  agencyName,
  agencyEmail,
  isOpen,
  onClose,
}: ContactAgencyModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'website' | 'form'>('email');
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: clientProfile } = trpc.clientProfile.getMyProfile.useQuery(undefined, {
    enabled: !!user,
  });

  const createContactMutation = trpc.contact.create.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setMessage('');
      }, 3000);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!clientProfile) {
      router.push('/auth/registro/cliente');
      return;
    }

    createContactMutation.mutate({
      agencyId,
      contactMethod,
      message: message || undefined,
    });
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-primary">Inicia Sesión</h3>
            <button onClick={onClose} className="text-dark/60 hover:text-dark">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-dark/80 mb-2">
                Para contactar a <strong>{agencyName}</strong>, necesitas tener una cuenta.
              </p>
              <p className="text-sm text-dark/60">
                Esto nos permite darte un mejor servicio y a las agencias conocer tu proyecto.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/auth/login')}
              variant="primary"
              className="flex-1"
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => router.push('/auth/registro')}
              variant="accent"
              className="flex-1"
            >
              Crear Cuenta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!clientProfile) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-primary">Completa tu Perfil</h3>
            <button onClick={onClose} className="text-dark/60 hover:text-dark">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-dark/80 mb-2">
                Para contactar agencias, primero completa tu perfil de cliente.
              </p>
              <p className="text-sm text-dark/60">
                Cuéntanos sobre tu negocio y qué servicios buscas.
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push('/auth/registro/cliente')}
            variant="accent"
            className="w-full"
          >
            Completar Perfil
          </Button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">¡Mensaje Enviado!</h3>
            <p className="text-dark/70">
              {agencyName} recibirá tu información de contacto y se comunicará contigo pronto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">Contactar {agencyName}</h3>
            <p className="text-sm text-dark/60 mt-1">
              Tu información será compartida con la agencia
            </p>
          </div>
          <button onClick={onClose} className="text-dark/60 hover:text-dark">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-lilac/10 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark/60">Negocio:</span>
              <span className="font-semibold text-dark">{clientProfile.business_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark/60">Presupuesto:</span>
              <span className="font-semibold text-dark">{clientProfile.budget_range}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark/60">Buscas:</span>
              <span className="font-semibold text-dark text-right max-w-[200px]">
                {clientProfile.desired_categories?.join(', ')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              ¿Cómo prefieres que te contacten?
            </label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              required
            >
              <option value="email">Email</option>
              <option value="phone">Teléfono</option>
              <option value="form">Formulario de Contacto</option>
              <option value="website">Sitio Web</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Mensaje (opcional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntale a la agencia más detalles sobre tu proyecto..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {createContactMutation.error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                {createContactMutation.error.message}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={createContactMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              loading={createContactMutation.isPending}
            >
              Enviar Contacto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
