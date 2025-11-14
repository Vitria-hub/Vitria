'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Button from '@/components/Button';

export default function ApproveAgencyPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const agencyId = params.id as string;
  const [error, setError] = useState<string | null>(null);

  const approveMutation = trpc.admin.approveAgency.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        router.push('/admin/agencias');
      }, 3000);
    },
    onError: (err) => {
      setError(err.message || 'Error al aprobar la agencia');
    },
  });

  useEffect(() => {
    if (!authLoading) {
      if (!userData || userData.role !== 'admin') {
        router.push('/');
        return;
      }

      if (!approveMutation.isSuccess && !approveMutation.isError && !approveMutation.isPending) {
        approveMutation.mutate({ agencyId });
      }
    }
  }, [userData, authLoading, agencyId, router]);

  if (authLoading || !userData || userData.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {approveMutation.isPending && (
          <>
            <Loader className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-dark mb-2">Aprobando agencia...</h1>
            <p className="text-dark/70">Por favor espera un momento</p>
          </>
        )}

        {approveMutation.isSuccess && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-dark mb-2">¡Agencia aprobada!</h1>
            <p className="text-dark/70 mb-6">
              La agencia ha sido aprobada exitosamente. El propietario recibirá un correo de confirmación.
            </p>
            <p className="text-sm text-dark/60">
              Redirigiendo al panel de administración...
            </p>
          </>
        )}

        {error && (
          <>
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-dark mb-2">Error al aprobar</h1>
            <p className="text-dark/70 mb-6">{error}</p>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/agencias')}
            >
              Volver al panel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
