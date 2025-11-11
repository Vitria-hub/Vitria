'use client';

import Link from 'next/link';
import Button from './Button';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/agencias?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/agencias');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-primary via-secondary to-primary text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTM2IDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Encuentra la agencia ideal para tu negocio en Chile
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-95 max-w-3xl mx-auto">
            Conecta con las mejores agencias de marketing, publicidad y diseño. Revisa portfolios, lee reseñas reales y encuentra el socio perfecto para hacer crecer tu marca.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto mb-12">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar agencias..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-accent shadow-lg"
              />
            </div>
            <Button type="submit" variant="accent" size="lg" className="shadow-lg">
              Buscar
            </Button>
          </form>

          <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">150+</div>
              <div className="text-sm opacity-90">Agencias Registradas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">4.8★</div>
              <div className="text-sm opacity-90">Promedio Reseñas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
