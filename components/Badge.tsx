import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'premium' | 'verified' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    premium: 'bg-mint/30 text-dark border-mint',
    verified: 'bg-secondary/20 text-secondary border-secondary',
    default: 'bg-gray-100 text-dark border-gray-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
