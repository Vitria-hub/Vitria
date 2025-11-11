import { router, publicProcedure } from '../trpc';
import { createCheckoutSchema } from '@/lib/validators';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const billingRouter = router({
  createCheckoutSession: publicProcedure
    .input(createCheckoutSchema)
    .mutation(async ({ input }) => {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Plan Premium',
                description: 'Acceso a funcionalidades premium para agencias',
              },
              unit_amount: 4900,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        metadata: {
          agencyId: input.agencyId,
        },
      });

      return { sessionId: session.id, url: session.url };
    }),
});
