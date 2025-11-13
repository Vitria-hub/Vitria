import Image from 'next/image';

interface AgencyLogoProps {
  name: string;
  logoUrl: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-16 h-16 text-lg',
  lg: 'w-24 h-24 text-2xl',
  xl: 'w-32 h-32 text-3xl',
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-primary',
    'bg-secondary', 
    'bg-accent',
    'bg-mint',
    'bg-lilac',
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

export default function AgencyLogo({ 
  name, 
  logoUrl, 
  size = 'md',
  className = ''
}: AgencyLogoProps) {
  const hasValidLogo = logoUrl && !logoUrl.includes('ui-avatars.com');
  
  if (hasValidLogo) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className} flex-shrink-0`}>
        <Image
          src={logoUrl}
          alt={name}
          width={size === 'sm' ? 48 : size === 'md' ? 64 : size === 'lg' ? 96 : 128}
          height={size === 'sm' ? 48 : size === 'md' ? 64 : size === 'lg' ? 96 : 128}
          className="rounded-lg border-2 border-gray-200 object-cover w-full h-full"
        />
      </div>
    );
  }
  
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);
  
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${bgColor} 
        ${className}
        rounded-lg 
        flex 
        items-center 
        justify-center 
        font-bold 
        text-white
        border-2
        border-gray-200
        shadow-sm
      `}
    >
      {initials}
    </div>
  );
}
