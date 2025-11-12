'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import AgencyCard from '@/components/AgencyCard';
import FilterBar from '@/components/FilterBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';

function AgenciasContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 12,
    sort: 'premium',
  });
  const { trackSearch } = useTracking();
  const lastSearchTracked = useRef<string>('');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const regionParam = searchParams.get('region');
    
    const newFilters: any = {};
    
    if (categoryParam) {
      newFilters.category = categoryParam;
    }
    
    if (regionParam) {
      newFilters.region = regionParam;
    }
    
    if (Object.keys(newFilters).length > 0) {
      setFilters((prev: any) => ({ ...prev, ...newFilters }));
    }
  }, [searchParams]);

  const { data, isLoading, isFetching } = trpc.agency.list.useQuery(filters);

  useEffect(() => {
    if (data !== undefined) {
      const searchKey = JSON.stringify(filters);
      if (searchKey !== lastSearchTracked.current) {
        const agencyIds = data.agencies?.map((a: any) => a.id) || [];
        trackSearch({
          searchQuery: filters.q,
          serviceCategory: filters.category,
          locationFilter: filters.location,
          resultsCount: data.total || 0,
          agenciesShown: agencyIds,
        });
        lastSearchTracked.current = searchKey;
      }
    }
  }, [data, filters, trackSearch]);

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

      <FilterBar onFilterChange={handleFilterChange} currentFilters={filters} />

      {isLoading || isFetching ? (
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
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
