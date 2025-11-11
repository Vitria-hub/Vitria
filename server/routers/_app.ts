import { router } from '../trpc';
import { agencyRouter } from './agency';
import { reviewRouter } from './review';
import { sponsorRouter } from './sponsor';
import { metricsRouter } from './metrics';

export const appRouter = router({
  agency: agencyRouter,
  review: reviewRouter,
  sponsor: sponsorRouter,
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
