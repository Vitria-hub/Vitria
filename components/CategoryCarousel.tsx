'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoveHorizontal, TrendingUp, Heart, Award, Code, Camera, Users, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'performance-ads': TrendingUp,
  'social-media': Heart,
  'branding-identidad': Award,
  'desarrollo-web': Code,
  'produccion-contenido': Camera,
  'relaciones-publicas': Users,
};

interface Category {
  name: string;
  count: number;
  description: string;
  categoryId: string;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <div className="md:hidden flex items-center justify-center gap-2 text-dark/50 text-sm mb-4">
        <MoveHorizontal className={`w-4 h-4 ${showSwipeHint ? 'animate-pulse' : ''}`} />
        <span>Desliza para ver más</span>
      </div>

      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
      </button>

      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>

      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-[5] pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-[5] pointer-events-none md:hidden" />

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:gap-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const Icon = iconMap[category.categoryId] || TrendingUp;
          return (
            <Link
              key={category.categoryId}
              href={`/agencias?category=${category.categoryId}`}
              className="group flex-shrink-0 w-[280px] md:w-auto snap-start bg-white border-2 border-gray-200 rounded-xl p-5 md:p-6 hover:border-primary hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-mint/30 to-primary/10 rounded-xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg text-dark mb-1 group-hover:text-primary transition truncate">
                    {category.name}
                  </h3>
                  <p className="text-sm text-dark/60 mb-2 line-clamp-2">{category.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {category.count} agencias
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
