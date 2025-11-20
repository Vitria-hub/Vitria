'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/useAuth';
import { useFormValidation, validations } from '@/hooks/useFormValidation';
import Button from './Button';
import { X, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

interface QuoteRequestModalProps {
  agencyId: string;
  agencyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteRequestModal({
  agencyId,
  agencyName,
  isOpen,
  onClose,
}: QuoteRequestModalProps) {
  const router = useRouter();
  const { user, userData } = useAuth();
  const toast = useToast();
  
  const { validateAll, getFieldError } = useFormValidation({
    clientName: [validations.required(), validations.minLength(2)],
    clientEmail: [validations.required(), validations.email()],
    projectName: [validations.required(), validations.minLength(3)],
    projectDescription: [validations.required(), validations.minLength(10)],
  });
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientWhatsApp, setClientWhatsApp] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user && userData) {
      setClientName(userData.full_name || '');
      setClientEmail(user.email || '');
    }
  }, [user, userData]);

  const submitQuoteMutation = trpc.quotes.submitQuote.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      toast.success('Cotización enviada exitosamente');
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        resetForm();
      }, 4000);
    },
    onError: (error) => {
      console.error('Error submitting quote:', error);
      toast.error(error.message || 'Error al enviar la cotización');
    },
  });

  const resetForm = () => {
    if (user && userData) {
      setClientName(userData.full_name || '');
      setClientEmail(user.email || '');
    } else {
      setClientName('');
      setClientEmail('');
    }
    setClientWhatsApp('');
    setProjectName('');
    setProjectDescription('');
    setBudgetRange('');
    setServiceCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const isValid = validateAll({
      clientName,
      clientEmail,
      projectName,
      projectDescription,
    });

    if (!isValid) {
      toast.error('Por favor completa todos los campos obligatorios correctamente');
      return;
    }

    submitQuoteMutation.mutate({
      agencyId,
      clientName,
      clientEmail,
      clientPhone: clientWhatsApp || undefined,
      projectName,
      projectDescription,
      budgetRange: budgetRange || undefined,
      serviceCategory: serviceCategory || undefined,
      clientUserId: userData?.id,
    });
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">¡Solicitud Enviada!</h3>
            <p className="text-dark/70 mb-4">
              Tu solicitud de cotización fue enviada a <strong>{agencyName}</strong>.
            </p>
            <p className="text-sm text-dark/60">
              Recibirás una copia de confirmación en tu email y la agencia te contactará en 24-48 horas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">Solicitar Cotización</h3>
            <p className="text-sm text-dark/60 mt-1">
              Envía una solicitud de cotización a {agencyName}
            </p>
          </div>
          <button onClick={onClose} className="text-dark/60 hover:text-dark">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-dark/70">
              <strong>💡 Consejo:</strong> Proporciona la mayor información posible para que la agencia pueda entender tu proyecto y enviarte una cotización precisa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Tu Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                required
                minLength={2}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="juan@ejemplo.cl"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                WhatsApp (opcional)
              </label>
              <input
                type="tel"
                value={clientWhatsApp}
                onChange={(e) => setClientWhatsApp(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Presupuesto Estimado (opcional)
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Selecciona un rango</option>
                <option value="Menos de 1M">Menos de 1M CLP</option>
                <option value="1-3M">1M - 3M CLP</option>
                <option value="3-5M">3M - 5M CLP</option>
                <option value="5M+">5M+ CLP</option>
                <option value="Por definir">Por definir</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Nombre del Proyecto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ej: Campaña de lanzamiento producto X"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Categoría del Servicio (opcional)
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Performance & Ads">Performance & Ads</option>
              <option value="Social Media">Social Media</option>
              <option value="Diseño y Branding">Diseño y Branding</option>
              <option value="Desarrollo Web">Desarrollo Web</option>
              <option value="Producción de Contenido">Producción de Contenido</option>
              <option value="Relaciones Públicas">Relaciones Públicas</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Descripción del Proyecto <span className="text-red-500">*</span>
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe tu proyecto, objetivos, audiencia objetivo, y cualquier otra información relevante..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
              required
              minLength={10}
              maxLength={1000}
            />
            <p className="text-xs text-dark/50 mt-1">
              {projectDescription.length}/1000 caracteres
            </p>
          </div>

          {submitQuoteMutation.error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Error al enviar solicitud
                </p>
                <p className="text-sm text-red-700">
                  {submitQuoteMutation.error.message || 'No se pudo enviar tu solicitud de cotización. Por favor verifica los datos e intenta nuevamente.'}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={submitQuoteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              loading={submitQuoteMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
