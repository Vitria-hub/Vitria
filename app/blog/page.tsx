import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog/posts';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - Vitria | Guías y Consejos sobre Agencias en Chile',
  description: 'Aprende cómo elegir la mejor agencia de marketing, branding y publicidad en Chile. Guías prácticas, precios de mercado y consejos de expertos.',
  openGraph: {
    title: 'Blog de Vitria - Guías sobre Agencias en Chile',
    description: 'Guías prácticas para elegir agencias de marketing, diseño y publicidad en Chile',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map(p => p.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog de Vitria
            </h1>
            <p className="text-xl opacity-95 max-w-2xl mx-auto">
              Guías prácticas, consejos de expertos y todo lo que necesitas saber sobre agencias en Chile
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex flex-wrap gap-3">
          <span className="text-dark/70 font-semibold">Categorías:</span>
          {categories.map((category) => (
            <span key={category} className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-primary border-2 border-gray-200">
              {category}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 w-full bg-gray-200">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-dark text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-dark mb-3 group-hover:text-primary transition line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-dark/70 mb-4 flex-1 line-clamp-3">
                  {post.description}
                </p>

                <div className="flex items-center justify-between text-sm text-dark/60 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('es-CL', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 bg-mint/20 text-primary rounded">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  Leer más <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dark/60 text-lg">No hay posts disponibles todavía.</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-mint/20 to-lilac/20 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            ¿Buscas una Agencia?
          </h2>
          <p className="text-lg text-dark/70 mb-8">
            Encuentra y compara las mejores agencias de marketing, branding y publicidad en Chile
          </p>
          <Link
            href="/agencias"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-dark transition shadow-lg"
          >
            Explorar Agencias <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
