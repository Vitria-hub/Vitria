interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  media_urls: string[];
  client_name: string | null;
  tags: string[];
}

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-dark/60">
        <p>No hay elementos de portafolio disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border-2 border-gray-200 overflow-hidden hover:border-primary transition">
          {item.media_urls && item.media_urls.length > 0 && (
            <img
              src={item.media_urls[0]}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h4 className="font-bold text-dark">{item.title}</h4>
            {item.client_name && (
              <p className="text-sm text-dark/60 mt-1">Cliente: {item.client_name}</p>
            )}
            {item.description && (
              <p className="text-sm text-dark/70 mt-2 line-clamp-2">{item.description}</p>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-lilac/20 text-primary rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
