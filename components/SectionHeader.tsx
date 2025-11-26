import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  align?: 'left' | 'center';
  actions?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
  icon: Icon,
  align = 'center',
  actions,
  className = '',
}: SectionHeaderProps) {
  const alignClasses = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`mb-10 md:mb-12 ${alignClasses} ${className}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4 ${
          align === 'center' ? 'mx-auto' : ''
        }`}>
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <span className="text-sm font-semibold text-primary">{eyebrow}</span>
        </div>
      )}
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4">
        {title}
      </h2>
      
      {subtitle && (
        <p className={`text-base sm:text-lg text-dark/70 leading-relaxed ${
          align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-3xl'
        }`}>
          {subtitle}
        </p>
      )}
      
      {actions && (
        <div className={`mt-6 ${align === 'center' ? 'flex justify-center' : ''}`}>
          {actions}
        </div>
      )}
    </div>
  );
}
