'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { ChevronLeft, AlertCircle, Save } from 'lucide-react';

export default function EditUserPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: user, isLoading, error: queryError } = trpc.admin.getUser.useQuery(
    { userId },
    { 
      enabled: !!userData && userData.role === 'admin',
      retry: false
    }
  );

  const updateMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push('/admin/usuarios'), 2000);
    },
    onError: (err) => {
      setError(err.message || 'Error al actualizar el usuario');
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && (!userData || userData.role !== 'admin')) {
      router.push('/');
    }
  }, [userData, authLoading, router]);

  if (authLoading || !userData || userData.role !== 'admin') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    updateMutation.mutate({
      userId,
      ...formData,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark/60">Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  if (queryError || (!isLoading && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">Usuario no encontrado</h1>
          {queryError && (
            <p className="text-dark/60 mb-4">{queryError.message}</p>
          )}
          <Button variant="primary" onClick={() => router.push('/admin/usuarios')}>
            Volver al panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/usuarios')}
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver a usuarios
          </button>
          <h1 className="text-4xl font-bold text-primary mb-2">Editar Usuario</h1>
          <p className="text-dark/70">Modifica la información de {user.full_name || 'este usuario'}</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
            <Save className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">¡Cambios guardados!</p>
              <p className="text-sm text-green-700">Redirigiendo...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="font-semibold text-red-900">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-dark mb-6">Información del Usuario</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Nombre Completo *
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan@example.com"
                  required
                />
                <p className="text-sm text-dark/60 mt-1">
                  Cambiar el email actualizará también las credenciales de inicio de sesión
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-dark/70 mb-2">
                    <span className="font-semibold">Rol actual:</span> {
                      user.role === 'admin' ? 'Administrador' :
                      user.role === 'agency' ? 'Agencia' : 'Cliente'
                    }
                  </p>
                  <p className="text-sm text-dark/70">
                    <span className="font-semibold">Fecha de registro:</span> {new Date(user.created_at).toLocaleDateString('es-CL')}
                  </p>
                  <p className="text-xs text-dark/60 mt-2">
                    Para cambiar el rol, usa el selector en la lista de usuarios
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={updateMutation.isLoading}
              className="flex-1"
            >
              {updateMutation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/usuarios')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
