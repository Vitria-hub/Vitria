'use client';

import Image from 'next/image';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MAIN_CATEGORIES } from '@/lib/categories';

export default function HeroEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const goToAgencias = () => {
    router.push('/agencias');
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-primary via-secondary to-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTM2IDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 opacity-5">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="128px" className="object-contain" />
        </div>
        <div className="absolute bottom-10 right-10 w-40 h-40 md:w-56 md:h-56 opacity-5">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="160px" className="object-contain" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">El directorio #1 de agencias en Chile</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Encuentra la agencia ideal
              <span className="block text-accent">para tu negocio</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Marketing, publicidad, diseño, desarrollo web y más. 
              Conectamos negocios con agencias especializadas en todo Chile.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto mb-8">
              <div className="mb-4">
                <label className="block text-left text-sm font-semibold text-dark mb-2">
                  ¿Qué tipo de agencia necesitas?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl text-dark bg-gray-50 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition appearance-none cursor-pointer text-sm sm:text-base"
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

              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full bg-accent hover:bg-accent/90 text-dark font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 min-h-[56px] border-2 border-accent/50 hover:border-accent"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                ) : (
                  <>
                    Explorar Agencias
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <span className="opacity-80">¿Eres una agencia?</span>
              <a 
                href="/dashboard" 
                className="font-semibold underline underline-offset-4 hover:text-accent transition"
              >
                Registra tu agencia gratis →
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
          showStickyCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-lg px-4 py-3 safe-area-bottom">
          <button
            onClick={goToAgencias}
            className="w-full bg-accent hover:bg-accent/90 text-dark font-bold py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Search className="w-5 h-5" />
            Explorar Agencias
          </button>
        </div>
      </div>
    </>
  );
}
