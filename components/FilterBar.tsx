'use client';

import Input from './Input';
import { Search } from 'lucide-react';
import { MAIN_CATEGORIES } from '@/lib/categories';

const REGIONS = ['RM', 'V', 'VIII', 'IV', 'VII', 'IX', 'X'];
const PRICE_RANGES = [
  { value: 'Menos de 1M', label: 'Menos de 1M CLP' },
  { value: '1-3M', label: '1-3M CLP' },
  { value: '3-5M', label: '3-5M CLP' },
  { value: '5M+', label: '5M+ CLP' },
];

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  currentFilters?: any;
}

export default function FilterBar({ onFilterChange, currentFilters = {} }: FilterBarProps) {
  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar agencias..."
          value={currentFilters.q || ''}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none"
          onChange={(e) => onFilterChange({ q: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={currentFilters.category || ''}
          className="px-4 py-2 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none"
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="">Todas las categorías</option>
          {MAIN_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          value={currentFilters.priceRange || ''}
          className="px-4 py-2 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none"
          onChange={(e) => onFilterChange({ priceRange: e.target.value })}
        >
          <option value="">Cualquier precio</option>
          {PRICE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        <select
          value={currentFilters.sort || 'premium'}
          className="px-4 py-2 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none"
          onChange={(e) => onFilterChange({ sort: e.target.value })}
        >
          <option value="premium">Destacadas</option>
          <option value="rating">Mejor valoradas</option>
          <option value="reviews">Más reseñas</option>
          <option value="recent">Más recientes</option>
        </select>
      </div>
    </div>
  );
}
