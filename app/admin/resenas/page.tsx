'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const { data, isLoading, refetch } = trpc.admin.listReviews.useQuery(
    { page, limit: 20, status: statusFilter },
    { enabled: userData?.role === 'admin' }
  );

  const updateStatusMutation = trpc.admin.updateReviewStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = trpc.admin.deleteReview.useMutation({
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

  const handleApprove = (reviewId: string) => {
    updateStatusMutation.mutate({ reviewId, status: 'approved' });
  };

  const handleReject = (reviewId: string) => {
    updateStatusMutation.mutate({ reviewId, status: 'rejected' });
  };

  const handleDelete = (reviewId: string) => {
    if (confirm('¿Estás seguro de eliminar esta reseña? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate({ reviewId });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            <CheckCircle className="w-4 h-4" />
            Aprobada
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            <XCircle className="w-4 h-4" />
            Rechazada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            Pendiente
          </span>
        );
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
          <h1 className="text-4xl font-bold text-primary mb-2">Gestionar Reseñas</h1>
          <p className="text-dark/70">Moderar y aprobar reseñas del marketplace</p>
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
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-dark/60">Cargando reseñas...</p>
          </div>
        ) : data && data.reviews.length > 0 ? (
          <>
            <div className="space-y-4">
              {data.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/agencias/${review.agencies?.slug}`}
                          className="font-bold text-primary hover:underline"
                        >
                          {review.agencies?.name || 'Agencia eliminada'}
                        </Link>
                        {getStatusBadge(review.status)}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating
                                  ? 'fill-accent text-accent'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-dark/60">
                          {new Date(review.created_at).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-dark/80 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-100">
                    {review.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
                        disabled={updateStatusMutation.isLoading}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                        disabled={updateStatusMutation.isLoading}
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold ml-auto"
                      disabled={deleteMutation.isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
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
            <Star className="w-16 h-16 text-dark/30 mx-auto mb-4" />
            <p className="text-dark/60">No se encontraron reseñas</p>
          </div>
        )}
      </div>
    </div>
  );
}
