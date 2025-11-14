'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { XCircle, AlertCircle, Loader } from 'lucide-react';
import Button from '@/components/Button';

export default function RejectAgencyPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const agencyId = params.id as string;
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rejectMutation = trpc.admin.rejectAgency.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        router.push('/admin/agencias');
      }, 3000);
    },
    onError: (err) => {
      setError(err.message || 'Error al rechazar la agencia');
    },
  });

  useEffect(() => {
    if (!authLoading && (!userData || userData.role !== 'admin')) {
      router.push('/');
    }
  }, [userData, authLoading, router]);

  if (authLoading || !userData || userData.role !== 'admin') {
    return null;
  }

  const handleReject = () => {
    if (!reason.trim()) {
      setError('Por favor ingresa una razón para el rechazo');
      return;
    }
    setShowForm(false);
    rejectMutation.mutate({ agencyId, reason });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {showForm && !rejectMutation.isSuccess && (
          <>
            <div className="text-center mb-6">
              <XCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-dark mb-2">Rechazar agencia</h1>
              <p className="text-dark/70">
                Por favor proporciona una razón para el rechazo. Esto será enviado al propietario de la agencia.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">
                Razón del rechazo *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: La información proporcionada no cumple con los requisitos mínimos..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {error && !rejectMutation.isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => router.push('/admin/agencias')}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleReject}
              >
                Rechazar agencia
              </Button>
            </div>
          </>
        )}

        {rejectMutation.isPending && (
          <div className="text-center">
            <Loader className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-dark mb-2">Rechazando agencia...</h1>
            <p className="text-dark/70">Por favor espera un momento</p>
          </div>
        )}

        {rejectMutation.isSuccess && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-dark mb-2">Agencia rechazada</h1>
            <p className="text-dark/70 mb-6">
              La agencia ha sido rechazada. El propietario recibirá un correo con la razón del rechazo.
            </p>
            <p className="text-sm text-dark/60">
              Redirigiendo al panel de administración...
            </p>
          </div>
        )}

        {rejectMutation.isError && error && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-dark mb-2">Error al rechazar</h1>
            <p className="text-dark/70 mb-6">{error}</p>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/agencias')}
            >
              Volver al panel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
