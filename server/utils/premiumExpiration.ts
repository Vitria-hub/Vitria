import { db } from '../db';

export async function enforcePremiumFreshness(agencies: any[]): Promise<any[]> {
  if (!agencies || agencies.length === 0) return agencies;

  const now = new Date();
  const expiredAgencyIds: string[] = [];

  const freshAgencies = agencies.map((agency) => {
    if (agency.is_premium && agency.premium_until) {
      const premiumUntil = new Date(agency.premium_until);
      
      if (premiumUntil < now) {
        expiredAgencyIds.push(agency.id);
        return {
          ...agency,
          is_premium: false,
        };
      }
    }
    
    return agency;
  });

  if (expiredAgencyIds.length > 0) {
    await db
      .from('agencies')
      .update({
        is_premium: false,
        updated_at: now.toISOString(),
      })
      .in('id', expiredAgencyIds);

    console.log(`Auto-expired ${expiredAgencyIds.length} premium agencies on query`, {
      timestamp: now.toISOString(),
      agencyIds: expiredAgencyIds,
    });
  }

  return freshAgencies;
}

export async function enforceSingleAgencyPremiumFreshness(agency: any): Promise<any> {
  if (!agency) return agency;

  if (agency.is_premium && agency.premium_until) {
    const now = new Date();
    const premiumUntil = new Date(agency.premium_until);
    
    if (premiumUntil < now) {
      await db
        .from('agencies')
        .update({
          is_premium: false,
          updated_at: now.toISOString(),
        })
        .eq('id', agency.id);

      console.log(`Auto-expired single premium agency on query`, {
        timestamp: now.toISOString(),
        agencyId: agency.id,
        agencyName: agency.name,
      });

      return {
        ...agency,
        is_premium: false,
      };
    }
  }

  return agency;
}
