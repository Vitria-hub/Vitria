import Link from 'next/link';
import Button from '@/components/Button';
import { Ban } from 'lucide-react';

interface AdminAccessDeniedProps {
  isLoggedIn: boolean;
}

export default function AdminAccessDenied({ isLoggedIn }: AdminAccessDeniedProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ban className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Acceso Denegado</h1>
        <p className="text-dark/70 mb-6">
          Debes iniciar sesión como <strong>administrador</strong> para acceder a esta página.
        </p>
        <div className="space-y-3">
          <Link href="/">
            <Button variant="primary" className="w-full">
              Volver al Inicio
            </Button>
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard">
              <Button variant="secondary" className="w-full">
                Ir a Mi Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
