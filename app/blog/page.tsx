import Link from 'next/link';

const mockPosts = [
  {
    id: '1',
    title: 'Cómo elegir la agencia de marketing perfecta para tu negocio',
    excerpt:
      'Guía completa con los criterios clave que debes considerar al seleccionar una agencia de marketing.',
    date: '2025-01-15',
    category: 'Guías',
  },
  {
    id: '2',
    title: 'Tendencias de marketing digital para 2025',
    excerpt:
      'Descubre las estrategias y tecnologías que dominarán el panorama del marketing este año.',
    date: '2025-01-10',
    category: 'Tendencias',
  },
  {
    id: '3',
    title: 'El poder del branding en el éxito empresarial',
    excerpt:
      'Por qué invertir en branding profesional puede transformar tu negocio y aumentar tus ventas.',
    date: '2025-01-05',
    category: 'Branding',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-4">Blog</h1>
      <p className="text-lg text-dark/70 mb-12">
        Consejos, tendencias y guías sobre marketing y agencias
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition"
          >
            <div className="h-48 bg-gradient-to-br from-primary to-secondary"></div>
            <div className="p-6">
              <span className="text-xs font-semibold text-accent uppercase">{post.category}</span>
              <h2 className="text-xl font-bold text-dark mt-2 mb-3">{post.title}</h2>
              <p className="text-dark/70 text-sm mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark/60">{post.date}</span>
                <Link href={`/blog/${post.id}`} className="text-primary font-semibold text-sm hover:text-accent">
                  Leer más →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
