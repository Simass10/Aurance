import { Wallet } from 'lucide-react';

interface AuranceLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function AuranceLogo({ size = 'md', showText = true, className = '' }: AuranceLogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-xl', container: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-2xl', container: 'gap-2' },
    lg: { icon: 'w-12 h-12', text: 'text-4xl', container: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-5xl', container: 'gap-4' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`inline-flex items-center ${currentSize.container} ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl blur-md opacity-50 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-2 shadow-xl">
          <Wallet className={`${currentSize.icon} text-white`} />
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${currentSize.text} font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent`}>
            Aurance
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Financial Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
