import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/server/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const agencyId = session.metadata?.agencyId;

      if (agencyId && session.subscription) {
        const premiumUntil = new Date();
        premiumUntil.setMonth(premiumUntil.getMonth() + 1);

        await db
          .from('agencies')
          .update({
            is_premium: true,
            premium_until: premiumUntil.toISOString(),
          })
          .eq('id', agencyId);

        await db.from('subscriptions').insert({
          agency_id: agencyId,
          plan_id: 'premium',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          current_period_end: premiumUntil.toISOString(),
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;

      await db
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_subscription_id', subscriptionId);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      const { data: sub } = await db
        .from('subscriptions')
        .select('agency_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      if (sub) {
        await db
          .from('agencies')
          .update({ is_premium: false, premium_until: null })
          .eq('id', sub.agency_id);

        await db
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
