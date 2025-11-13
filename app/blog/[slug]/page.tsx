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

            <div className="prose prose-lg max-w-none 
              prose-headings:text-primary prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-10
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0
              prose-h2:text-3xl prose-h2:border-b-2 prose-h2:border-mint prose-h2:pb-3
              prose-h3:text-2xl 
              prose-p:text-dark/80 prose-p:leading-relaxed prose-p:mb-6
              prose-ul:my-6 prose-ul:space-y-3 prose-ul:text-dark/80
              prose-ol:my-6 prose-ol:space-y-3 prose-ol:text-dark/80
              prose-li:my-2
              prose-a:text-secondary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-primary prose-strong:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-mint/10 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              ">
              
              <div className="flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-mint/20 to-transparent rounded-lg border-l-4 border-accent">
                <Image
                  src="/vitria-isotipo.png"
                  alt="Vitria"
                  width={40}
                  height={40}
                  className="m-0"
                />
                <p className="m-0 text-sm text-dark/70 italic">
                  Contenido verificado por el equipo de Vitria - Tu directorio de agencias en Chile
                </p>
              </div>

              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>

              <div className="flex items-center justify-center gap-3 mt-12 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border-2 border-accent/30">
                <Image
                  src="/vitria-isotipo.png"
                  alt="Vitria"
                  width={48}
                  height={48}
                  className="m-0"
                />
                <div>
                  <p className="m-0 font-bold text-primary text-lg">¿Te resultó útil esta guía?</p>
                  <p className="m-0 text-sm text-dark/70">Descubre más contenido sobre agencias en nuestro blog</p>
                </div>
              </div>
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
