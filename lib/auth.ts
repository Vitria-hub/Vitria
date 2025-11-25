import { createClient } from '@/utils/supabase/client';

export async function signUp(email: string, password: string, fullName: string, role: 'user' | 'agency' = 'user') {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined,
      data: {
        full_name: fullName,
        intended_role: role,
      }
    }
  });

  if (authError) throw authError;
  return authData;
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle(options?: {
  role?: 'user' | 'agency';
  redirectPath?: string;
}) {
  const supabase = createClient();
  const role = options?.role;
  
  if (typeof window !== 'undefined' && role) {
    const allowedRoles = ['user', 'agency'];
    const safeRole = allowedRoles.includes(role) ? role : 'user';
    const isSecure = window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';
    document.cookie = `pending_oauth_role=${safeRole}; path=/; max-age=600; SameSite=Lax${secureFlag}`;
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL;
  const redirectUrl = new URL('/auth/callback', baseUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl.toString(),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  return { ...user, userData };
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
