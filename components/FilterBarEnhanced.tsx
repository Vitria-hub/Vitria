'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Tag, 
  Building2, 
  DollarSign,
  ArrowUpDown,
  Filter,
  ChevronDown
} from 'lucide-react';
import { MAIN_CATEGORIES, INDUSTRIES } from '@/lib/categories';

const PRICE_RANGES = [
  { value: 'Menos de 1M', label: 'Menos de 1M CLP' },
  { value: '1-3M', label: '1-3M CLP' },
  { value: '3-5M', label: '3-5M CLP' },
  { value: '5M+', label: '5M+ CLP' },
];

const SORT_OPTIONS = [
  { value: 'premium', label: 'Destacadas' },
  { value: 'rating', label: 'Mejor valoradas' },
  { value: 'reviews', label: 'Más reseñas' },
  { value: 'recent', label: 'Más recientes' },
];

interface FilterBarEnhancedProps {
  onFilterChange: (filters: any) => void;
  currentFilters?: any;
  onClearFilters?: () => void;
  totalResults?: number;
}

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-200">
      <span className="text-primary/70">{label}:</span>
      <span className="font-semibold">{value}</span>
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
        aria-label={`Quitar filtro ${label}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface SelectWithIconProps {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
}

function SelectWithIcon({ icon, value, onChange, options, placeholder, className = '' }: SelectWithIconProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none appearance-none bg-white text-sm font-medium cursor-pointer hover:border-gray-300 transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default function FilterBarEnhanced({ 
  onFilterChange, 
  currentFilters = {},
  onClearFilters,
  totalResults 
}: FilterBarEnhancedProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [searchValue, setSearchValue] = useState(currentFilters.q || '');

  useEffect(() => {
    setSearchValue(currentFilters.q || '');
  }, [currentFilters.q]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ q: searchValue });
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value === '') {
      onFilterChange({ q: '' });
    }
  };

  const activeFiltersCount = [
    currentFilters.category,
    currentFilters.industry,
    currentFilters.priceRange,
    currentFilters.q
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const getCategoryLabel = (id: string) => {
    const cat = MAIN_CATEGORIES.find(c => c.id === id);
    return cat?.label || id;
  };

  const getPriceLabel = (value: string) => {
    const range = PRICE_RANGES.find(r => r.value === value);
    return range?.label || value;
  };

  const FilterContent = () => (
    <>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar agencias por nombre..."
          value={searchValue}
          className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <SelectWithIcon
          icon={<Tag className="w-4 h-4" />}
          value={currentFilters.category || ''}
          onChange={(value) => onFilterChange({ category: value })}
          options={MAIN_CATEGORIES.map(c => ({ value: c.id, label: c.label }))}
          placeholder="Todas las categorías"
        />

        <SelectWithIcon
          icon={<Building2 className="w-4 h-4" />}
          value={currentFilters.industry || ''}
          onChange={(value) => onFilterChange({ industry: value })}
          options={INDUSTRIES.map(i => ({ value: i, label: i }))}
          placeholder="Todas las industrias"
        />

        <SelectWithIcon
          icon={<DollarSign className="w-4 h-4" />}
          value={currentFilters.priceRange || ''}
          onChange={(value) => onFilterChange({ priceRange: value })}
          options={PRICE_RANGES}
          placeholder="Cualquier precio"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-600">Ordenar por:</span>
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange({ sort: option.value })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentFilters.sort === option.value || (!currentFilters.sort && option.value === 'premium')
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {totalResults !== undefined && (
          <span className="text-sm text-gray-500">
            {totalResults} {totalResults === 1 ? 'agencia' : 'agencias'}
          </span>
        )}
      </div>
    </>
  );

  return (
    <>
      <div 
        className={`bg-white transition-all duration-300 ${
          isSticky 
            ? 'sticky top-16 z-40 shadow-lg border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4' 
            : 'p-5 rounded-xl border-2 border-gray-200'
        }`}
      >
        <div className="hidden md:block">
          <FilterContent />
        </div>

        <div className="md:hidden">
          <div className="flex gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchValue}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </form>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-semibold text-sm">Filtrar</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            Filtros activos:
          </span>
          
          {currentFilters.category && (
            <FilterChip
              label="Categoría"
              value={getCategoryLabel(currentFilters.category)}
              onRemove={() => onFilterChange({ category: '' })}
            />
          )}
          
          {currentFilters.industry && (
            <FilterChip
              label="Industria"
              value={currentFilters.industry}
              onRemove={() => onFilterChange({ industry: '' })}
            />
          )}
          
          {currentFilters.priceRange && (
            <FilterChip
              label="Precio"
              value={getPriceLabel(currentFilters.priceRange)}
              onRemove={() => onFilterChange({ priceRange: '' })}
            />
          )}
          
          {currentFilters.q && (
            <FilterChip
              label="Búsqueda"
              value={`"${currentFilters.q}"`}
              onRemove={() => onFilterChange({ q: '' })}
            />
          )}
          
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="ml-2 text-sm text-primary hover:text-primary/80 font-semibold underline underline-offset-2 transition-colors"
            >
              Limpiar todos
            </button>
          )}
        </div>
      )}

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="w-4 h-4" />
                    Categoría
                  </label>
                  <select
                    value={currentFilters.category || ''}
                    onChange={(e) => onFilterChange({ category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">Todas las categorías</option>
                    {MAIN_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building2 className="w-4 h-4" />
                    Industria
                  </label>
                  <select
                    value={currentFilters.industry || ''}
                    onChange={(e) => onFilterChange({ industry: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">Todas las industrias</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    Rango de precio
                  </label>
                  <select
                    value={currentFilters.priceRange || ''}
                    onChange={(e) => onFilterChange({ priceRange: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">Cualquier precio</option>
                    {PRICE_RANGES.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ArrowUpDown className="w-4 h-4" />
                    Ordenar por
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => onFilterChange({ sort: option.value })}
                        className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                          currentFilters.sort === option.value || (!currentFilters.sort && option.value === 'premium')
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                {onClearFilters && (
                  <button
                    onClick={() => {
                      onClearFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
