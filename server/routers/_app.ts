import { router } from '../trpc';
import { agencyRouter } from './agency';
import { reviewRouter } from './review';
import { sponsorRouter } from './sponsor';
import { metricsRouter } from './metrics';
import { adminRouter } from './admin';
import { analyticsRouter } from './analytics';
import { clientRouter } from './client';

export const appRouter = router({
  agency: agencyRouter,
  review: reviewRouter,
  sponsor: sponsorRouter,
  metrics: metricsRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
  client: clientRouter,
});

export type AppRouter = typeof appRouter;
