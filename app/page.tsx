import HeroEnhanced from '@/components/HeroEnhanced';
import SectionWrapper from '@/components/SectionWrapper';
import SectionHeader from '@/components/SectionHeader';
import FeaturedAgencyCard from '@/components/FeaturedAgencyCard';
import LoadingLink from '@/components/LoadingLink';
import { Star, ArrowRight } from 'lucide-react';
import { serverClient } from '@/app/_trpc/serverClient';

export default async function Home() {
  const caller = await serverClient();
  
  let featuredAgencies: any[] = [];
  try {
    const result = await caller.agency.list({ 
      page: 1, 
      limit: 6, 
      sort: 'premium' 
    });
    featuredAgencies = result.agencies || [];
  } catch (e) {
    console.error('Error fetching featured agencies:', e);
  }

  return (
    <>
      <HeroEnhanced />

      {featuredAgencies.length > 0 && (
        <SectionWrapper bgVariant="white" showDecor decorPosition="bottom-left">
          <SectionHeader
            eyebrow="Destacadas"
            icon={Star}
            title="Agencias Recomendadas"
            subtitle="Conoce las agencias mejor valoradas por la comunidad"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {featuredAgencies.slice(0, 6).map((agency) => (
              <FeaturedAgencyCard key={agency.id} agency={agency} />
            ))}
          </div>

          <div className="text-center">
            <LoadingLink
              href="/agencias"
              className="inline-flex items-center gap-2 bg-accent text-dark px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition shadow-md"
            >
              Ver todas las agencias <ArrowRight className="w-4 h-4" />
            </LoadingLink>
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
