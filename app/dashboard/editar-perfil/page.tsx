'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';

export default function EditarPerfilPage() {
  const router = useRouter();
  const { data: agency, isLoading } = trpc.agency.myAgency.useQuery();

  useEffect(() => {
    if (!isLoading && agency) {
      router.push(`/agencias/${agency.slug}`);
    } else if (!isLoading && !agency) {
      router.push('/dashboard');
    }
  }, [agency, isLoading, router]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <p className="text-dark/60">Redirigiendo a tu perfil...</p>
      </div>
    </div>
  );
}
