'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { CheckCircle, XCircle, ChevronLeft, Building2, MapPin, Mail, Phone, Globe, AlertCircle, Edit } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function ReviewAgencyPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const agencyId = params.id as string;
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const { data: agency, isLoading, refetch } = trpc.admin.getAgency.useQuery(
    { agencyId },
    { enabled: userData?.role === 'admin' }
  );

  const approveMutation = trpc.admin.approveAgency.useMutation({
    onSuccess: () => {
      refetch();
      setTimeout(() => router.push('/admin/agencias'), 2000);
    },
  });

  const rejectMutation = trpc.admin.rejectAgency.useMutation({
    onSuccess: () => {
      refetch();
      setTimeout(() => router.push('/admin/agencias'), 2000);
    },
    onError: (err) => {
      setRejectError(err.message || 'Error al rechazar la agencia');
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

  const handleApprove = () => {
    if (confirm('¿Estás seguro de aprobar esta agencia?')) {
      approveMutation.mutate({ agencyId });
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setRejectError('Por favor ingresa una razón para el rechazo');
      return;
    }
    rejectMutation.mutate({ agencyId, reason: rejectReason });
    setShowRejectModal(false);
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

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">Agencia no encontrada</h1>
          <Button variant="primary" onClick={() => router.push('/admin/agencias')}>
            Volver al panel
          </Button>
        </div>
      </div>
    );
  }

  const isPending = agency.approval_status === 'pending';
  const isApproved = agency.approval_status === 'approved';
  const isRejected = agency.approval_status === 'rejected';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/agencias')}
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver al panel
          </button>
          <h1 className="text-4xl font-bold text-primary mb-2">Revisar Agencia</h1>
          <p className="text-dark/70">Revisa la información y decide si aprobar o rechazar</p>
        </div>

        {approveMutation.isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">¡Agencia aprobada!</p>
              <p className="text-sm text-green-700">El propietario recibirá un correo de confirmación.</p>
            </div>
          </div>
        )}

        {rejectMutation.isSuccess && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Agencia rechazada</p>
              <p className="text-sm text-red-700">El propietario recibirá un correo con la razón del rechazo.</p>
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Building2 className="w-12 h-12 text-primary" />
              <div>
                <h2 className="text-2xl font-bold text-dark">{agency.name}</h2>
                <p className="text-dark/60">{agency.slug}</p>
              </div>
            </div>
            <div>
              {isApproved && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Aprobada
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                  Pendiente
                </span>
              )}
              {isRejected && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                  <XCircle className="w-4 h-4" />
                  Rechazada
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-bold text-primary mb-3">Información de Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-dark">
                  <Mail className="w-4 h-4 text-dark/60" />
                  <span>{agency.email}</span>
                </div>
                <div className="flex items-center gap-2 text-dark">
                  <Phone className="w-4 h-4 text-dark/60" />
                  <span>{agency.phone}</span>
                </div>
                {agency.website && (
                  <div className="flex items-center gap-2 text-dark">
                    <Globe className="w-4 h-4 text-dark/60" />
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {agency.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-dark">
                  <MapPin className="w-4 h-4 text-dark/60" />
                  <span>{agency.location_city}, {agency.location_region}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-primary mb-3">Propietario</h3>
              <div className="space-y-2">
                <p className="text-dark">{agency.users?.full_name || 'N/A'}</p>
                <p className="text-sm text-dark/60">{agency.users?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-primary mb-3">Descripción</h3>
            <p className="text-dark whitespace-pre-wrap">{agency.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-primary mb-3">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                {agency.categories.map((category: string) => (
                  <span key={category} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary mb-3">Servicios</h3>
              <div className="flex flex-wrap gap-2">
                {agency.services.map((service: string) => (
                  <span key={service} className="px-3 py-1 bg-accent/10 text-dark text-sm rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {isRejected && agency.rejection_reason && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-bold text-red-900 mb-2">Razón del rechazo</h3>
              <p className="text-sm text-red-800">{agency.rejection_reason}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link href={`/admin/agencias/${agencyId}/editar`}>
            <Button variant="secondary" className="w-full">
              <Edit className="w-5 h-5 mr-2" />
              Editar Agencia
            </Button>
          </Link>

          {isPending && (
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                onClick={() => setShowRejectModal(true)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                <XCircle className="w-5 h-5 mr-2" />
                Rechazar Agencia
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {approveMutation.isPending ? 'Aprobando...' : 'Aprobar Agencia'}
              </Button>
            </div>
          )}
        </div>

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-dark mb-2">Rechazar agencia</h2>
                <p className="text-dark/70">
                  Por favor proporciona una razón para el rechazo. Esto será enviado al propietario.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark mb-2">
                  Razón del rechazo *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ej: La información proporcionada no cumple con los requisitos mínimos..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {rejectError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {rejectError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setRejectError('');
                  }}
                  disabled={rejectMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? 'Rechazando...' : 'Rechazar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
