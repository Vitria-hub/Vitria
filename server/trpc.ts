import { initTRPC, TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { createClient } from '@supabase/supabase-js';

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const authHeader = opts.ctx.req?.headers.get('authorization');
  if (!authHeader) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No auth token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid auth token' });
  }

  const { data: userData } = await supabase
    .from('users')
    .select('id, role, full_name, avatar_url')
    .eq('auth_id', user.id)
    .single();

  return opts.next({
    ctx: {
      ...opts.ctx,
      userId: user.id,
      user: userData,
    },
  });
});
