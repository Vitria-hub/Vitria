'use client';

import Link from 'next/link';
import { Building2, User } from 'lucide-react';

export default function RegisterSelectorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">Únete a Vitria</h1>
          <p className="text-dark/70 text-lg">Elige el tipo de cuenta que necesitas</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/auth/registro/cliente"
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-primary hover:shadow-lg transition group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-dark mb-3">Busco una Agencia</h2>
              <p className="text-dark/70 mb-6">
                Crea tu cuenta como cliente para encontrar y contactar agencias especializadas
              </p>
              <ul className="text-left space-y-2 text-sm text-dark/80 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Busca agencias por categoría y presupuesto</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Guarda tus agencias favoritas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Deja reseñas verificadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Recibe recomendaciones personalizadas</span>
                </li>
              </ul>
              <div className="bg-primary text-white px-6 py-3 rounded-lg font-bold group-hover:bg-dark transition">
                Registrarme como Cliente
              </div>
            </div>
          </Link>

          <Link
            href="/auth/registro/agencia"
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-accent hover:shadow-lg transition group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/20 transition">
                <Building2 className="w-10 h-10 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark mb-3">Soy una Agencia</h2>
              <p className="text-dark/70 mb-6">
                Registra tu agencia para ser descubierta por clientes potenciales
              </p>
              <ul className="text-left space-y-2 text-sm text-dark/80 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                  <span>Crea tu perfil profesional completo</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                  <span>Recibe leads calificados</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                  <span>Accede a métricas de tu perfil</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                  <span>Opciones de destacado premium</span>
                </li>
              </ul>
              <div className="bg-accent text-dark px-6 py-3 rounded-lg font-bold group-hover:bg-primary group-hover:text-white transition">
                Registrarme como Agencia
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-dark/60">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
