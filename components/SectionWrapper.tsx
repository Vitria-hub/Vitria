import Image from 'next/image';
import { ReactNode } from 'react';

type BgVariant = 'white' | 'light' | 'gradient' | 'primary' | 'accent';

interface SectionWrapperProps {
  children: ReactNode;
  bgVariant?: BgVariant;
  className?: string;
  showDecor?: boolean;
  decorPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'both';
  id?: string;
}

const bgClasses: Record<BgVariant, string> = {
  white: 'bg-white',
  light: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-mint/10 via-lilac/10 to-secondary/10',
  primary: 'bg-gradient-to-br from-primary/5 to-secondary/5',
  accent: 'bg-gradient-to-br from-accent/10 via-white to-mint/10',
};

export default function SectionWrapper({
  children,
  bgVariant = 'white',
  className = '',
  showDecor = false,
  decorPosition = 'both',
  id,
}: SectionWrapperProps) {
  const showTopLeft = showDecor && (decorPosition === 'top-left' || decorPosition === 'both');
  const showBottomRight = showDecor && (decorPosition === 'bottom-right' || decorPosition === 'both');
  const showTopRight = showDecor && decorPosition === 'top-right';
  const showBottomLeft = showDecor && decorPosition === 'bottom-left';

  return (
    <section
      id={id}
      className={`relative py-16 md:py-20 lg:py-24 overflow-hidden ${bgClasses[bgVariant]} ${className}`}
    >
      {showTopLeft && (
        <div className="absolute top-8 left-8 w-20 h-20 md:w-28 md:h-28 opacity-5 pointer-events-none">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="(max-width: 768px) 80px, 112px" className="object-contain" />
        </div>
      )}
      {showTopRight && (
        <div className="absolute top-8 right-8 w-20 h-20 md:w-28 md:h-28 opacity-5 pointer-events-none">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="(max-width: 768px) 80px, 112px" className="object-contain" />
        </div>
      )}
      {showBottomLeft && (
        <div className="absolute bottom-8 left-8 w-20 h-20 md:w-28 md:h-28 opacity-5 pointer-events-none">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="(max-width: 768px) 80px, 112px" className="object-contain" />
        </div>
      )}
      {showBottomRight && (
        <div className="absolute bottom-8 right-8 w-20 h-20 md:w-28 md:h-28 opacity-5 pointer-events-none">
          <Image src="/vitria-isotipo.png" alt="" fill sizes="(max-width: 768px) 80px, 112px" className="object-contain" />
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
