import { router } from '../trpc';
import { agencyRouter } from './agency';
import { reviewRouter } from './review';
import { sponsorRouter } from './sponsor';
import { metricsRouter } from './metrics';
import { billingRouter } from './billing';

export const appRouter = router({
  agency: agencyRouter,
  review: reviewRouter,
  sponsor: sponsorRouter,
  metrics: metricsRouter,
  billing: billingRouter,
});

export type AppRouter = typeof appRouter;
