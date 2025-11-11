import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';

// Generar o recuperar session ID del localStorage
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('vitria_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('vitria_session_id', sessionId);
  }
  return sessionId;
};

export function useTracking() {
  const trackViewMutation = trpc.analytics.trackView.useMutation();
  const trackContactMutation = trpc.analytics.trackContact.useMutation();
  const trackSearchMutation = trpc.analytics.trackSearch.useMutation();

  const trackView = (agencyId: string) => {
    if (typeof window === 'undefined') return;
    
    trackViewMutation.mutate({
      agencyId,
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
    });
  };

  const trackContact = (
    agencyId: string,
    contactType: 'phone_click' | 'email_click' | 'website_click' | 'form_submit'
  ) => {
    if (typeof window === 'undefined') return;
    
    trackContactMutation.mutate({
      agencyId,
      contactType,
      sessionId: getSessionId(),
    });
  };

  const trackSearch = (params: {
    searchQuery?: string;
    serviceCategory?: string;
    locationFilter?: string;
    resultsCount: number;
    agenciesShown: string[];
    clickedAgencyId?: string;
    clickedPosition?: number;
  }) => {
    if (typeof window === 'undefined') return;
    
    trackSearchMutation.mutate({
      ...params,
      sessionId: getSessionId(),
    });
  };

  return {
    trackView,
    trackContact,
    trackSearch,
  };
}

// Hook para trackear vista de página automáticamente
export function useTrackPageView(agencyId: string | null | undefined) {
  const { trackView } = useTracking();
  const lastTrackedId = useRef<string | null>(null);

  useEffect(() => {
    if (agencyId && agencyId !== lastTrackedId.current) {
      trackView(agencyId);
      lastTrackedId.current = agencyId;
    }
  }, [agencyId, trackView]);
}
