'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Star, Trash2, ChevronLeft, Calendar, MapPin } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function AdminSponsoredSlotsPage() {
  const { data: slots, isLoading, refetch } = trpc.admin.listSponsoredSlots.useQuery();
  const [editModal, setEditModal] = useState<any>(null);
  const [newEndDate, setNewEndDate] = useState('');

  const removeMutation = trpc.admin.removeSponsoredSlot.useMutation({
    onSuccess: () => {
      refetch();
      alert('Slot eliminado exitosamente');
    },
    onError: (error) => {
      alert(`Error al eliminar: ${error.message}`);
    },
  });

  const updateMutation = trpc.admin.updateSponsoredSlot.useMutation({
    onSuccess: () => {
      alert('Duración actualizada exitosamente');
      setEditModal(null);
      refetch();
    },
    onError: (error) => {
      alert(`Error al actualizar: ${error.message}`);
    },
  });

  const handleRemove = (slotId: string, agencyName: string) => {
    if (confirm(`¿Eliminar a ${agencyName} de los slots destacados?`)) {
      removeMutation.mutate({ slotId });
    }
  };

  const handleUpdateEndDate = () => {
    if (editModal && newEndDate) {
      updateMutation.mutate({
        slotId: editModal.id,
        endsAt: new Date(newEndDate).toISOString(),
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isActive = (startsAt: string, endsAt: string) => {
    const now = new Date();
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    return start <= now && end >= now;
  };

  const daysRemaining = (endsAt: string) => {
    const now = new Date();
    const end = new Date(endsAt);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
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
          <h1 className="text-4xl font-bold text-primary mb-2">Agencias Destacadas</h1>
          <p className="text-dark/70">Gestiona qué agencias aparecen en el carrusel de la homepage</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-dark/60">Cargando slots destacados...</p>
          </div>
        ) : slots && slots.length > 0 ? (
          <div className="grid gap-6">
            {slots.map((slot: any) => {
              const active = isActive(slot.starts_at, slot.ends_at);
              const days = daysRemaining(slot.ends_at);
              
              return (
                <div
                  key={slot.id}
                  className={`bg-white border-2 rounded-xl p-6 ${
                    active ? 'border-purple-200 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl ${
                        active ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-400'
                      }`}>
                        {slot.position}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-primary">
                            {slot.agency?.name || 'Agencia desconocida'}
                          </h3>
                          {active && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              <Star className="w-3 h-3" />
                              Activo
                            </span>
                          )}
                          {!active && days < 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                              Expirado
                            </span>
                          )}
                          {!active && days >= 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              Programado
                            </span>
                          )}
                          {slot.agency?.is_premium && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                              Premium
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/agencias/${slot.agency?.slug}`}
                          className="text-sm text-primary hover:underline mb-3 inline-block"
                        >
                          Ver perfil de agencia →
                        </Link>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-dark/60 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="font-semibold">Inicio:</span>
                            </div>
                            <p className="text-dark ml-6">{formatDate(slot.starts_at)}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm text-dark/60 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="font-semibold">Fin:</span>
                            </div>
                            <p className="text-dark ml-6">{formatDate(slot.ends_at)}</p>
                          </div>
                        </div>

                        {active && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-900">
                              <strong>
                                {days > 0 
                                  ? `${days} día${days === 1 ? '' : 's'} restante${days === 1 ? '' : 's'}`
                                  : 'Expira hoy'
                                }
                              </strong>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditModal(slot);
                          setNewEndDate(slot.ends_at.split('T')[0]);
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                        title="Extender duración"
                      >
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleRemove(slot.id, slot.agency?.name)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-xl">
            <Star className="w-16 h-16 text-dark/30 mx-auto mb-4" />
            <p className="text-dark/60 mb-4">No hay agencias destacadas configuradas</p>
            <Link href="/admin/agencias">
              <Button variant="primary">
                Ir a gestionar agencias
              </Button>
            </Link>
          </div>
        )}

        {editModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-primary">Extender Duración</h2>
              </div>

              <p className="text-dark/70 mb-4">
                Actualiza la fecha de finalización para <strong>{editModal.agency?.name}</strong>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark mb-2">
                  Nueva fecha de finalización:
                </label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-dark/60 mt-2">
                  Fecha actual: {formatDate(editModal.ends_at)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setEditModal(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleUpdateEndDate}
                  disabled={updateMutation.isPending || !newEndDate}
                >
                  {updateMutation.isPending ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
