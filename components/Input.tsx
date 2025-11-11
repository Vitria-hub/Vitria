import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-dark mb-2">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none transition-colors',
          className
        )}
        {...props}
      />
    </div>
  );
}
