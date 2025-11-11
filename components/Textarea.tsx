import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-dark mb-2">{label}</label>}
      <textarea
        className={cn(
          'w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none transition-colors resize-none',
          className
        )}
        rows={4}
        {...props}
      />
    </div>
  );
}
