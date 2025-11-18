'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight, Building2, Crown, Eye, Clock, Ban, Star, Pencil } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function AdminAgenciesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [premiumModal, setPremiumModal] = useState<{ agencyId: string; currentStatus: boolean } | null>(null);
  const [durationDays, setDurationDays] = useState(30);
  const [detailModal, setDetailModal] = useState<any>(null);
  const [rejectModal, setRejectModal] = useState<{ agencyId: string; agencyName: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [sponsorModal, setSponsorModal] = useState<{ agencyId: string; agencyName: string } | null>(null);
  const [sponsorDays, setSponsorDays] = useState(30);
  const [sponsorPosition, setSponsorPosition] = useState(1);

  const { data, isLoading, refetch } = trpc.admin.listAgencies.useQuery({ page, limit: 20, status: statusFilter });

  const approveMutation = trpc.admin.approveAgency.useMutation({
    onSuccess: () => {
      refetch();
      setDetailModal(null);
    },
  });

  const rejectMutation = trpc.admin.rejectAgency.useMutation({
    onSuccess: () => {
      refetch();
      setRejectModal(null);
      setRejectionReason('');
    },
  });

  const deleteMutation = trpc.admin.deleteAgency.useMutation({
    onSuccess: () => refetch(),
  });

  const premiumMutation = trpc.admin.setPremium.useMutation({
    onSuccess: () => {
      refetch();
      setPremiumModal(null);
    },
  });

  const addSponsorMutation = trpc.admin.addSponsoredSlot.useMutation({
    onSuccess: () => {
      alert('¡Agencia destacada exitosamente!');
      setSponsorModal(null);
      refetch();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleApprove = (agencyId: string) => {
    if (confirm('¿Aprobar esta agencia? Se enviará un email de confirmación al dueño.')) {
      approveMutation.mutate({ agencyId });
    }
  };

  const handleRejectConfirm = () => {
    if (rejectModal && rejectionReason.trim().length >= 10) {
      rejectMutation.mutate({
        agencyId: rejectModal.agencyId,
        rejectionReason: rejectionReason.trim(),
      });
    }
  };

  const handleDelete = (agencyId: string) => {
    if (confirm('¿Estás seguro de eliminar esta agencia? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate({ agencyId });
    }
  };

  const handlePremiumToggle = (agencyId: string, currentStatus: boolean) => {
    if (currentStatus) {
      if (confirm('¿Desactivar premium para esta agencia?')) {
        premiumMutation.mutate({ agencyId, isPremium: false });
      }
    } else {
      setPremiumModal({ agencyId, currentStatus });
    }
  };

  const handlePremiumConfirm = () => {
    if (premiumModal) {
      premiumMutation.mutate({
        agencyId: premiumModal.agencyId,
        isPremium: true,
        durationDays,
      });
    }
  };

  const handleSponsorConfirm = () => {
    if (sponsorModal) {
      addSponsorMutation.mutate({
        agencyId: sponsorModal.agencyId,
        position: sponsorPosition,
        durationDays: sponsorDays,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver al panel
          </Link>
          <h1 className="text-4xl font-bold text-primary mb-2">Gestionar Agencias</h1>
          <p className="text-dark/70">Aprobar, rechazar o eliminar agencias del marketplace</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-dark">Filtrar por estado:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes de aprobación</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-dark/60">Cargando agencias...</p>
          </div>
        ) : data && data.agencies.length > 0 ? (
          <>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Agencia</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Dueño</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Ubicación</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Premium</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-dark">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.agencies.map((agency: any) => (
                      <tr key={agency.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-primary" />
                            <div>
                              <div className="font-semibold text-dark">{agency.name}</div>
                              <div className="text-sm text-dark/60">{agency.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-dark">{agency.users?.full_name || 'N/A'}</div>
                          <div className="text-xs text-dark/60">{agency.users?.role || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-dark">
                          {agency.location_city}, {agency.location_region}
                        </td>
                        <td className="px-6 py-4">
                          {agency.approval_status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              <CheckCircle className="w-4 h-4" />
                              Aprobada
                            </span>
                          ) : agency.approval_status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                              <Ban className="w-4 h-4" />
                              Rechazada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                              <Clock className="w-4 h-4" />
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {agency.is_premium ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full mb-1">
                                <Crown className="w-4 h-4" />
                                Premium
                              </span>
                              {agency.premium_until && (
                                <div className="text-xs text-dark/60">
                                  Hasta: {new Date(agency.premium_until).toLocaleDateString('es-CL')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-dark/60">Básico</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetailModal(agency)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition"
                              title="Ver detalles"
                            >
                              <Eye className="w-5 h-5 text-blue-600" />
                            </button>
                            <Link
                              href={`/admin/agencias/${agency.id}/editar`}
                              className="p-2 hover:bg-primary/10 rounded-lg transition"
                              title="Editar agencia"
                            >
                              <Pencil className="w-5 h-5 text-primary" />
                            </Link>
                            {agency.approval_status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(agency.id)}
                                  className="p-2 hover:bg-green-50 rounded-lg transition"
                                  title="Aprobar"
                                  disabled={approveMutation.isPending}
                                >
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                </button>
                                <button
                                  onClick={() => setRejectModal({ agencyId: agency.id, agencyName: agency.name })}
                                  className="p-2 hover:bg-red-50 rounded-lg transition"
                                  title="Rechazar"
                                >
                                  <XCircle className="w-5 h-5 text-red-600" />
                                </button>
                              </>
                            )}
                            {agency.approval_status === 'approved' && (
                              <button
                                onClick={() => setSponsorModal({ agencyId: agency.id, agencyName: agency.name })}
                                className="p-2 hover:bg-purple-50 rounded-lg transition"
                                title="Destacar agencia en homepage"
                              >
                                <Star className="w-5 h-5 text-purple-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handlePremiumToggle(agency.id, agency.is_premium)}
                              className={`p-2 rounded-lg transition ${
                                agency.is_premium 
                                  ? 'hover:bg-orange-50' 
                                  : 'hover:bg-yellow-50'
                              }`}
                              title={agency.is_premium ? 'Desactivar Premium' : 'Activar Premium'}
                            >
                              <Crown className={`w-5 h-5 ${agency.is_premium ? 'text-orange-600' : 'text-gray-400'}`} />
                            </button>
                            <button
                              onClick={() => handleDelete(agency.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-md border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-dark font-semibold">
                  Página {page} de {data.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.totalPages}
                  className="p-2 rounded-md border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-xl">
            <Building2 className="w-16 h-16 text-dark/30 mx-auto mb-4" />
            <p className="text-dark/60">No se encontraron agencias</p>
          </div>
        )}

        {detailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">{detailModal.name}</h2>
                  <p className="text-sm text-dark/60">{detailModal.slug}</p>
                </div>
                <button
                  onClick={() => setDetailModal(null)}
                  className="text-dark/60 hover:text-dark"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-dark/70">Dueño</label>
                    <p className="text-dark">{detailModal.users?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-dark/70">Email</label>
                    <p className="text-dark">{detailModal.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-dark/70">Teléfono</label>
                    <p className="text-dark">{detailModal.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-dark/70">Ubicación</label>
                    <p className="text-dark">{detailModal.location_city}, {detailModal.location_region}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-dark/70">Sitio web</label>
                    <p className="text-dark">{detailModal.website || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-dark/70">Estado</label>
                    <p className="text-dark capitalize">{detailModal.approval_status}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-dark/70">Descripción</label>
                  <p className="text-dark">{detailModal.description || 'Sin descripción'}</p>
                </div>

                {detailModal.services && detailModal.services.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-dark/70">Servicios</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {detailModal.services.map((service: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {detailModal.rejection_reason && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <label className="text-sm font-semibold text-red-800">Razón de rechazo</label>
                    <p className="text-red-900">{detailModal.rejection_reason}</p>
                  </div>
                )}
              </div>

              {detailModal.approval_status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setRejectModal({ agencyId: detailModal.id, agencyName: detailModal.name })}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleApprove(detailModal.id)}
                    loading={approveMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {rejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-2xl font-bold text-primary">Rechazar Agencia</h2>
              </div>

              <p className="text-dark/70 mb-4">
                ¿Estás seguro de rechazar <strong>{rejectModal.agencyName}</strong>?
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark mb-2">
                  Razón del rechazo <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explica por qué se rechaza esta agencia (mínimo 10 caracteres)..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                  rows={4}
                />
                {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                  <p className="text-sm text-red-600 mt-1">
                    La razón debe tener al menos 10 caracteres ({rejectionReason.length}/10)
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setRejectModal(null);
                    setRejectionReason('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleRejectConfirm}
                  disabled={rejectionReason.trim().length < 10 || rejectMutation.isPending}
                  loading={rejectMutation.isPending}
                >
                  Rechazar Agencia
                </Button>
              </div>
            </div>
          </div>
        )}

        {sponsorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-primary">Destacar Agencia</h2>
              </div>
              
              <p className="text-dark/70 mb-6">
                La agencia <strong>{sponsorModal.agencyName}</strong> aparecerá en el carrusel de agencias destacadas en la homepage.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Posición en el carrusel:
                  </label>
                  <select
                    value={sponsorPosition}
                    onChange={(e) => setSponsorPosition(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  >
                    {[1, 2, 3, 4, 5].map((pos) => (
                      <option key={pos} value={pos}>
                        Posición {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Duración (días):
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                      onClick={() => setSponsorDays(7)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition ${
                        sponsorDays === 7 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      7 días
                    </button>
                    <button
                      onClick={() => setSponsorDays(15)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition ${
                        sponsorDays === 15 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      15 días
                    </button>
                    <button
                      onClick={() => setSponsorDays(30)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition ${
                        sponsorDays === 30 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      30 días
                    </button>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={sponsorDays}
                    onChange={(e) => setSponsorDays(parseInt(e.target.value) || 7)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="O ingresa días personalizados..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setSponsorModal(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSponsorConfirm}
                  disabled={addSponsorMutation.isPending}
                >
                  {addSponsorMutation.isPending ? 'Destacando...' : 'Destacar Agencia'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {premiumModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-primary">Activar Premium</h2>
              </div>
              
              <p className="text-dark/70 mb-6">
                Selecciona la duración del acceso premium para esta agencia:
              </p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setDurationDays(30)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    durationDays === 30 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold text-dark">30 días (1 mes)</div>
                  <div className="text-sm text-dark/60">Ideal para pruebas o campañas cortas</div>
                </button>

                <button
                  onClick={() => setDurationDays(90)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    durationDays === 90 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold text-dark">90 días (3 meses)</div>
                  <div className="text-sm text-dark/60">Perfecto para trimestre</div>
                </button>

                <button
                  onClick={() => setDurationDays(365)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    durationDays === 365 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold text-dark">365 días (1 año)</div>
                  <div className="text-sm text-dark/60">Máximo valor por inversión</div>
                </button>

                <div className="p-4 rounded-lg border-2 border-gray-200">
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Duración personalizada (días):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value) || 30)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setPremiumModal(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handlePremiumConfirm}
                  disabled={premiumMutation.isPending}
                >
                  {premiumMutation.isPending ? 'Activando...' : 'Activar Premium'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
