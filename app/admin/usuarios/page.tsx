'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Users, ChevronLeft, ChevronRight, Shield, Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/contexts/ConfirmContext';

export default function AdminUsersPage() {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'agency' | 'admin'>('all');

  const { data, isLoading, refetch } = trpc.admin.listUsers.useQuery(
    { page, limit: 20, role: roleFilter },
    { enabled: userData?.role === 'admin' }
  );

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al actualizar rol: ${error.message}`);
    },
  });

  const deleteMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al eliminar usuario: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!loading && (!userData || userData.role !== 'admin')) {
      router.push('/');
    }
  }, [userData, loading, router]);

  if (loading || !userData || userData.role !== 'admin') {
    return null;
  }

  const handleRoleChange = async (userId: string, newRole: 'user' | 'agency' | 'admin') => {
    const confirmed = await confirm({
      title: '¿Cambiar rol de usuario?',
      message: `El rol del usuario cambiará a "${newRole}". Esto afectará sus permisos en la plataforma.`,
      confirmText: 'Cambiar Rol',
      cancelText: 'Cancelar',
      variant: 'warning',
    });

    if (confirmed) {
      updateRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmed = await confirm({
      title: '¿Eliminar usuario?',
      message: 'Esta acción no se puede deshacer. Se eliminarán todas sus agencias, reseñas y datos permanentemente.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
    });

    if (confirmed) {
      deleteMutation.mutate({ userId });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            <Shield className="w-4 h-4" />
            Admin
          </span>
        );
      case 'agency':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            Agencia
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
            Cliente
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
          <h1 className="text-4xl font-bold text-primary mb-2">Gestionar Usuarios</h1>
          <p className="text-dark/70">Ver y administrar usuarios del marketplace</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-dark">Filtrar por rol:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">Todos</option>
              <option value="user">Clientes</option>
              <option value="agency">Agencias</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-dark/60">Cargando usuarios...</p>
          </div>
        ) : data && data.users.length > 0 ? (
          <>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Usuario</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Rol</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Fecha de registro</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-dark">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-dark">{user.full_name || 'Sin nombre'}</div>
                          <div className="text-sm text-dark/60">{user.auth_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getRoleBadge(user.role)}
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                              className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-primary"
                            >
                              <option value="user">Cliente</option>
                              <option value="agency">Agencia</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-dark">
                          {new Date(user.created_at).toLocaleDateString('es-CL')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/usuarios/${user.id}/editar`}
                              className="p-2 hover:bg-blue-50 rounded-lg transition"
                              title="Editar usuario"
                            >
                              <Pencil className="w-5 h-5 text-primary" />
                            </Link>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar usuario"
                              disabled={user.id === userData.id}
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
            <Users className="w-16 h-16 text-dark/30 mx-auto mb-4" />
            <p className="text-dark/60">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
}
