import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'premium' | 'verified' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    premium: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md shadow-blue-200',
    verified: 'bg-secondary/20 text-secondary border-secondary',
    default: 'bg-gray-100 text-dark border-gray-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
        variant !== 'premium' && 'border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
