'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import AgencyCard from '@/components/AgencyCard';
import FilterBar from '@/components/FilterBar';
import EmptyState from '@/components/EmptyState';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';

function AgenciasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
    const priceRangeParam = searchParams.get('priceRange');
    const qParam = searchParams.get('q');
    const pageParam = searchParams.get('page');
    
    const newFilters: any = {
      page: 1,
      limit: 12,
      sort: 'premium',
    };
    
    if (categoryParam) newFilters.category = categoryParam;
    if (regionParam) newFilters.region = regionParam;
    if (priceRangeParam) newFilters.priceRange = priceRangeParam;
    if (qParam) newFilters.q = qParam;
    if (pageParam) newFilters.page = parseInt(pageParam);
    
    setFilters(newFilters);
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
          locationFilter: filters.region,
          resultsCount: data.total || 0,
          agenciesShown: agencyIds,
        });
        lastSearchTracked.current = searchKey;
      }
    }
  }, [data, filters, trackSearch]);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => {
      const processedFilters = { ...newFilters };
      if (processedFilters.priceRange === '') {
        processedFilters.priceRange = undefined;
      }
      
      const merged = { ...prev, ...processedFilters, page: 1 };
      
      const hasChanges = Object.keys(processedFilters).some(
        key => prev[key] !== processedFilters[key]
      );
      
      if (!hasChanges) {
        return prev;
      }
      
      // Update URL with new filters
      updateURL(merged);
      
      return merged;
    });
  };

  const updateURL = (currentFilters: any) => {
    const params = new URLSearchParams();
    
    if (currentFilters.category) params.set('category', currentFilters.category);
    if (currentFilters.region) params.set('region', currentFilters.region);
    if (currentFilters.priceRange) params.set('priceRange', currentFilters.priceRange);
    if (currentFilters.q) params.set('q', currentFilters.q);
    if (currentFilters.page && currentFilters.page > 1) params.set('page', currentFilters.page.toString());
    
    const queryString = params.toString();
    const newURL = queryString ? `/agencias?${queryString}` : '/agencias';
    
    router.push(newURL, { scroll: false });
  };

  const removeFilter = (filterKey: string) => {
    setFilters((prev: any) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      newFilters.page = 1;
      
      // Update URL immediately to keep sync
      const params = new URLSearchParams();
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.region) params.set('region', newFilters.region);
      if (newFilters.priceRange) params.set('priceRange', newFilters.priceRange);
      if (newFilters.q) params.set('q', newFilters.q);
      
      const queryString = params.toString();
      const newURL = queryString ? `/agencias?${queryString}` : '/agencias';
      router.push(newURL, { scroll: false });
      
      return newFilters;
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev: any) => {
      const newFilters = { ...prev, page: newPage };
      updateURL(newFilters);
      return newFilters;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sort: 'premium',
    });
    router.push('/agencias');
  };

  const hasActiveFilters = filters.category || filters.region || filters.priceRange || filters.q;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Explorar Agencias</h1>

      <FilterBar onFilterChange={handleFilterChange} currentFilters={filters} />

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-dark/60">Filtros activos:</span>
          
          {filters.category && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <span>Categoría: {filters.category}</span>
              <button
                onClick={() => removeFilter('category')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label="Quitar filtro de categoría"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {filters.region && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <span>Región: {filters.region}</span>
              <button
                onClick={() => removeFilter('region')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label="Quitar filtro de región"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {filters.priceRange && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <span>Presupuesto: {filters.priceRange}</span>
              <button
                onClick={() => removeFilter('priceRange')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label="Quitar filtro de presupuesto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {filters.q && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Search className="w-4 h-4" />
              <span>&quot;{filters.q}&quot;</span>
              <button
                onClick={() => removeFilter('q')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label="Quitar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <button
            onClick={handleClearFilters}
            className="text-sm text-dark/60 hover:text-primary font-medium underline"
          >
            Limpiar todos
          </button>
        </div>
      )}

      {isLoading && !data ? (
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
          <div className="flex items-center justify-between mt-8 mb-4">
            <div className="flex items-center gap-2 text-dark/60">
              <span>Mostrando {data.agencies.length} de {data.total} agencias</span>
              {data.agencies.some((a: any) => a.is_premium) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                  Premium
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 transition-opacity ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
        <EmptyState
          icon={Search}
          title="No encontramos agencias"
          description={hasActiveFilters 
            ? "Intenta ajustar los filtros para ver más resultados. También puedes explorar todas las categorías disponibles."
            : "Actualmente no hay agencias disponibles. Vuelve pronto para descubrir nuevas opciones."}
          action={hasActiveFilters ? {
            label: "Limpiar filtros",
            onClick: handleClearFilters,
          } : undefined}
        />
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
