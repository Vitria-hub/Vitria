'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
  highlight?: string;
}

interface TestimonialsEnhancedProps {
  testimonials: Testimonial[];
}

export default function TestimonialsEnhanced({ testimonials }: TestimonialsEnhancedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / testimonials.length;
      scrollRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / testimonials.length;
      const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll, { passive: true });
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const highlightQuote = (quote: string) => {
    const sentences = quote.split('. ');
    if (sentences.length > 1) {
      return (
        <>
          <span className="text-primary font-semibold">{sentences[0]}.</span>{' '}
          {sentences.slice(1).join('. ')}
        </>
      );
    }
    return quote;
  };

  return (
    <div className="relative">
      <div className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          className="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => scrollToIndex(Math.min(testimonials.length - 1, activeIndex + 1))}
          className="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
          disabled={activeIndex === testimonials.length - 1}
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 md:grid md:grid-cols-3 md:overflow-visible"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[85vw] max-w-[340px] md:w-auto md:max-w-none snap-center"
          >
            <div className="h-full bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 relative">
              <div className="absolute -top-4 left-6">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-md">
                  <Quote className="w-5 h-5 text-dark" />
                </div>
              </div>

              <div className="flex gap-1 mb-4 pt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <blockquote className="text-dark/80 text-base md:text-lg leading-relaxed mb-6 italic min-h-[100px]">
                &ldquo;{highlightQuote(testimonial.quote)}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-3 border-mint shadow-md flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-dark text-base">{testimonial.author}</div>
                  <div className="text-sm text-dark/60">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === activeIndex 
                ? 'bg-primary w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ver testimonio ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
