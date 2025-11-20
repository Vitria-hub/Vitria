'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import Button from '@/components/Button';

type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsOpen(false);
    setLoading(false);
    if (resolver) resolver(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setLoading(false);
    if (resolver) resolver(false);
  };

  const getVariantStyles = (variant: ConfirmVariant = 'info') => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          icon: <AlertCircle className="w-8 h-8 text-red-600" />,
          confirmVariant: 'primary' as const,
          confirmClass: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
          confirmVariant: 'accent' as const,
          confirmClass: '',
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          icon: <Info className="w-8 h-8 text-blue-600" />,
          confirmVariant: 'primary' as const,
          confirmClass: '',
        };
    }
  };

  if (!isOpen || !options) return <ConfirmContext.Provider value={{ confirm }}>{children}</ConfirmContext.Provider>;

  const variant = getVariantStyles(options.variant);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
          {/* Icon */}
          <div className={`${variant.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
            {variant.icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-dark text-center mb-3">
            {options.title}
          </h3>

          {/* Message */}
          <p className="text-dark/70 text-center mb-6">
            {options.message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              {options.cancelText || 'Cancelar'}
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant.confirmVariant}
              className={`flex-1 ${variant.confirmClass}`}
              loading={loading}
            >
              {options.confirmText || 'Confirmar'}
            </Button>
          </div>
        </div>
      </div>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm debe ser usado dentro de ConfirmProvider');
  }
  return context.confirm;
}
