import { initTRPC, TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    req: opts.req,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  const authHeader = opts.ctx.req?.headers.get('authorization');
  if (!authHeader) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No auth token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid auth token' });
  }

  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, role, full_name, avatar_url')
    .eq('auth_id', user.id)
    .single();

  if (userError || !userData) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED', 
      message: 'User profile not found' 
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      userId: user.id,
      user: userData,
    },
  });
});
