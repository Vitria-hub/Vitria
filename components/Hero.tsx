'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAIN_CATEGORIES } from '@/lib/categories';

export default function Hero() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    
    const queryString = params.toString();
    router.push(`/agencias${queryString ? '?' + queryString : ''}`);
  };

  return (
    <div className="relative bg-gradient-to-br from-primary via-secondary to-primary text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTM2IDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 opacity-5">
        <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-10 right-10 w-40 h-40 md:w-56 md:h-56 opacity-5">
        <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Encuentra la agencia que necesitas en Chile
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-95 max-w-3xl mx-auto">
            Marketing, publicidad, diseño, audiovisual, desarrollo web y más. Conectamos negocios con agencias especializadas en todo Chile.
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto mb-12">
            <div className="mb-4">
              <label className="block text-left text-sm font-semibold text-dark mb-2">
                ¿Qué necesitas?
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-dark bg-gray-50 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition appearance-none cursor-pointer"
                >
                  <option value="">Todas las categorías</option>
                  {MAIN_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg text-lg" loading={isSearching}>
              Ver Agencias Disponibles
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
