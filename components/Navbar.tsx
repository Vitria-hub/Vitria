import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Agencias<span className="text-accent">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/agencias" className="text-dark hover:text-primary transition">
              Explorar Agencias
            </Link>
            <Link href="/blog" className="text-dark hover:text-primary transition">
              Blog
            </Link>
            <Link href="/dashboard" className="text-dark hover:text-primary transition">
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-accent text-dark px-4 py-2 rounded-md font-semibold hover:bg-primary hover:text-white transition"
            >
              Registrar Agencia
            </Link>
          </div>

          <button className="md:hidden">
            <Menu className="w-6 h-6 text-dark" />
          </button>
        </div>
      </div>
    </nav>
  );
}
