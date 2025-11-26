'use client';

import { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import AgencyCardEnhanced from '@/components/AgencyCardEnhanced';
import FilterBarEnhanced from '@/components/FilterBarEnhanced';
import EmptyState from '@/components/EmptyState';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
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
    const industryParam = searchParams.get('industry');
    const priceRangeParam = searchParams.get('priceRange');
    const qParam = searchParams.get('q');
    const pageParam = searchParams.get('page');
    const sortParam = searchParams.get('sort');
    
    const newFilters: any = {
      page: 1,
      limit: 12,
      sort: sortParam || 'premium',
    };
    
    if (categoryParam) newFilters.category = categoryParam;
    if (industryParam) newFilters.industry = industryParam;
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
          locationFilter: filters.industry,
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
      
      Object.keys(processedFilters).forEach(key => {
        if (processedFilters[key] === '') {
          processedFilters[key] = undefined;
        }
      });
      
      const merged = { ...prev, ...processedFilters, page: 1 };
      
      const hasChanges = Object.keys(processedFilters).some(
        key => prev[key] !== processedFilters[key]
      );
      
      if (!hasChanges) {
        return prev;
      }
      
      updateURL(merged);
      
      return merged;
    });
  };

  const updateURL = (currentFilters: any) => {
    const params = new URLSearchParams();
    
    if (currentFilters.category) params.set('category', currentFilters.category);
    if (currentFilters.industry) params.set('industry', currentFilters.industry);
    if (currentFilters.priceRange) params.set('priceRange', currentFilters.priceRange);
    if (currentFilters.q) params.set('q', currentFilters.q);
    if (currentFilters.sort && currentFilters.sort !== 'premium') params.set('sort', currentFilters.sort);
    if (currentFilters.page && currentFilters.page > 1) params.set('page', currentFilters.page.toString());
    
    const queryString = params.toString();
    const newURL = queryString ? `/agencias?${queryString}` : '/agencias';
    
    router.push(newURL, { scroll: false });
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

  const hasActiveFilters = filters.category || filters.industry || filters.priceRange || filters.q;

  const allAgenciesArePremium = useMemo(() => {
    if (!data?.agencies || data.agencies.length === 0) return false;
    return data.agencies.every((agency: any) => agency.is_premium);
  }, [data?.agencies]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Explorar Agencias</h1>
        <p className="mt-2 text-dark/60 text-sm sm:text-base">
          Encuentra la agencia ideal para tu proyecto
        </p>
      </header>

      <FilterBarEnhanced 
        onFilterChange={handleFilterChange} 
        currentFilters={filters}
        onClearFilters={handleClearFilters}
        totalResults={data?.total}
      />

      {isLoading && !data ? (
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      ) : data?.agencies && data.agencies.length > 0 ? (
        <>
          <div className="flex items-center justify-between mt-6 sm:mt-8 mb-4">
            <p className="text-dark/60 text-sm sm:text-base">
              Mostrando <span className="font-semibold text-dark">{data.agencies.length}</span> de{' '}
              <span className="font-semibold text-dark">{data.total}</span> agencias
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity duration-300 ${
              isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'
            }`}
          >
            {data.agencies.map((agency: any) => (
              <AgencyCardEnhanced 
                key={agency.id} 
                agency={agency}
                showRecommendedBadge={!allAgenciesArePremium}
              />
            ))}
          </div>

          {data.totalPages > 1 && (
            <nav 
              className="flex justify-center items-center gap-2 sm:gap-4 mt-8 sm:mt-12"
              aria-label="Paginación"
            >
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="p-2 sm:p-3 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1 sm:gap-2">
                {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (data.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (filters.page <= 3) {
                    pageNum = i + 1;
                  } else if (filters.page >= data.totalPages - 2) {
                    pageNum = data.totalPages - 4 + i;
                  } else {
                    pageNum = filters.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                        filters.page === pageNum
                          ? 'bg-primary text-white shadow-md'
                          : 'border-2 border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                      aria-label={`Página ${pageNum}`}
                      aria-current={filters.page === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === data.totalPages}
                className="p-2 sm:p-3 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="mt-8">
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
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <div className="h-10 bg-gray-200 rounded w-64 mb-3 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-80 animate-pulse"></div>
      </div>
      <div className="bg-white p-5 rounded-xl border-2 border-gray-200 animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function AgenciasPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AgenciasContent />
    </Suspense>
  );
}
