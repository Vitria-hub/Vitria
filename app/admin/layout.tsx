'use client';

import { useAuth } from '@/hooks/useAuth';
import AdminAccessDenied from '@/components/AdminAccessDenied';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark/60">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== 'admin') {
    return <AdminAccessDenied isLoggedIn={!!userData} />;
  }

  return <>{children}</>;
}
