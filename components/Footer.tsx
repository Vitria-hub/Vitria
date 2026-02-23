import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Vitria</h3>
            <p className="text-gray-300 text-sm">
              El directorio más completo de agencias de marketing en Chile.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/agencias" className="text-gray-300 hover:text-accent transition">
                  Agencias
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-accent transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Agencias</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-accent transition">
                  Registrar Agencia
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-accent transition">
                  Panel Profesional
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos" className="text-gray-300 hover:text-accent transition">
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-300 hover:text-accent transition">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-accent transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vitria. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
