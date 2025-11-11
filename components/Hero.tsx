import Link from 'next/link';
import Button from './Button';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-primary via-secondary to-lilacDark text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Encuentra la Agencia <span className="text-accent">Perfecta</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          El directorio más completo de agencias de marketing, branding y publicidad en Chile
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto mb-12">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por servicio, ubicación..."
              className="w-full pl-12 pr-4 py-4 rounded-md text-dark focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <Link href="/agencias">
            <Button variant="accent" size="lg">
              Buscar Agencias
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="secondary">Registrar mi Agencia</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
