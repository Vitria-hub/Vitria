import { supabase } from './supabase';

export async function signUp(email: string, password: string, fullName: string, role: 'user' | 'agency' = 'user') {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (authError) throw authError;

  if (authData.user) {
    const { error: userError } = await supabase.from('users').insert({
      auth_id: authData.user.id,
      full_name: fullName,
      role,
    });

    if (userError) throw userError;
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
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
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
