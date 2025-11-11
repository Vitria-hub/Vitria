'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import AgencyCard from '@/components/AgencyCard';
import FilterBar from '@/components/FilterBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function AgenciasContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 12,
    sort: 'premium',
  });

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters((prev: any) => ({ ...prev, q: searchQuery }));
    }
  }, [searchParams]);

  const { data, isLoading } = trpc.agency.list.useQuery(filters);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev: any) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Explorar Agencias</h1>

      <FilterBar onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-dark/60">Cargando agencias...</p>
        </div>
      ) : data?.agencies && data.agencies.length > 0 ? (
        <>
          <div className="mt-8 mb-4 text-dark/60">
            Mostrando {data.agencies.length} de {data.total} agencias
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {data.agencies.map((agency: any) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="p-2 rounded-md border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-dark font-semibold">
                Página {filters.page} de {data.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === data.totalPages}
                className="p-2 rounded-md border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-dark/60">No se encontraron agencias con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
}

export default function AgenciasPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">Explorar Agencias</h1>
        <div className="text-center py-12">
          <p className="text-dark/60">Cargando agencias...</p>
        </div>
      </div>
    }>
      <AgenciasContent />
    </Suspense>
  );
}
