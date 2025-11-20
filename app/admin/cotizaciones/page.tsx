'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/contexts/ConfirmContext';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Trophy, 
  XCircle, 
  TrendingUp,
  Mail,
  Phone,
  User,
  Building2,
  ChevronDown,
} from 'lucide-react';

export default function AdminQuotesPage() {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'won' | 'lost'>('all');
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  const { data: stats } = trpc.quotes.getQuoteStats.useQuery(undefined, {
    enabled: userData?.role === 'admin',
  });

  const { data: quotes, refetch } = trpc.quotes.getAllQuotes.useQuery(
    { status: statusFilter, limit: 100 },
    { enabled: userData?.role === 'admin' }
  );

  const updateStatusMutation = trpc.quotes.updateQuoteStatus.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Estado actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-dark/60">Cargando...</p>
      </div>
    );
  }

  if (userData?.role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleStatusChange = async (quoteId: string, newStatus: 'pending' | 'contacted' | 'won' | 'lost') => {
    const confirmed = await confirm({
      title: '¿Cambiar estado de cotización?',
      message: `El estado cambiará a "${getStatusLabel(newStatus)}".`,
      confirmText: 'Cambiar',
      cancelText: 'Cancelar',
      variant: 'info',
    });

    if (confirmed) {
      updateStatusMutation.mutate({
        quoteId,
        status: newStatus,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'contacted':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'won':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'lost':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'contacted':
        return 'Contactado';
      case 'won':
        return 'Ganado';
      case 'lost':
        return 'Perdido';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark mb-2">📋 Cotizaciones</h1>
        <p className="text-dark/60">
          Trackea todas las solicitudes de cotización y el valor que Vitria genera
        </p>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-dark">{stats.totalQuotes}</div>
            <div className="text-sm text-dark/60">Total Cotizaciones</div>
          </div>

          <div className="bg-white border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingQuotes}</div>
            <div className="text-sm text-dark/60">Pendientes</div>
          </div>

          <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.contactedQuotes}</div>
            <div className="text-sm text-dark/60">Contactados</div>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.wonQuotes}</div>
            <div className="text-sm text-dark/60">Ganados</div>
          </div>

          <div className="bg-white border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.lostQuotes}</div>
            <div className="text-sm text-dark/60">Perdidos</div>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.conversionRate}%</div>
            <div className="text-sm text-dark/60">Tasa Conversión</div>
          </div>
        </div>
      )}

      {/* Top Agencies */}
      {stats && stats.topAgencies.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-4">🏆 Top Agencias por Cotizaciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topAgencies.map((agency, index) => (
              <div
                key={agency.slug}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                <div className="flex-1">
                  <div className="font-bold text-dark">{agency.name}</div>
                  <div className="text-sm text-dark/60">{agency.count} cotizaciones</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-dark">Filtrar por estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="contacted">Contactados</option>
            <option value="won">Ganados</option>
            <option value="lost">Perdidos</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-dark mb-6">
          📝 Todas las Cotizaciones ({quotes?.length || 0})
        </h2>

        {quotes && quotes.length > 0 ? (
          <div className="space-y-4">
            {quotes.map((quote: any) => (
              <div
                key={quote.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-dark">{quote.project_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-dark/60 mb-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span className="font-semibold">{quote.agencies?.name}</span>
                      </div>
                      <div>•</div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{quote.client_name}</span>
                      </div>
                      <div>•</div>
                      <div>{formatDate(quote.created_at)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                    className="text-primary hover:text-primary/80"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedQuote === quote.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {expandedQuote === quote.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-dark mb-2">Información del Cliente</div>
                        <div className="space-y-1 text-sm text-dark/70">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${quote.client_email}`} className="hover:text-primary">
                              {quote.client_email}
                            </a>
                          </div>
                          {quote.client_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:${quote.client_phone}`} className="hover:text-primary">
                                {quote.client_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-dark mb-2">Detalles del Proyecto</div>
                        <div className="space-y-1 text-sm text-dark/70">
                          {quote.budget_range && (
                            <div><strong>Presupuesto:</strong> {quote.budget_range}</div>
                          )}
                          {quote.service_category && (
                            <div><strong>Categoría:</strong> {quote.service_category}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-dark mb-2">Descripción del Proyecto</div>
                      <p className="text-sm text-dark/70 bg-gray-50 p-3 rounded-lg">
                        {quote.project_description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm font-semibold text-dark">Cambiar estado:</span>
                      <button
                        onClick={() => handleStatusChange(quote.id, 'pending')}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-semibold hover:bg-yellow-200"
                        disabled={updateStatusMutation.isPending}
                      >
                        Pendiente
                      </button>
                      <button
                        onClick={() => handleStatusChange(quote.id, 'contacted')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold hover:bg-blue-200"
                        disabled={updateStatusMutation.isPending}
                      >
                        Contactado
                      </button>
                      <button
                        onClick={() => handleStatusChange(quote.id, 'won')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold hover:bg-green-200"
                        disabled={updateStatusMutation.isPending}
                      >
                        Ganado
                      </button>
                      <button
                        onClick={() => handleStatusChange(quote.id, 'lost')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold hover:bg-red-200"
                        disabled={updateStatusMutation.isPending}
                      >
                        Perdido
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No hay cotizaciones aún"
            description="Cuando los clientes soliciten cotizaciones, aparecerán aquí con toda la información."
          />
        )}
      </div>
    </div>
  );
}
