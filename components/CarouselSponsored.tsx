'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CarouselSponsored() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: sponsored } = trpc.sponsor.listHome.useQuery();

  if (!sponsored || sponsored.length === 0) {
    return null;
  }

  const next = () => setCurrentIndex((i) => (i + 1) % sponsored.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + sponsored.length) % sponsored.length);

  const current = sponsored[currentIndex];

  return (
    <div className="relative bg-gradient-to-r from-primary to-secondary rounded-xl overflow-hidden">
      <div className="px-12 py-16 text-white">
        <div className="max-w-3xl">
          <span className="text-accent text-sm font-semibold uppercase tracking-wide">
            Agencia Destacada
          </span>
          <h2 className="text-4xl font-bold mt-2">{current.agency?.name}</h2>
          <p className="text-lg mt-4 opacity-90">{current.agency?.description}</p>
          <Link
            href={`/agencias/${current.agency?.slug}`}
            className="inline-block mt-6 bg-accent text-dark px-6 py-3 rounded-md font-bold hover:bg-white transition"
          >
            Ver Perfil
          </Link>
        </div>
      </div>

      {sponsored.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sponsored.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
