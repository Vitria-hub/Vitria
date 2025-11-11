'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function AdminAgenciesPage() {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  const { data, isLoading, refetch } = trpc.admin.listAgencies.useQuery(
    { page, limit: 20, status: statusFilter },
    { enabled: userData?.role === 'admin' }
  );

  const verifyMutation = trpc.admin.verifyAgency.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = trpc.admin.deleteAgency.useMutation({
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    if (!loading && (!userData || userData.role !== 'admin')) {
      router.push('/');
    }
  }, [userData, loading, router]);

  if (loading || !userData || userData.role !== 'admin') {
    return null;
  }

  const handleVerify = (agencyId: string, verified: boolean) => {
    if (confirm(`¿${verified ? 'Verificar' : 'Desverificar'} esta agencia?`)) {
      verifyMutation.mutate({ agencyId, verified });
    }
  };

  const handleDelete = (agencyId: string) => {
    if (confirm('¿Estás seguro de eliminar esta agencia? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate({ agencyId });
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
          <p className="text-dark/70">Aprobar, verificar o eliminar agencias del marketplace</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-dark">Filtrar por:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">Todas</option>
              <option value="verified">Verificadas</option>
              <option value="unverified">Sin verificar</option>
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
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Acciones</th>
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
                          {agency.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              <CheckCircle className="w-4 h-4" />
                              Verificada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                              Sin verificar
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVerify(agency.id, !agency.is_verified)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                              title={agency.is_verified ? 'Desverificar' : 'Verificar'}
                            >
                              {agency.is_verified ? (
                                <XCircle className="w-5 h-5 text-gray-600" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
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
      </div>
    </div>
  );
}
