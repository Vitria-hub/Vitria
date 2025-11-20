'use client';

import Link from 'next/link';
import { useNavigation } from '@/hooks/useNavigation';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showSpinner?: boolean;
  onClick?: () => void;
}

export default function LoadingLink({ 
  href, 
  children, 
  className = '', 
  showSpinner = true,
  onClick 
}: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    if (onClick) onClick();
  };

  return (
    <Link 
      href={href} 
      className={`${className} ${isLoading ? 'opacity-75 pointer-events-none' : ''}`}
      onClick={handleClick}
    >
      {isLoading && showSpinner && (
        <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </Link>
  );
}
