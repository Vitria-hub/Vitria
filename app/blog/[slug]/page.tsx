import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPosts } from '@/lib/blog/posts';
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: `${post.title} | Blog Vitria`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vitria',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vitria.replit.app/vitria-logo.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-gray-50">
        <div className="relative h-96 bg-gradient-to-br from-primary to-secondary">
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover opacity-20"
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al blog
            </Link>

            <div className="mb-4">
              <span className="px-3 py-1 bg-accent text-dark text-sm font-bold rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} de lectura</span>
              </div>
              <div>
                Por {post.author}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-sm px-3 py-1 bg-mint/20 text-primary rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-dark prose-ul:text-dark/80 prose-ol:text-dark/80 prose-p:text-dark/80 prose-p:leading-relaxed prose-li:my-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>

            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <div className="flex items-center justify-between">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ver más artículos
                </Link>
                <button className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                ¿Listo para Encontrar tu Agencia Ideal?
              </h2>
              <p className="text-lg mb-8 opacity-95">
                Explora y compara las mejores agencias de Chile en Vitria
              </p>
              <Link
                href="/agencias"
                className="inline-block bg-accent text-dark px-8 py-4 rounded-lg font-bold hover:bg-white transition shadow-lg"
              >
                Explorar Agencias
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
