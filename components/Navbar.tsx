'use client';

import Link from 'next/link';
import { Menu, LogOut, User, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Navbar() {
  const { user, userData, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image src="/vitria-logo.png" alt="Vitria" width={120} height={40} className="object-contain h-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/agencias" className="text-dark hover:text-primary transition">
              Explorar Agencias
            </Link>
            <Link href="/blog" className="text-dark hover:text-primary transition">
              Blog
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-dark hover:text-primary transition"
                >
                  <User className="w-5 h-5" />
                  <span>{userData?.full_name || 'Mi Cuenta'}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg py-2">
                    {userData?.role === 'admin' && (
                      <>
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Panel de Admin
                        </Link>
                        <Link
                          href="/admin/analytics"
                          className="block px-4 py-2 text-purple-600 hover:bg-purple-50 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Analytics Admin
                        </Link>
                      </>
                    )}
                    {userData?.role === 'agency' && (
                      <Link
                        href="/mi-agencia/analytics"
                        className="block px-4 py-2 text-primary font-semibold hover:bg-primary/10 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mis Métricas
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-dark hover:bg-gray-100 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-dark hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-dark hover:text-primary transition">
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/registro"
                  className="bg-accent text-dark px-4 py-2 rounded-md font-semibold hover:bg-primary hover:text-white transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-dark" />
            ) : (
              <Menu className="w-6 h-6 text-dark" />
            )}
          </button>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t py-4 space-y-4">
            <Link 
              href="/agencias" 
              className="block text-dark hover:text-primary transition py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Explorar Agencias
            </Link>
            <Link 
              href="/blog" 
              className="block text-dark hover:text-primary transition py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Blog
            </Link>
            
            {user ? (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-dark py-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{userData?.full_name || 'Mi Cuenta'}</span>
                </div>
                
                {userData?.role === 'admin' && (
                  <>
                    <Link
                      href="/admin"
                      className="block pl-7 py-2 text-purple-600 font-semibold hover:text-purple-700 transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Panel de Admin
                    </Link>
                    <Link
                      href="/admin/analytics"
                      className="block pl-7 py-2 text-purple-600 hover:text-purple-700 transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Analytics Admin
                    </Link>
                  </>
                )}
                {userData?.role === 'agency' && (
                  <Link
                    href="/mi-agencia/analytics"
                    className="block pl-7 py-2 text-primary font-semibold hover:text-primary/80 transition"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Mis Métricas
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="block pl-7 py-2 text-dark hover:text-primary transition"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left pl-7 py-2 text-dark hover:text-primary transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t">
                <Link 
                  href="/auth/login" 
                  className="block text-dark hover:text-primary transition py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/registro"
                  className="block bg-accent text-dark px-4 py-2 rounded-md font-semibold hover:bg-primary hover:text-white transition text-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
