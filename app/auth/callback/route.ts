import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const roleParam = requestUrl.searchParams.get('role');
  
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  if (!code) {
    console.log('No code found, checking for token in fragment (implicit flow)');
    return NextResponse.redirect(`${origin}/auth/verificar-sesion?role=${roleParam || ''}`);
  }

  try {
    // Log all cookies to debug PKCE issue
    const allCookies = (await cookies()).getAll();
    console.log('All cookies received:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    
    const supabase = await createClient();
    
    console.log('Attempting to exchange code for session with code:', code.substring(0, 10) + '...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('OAuth exchange error:', error);
      console.error('Error details:', JSON.stringify(error));
      return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed&message=${encodeURIComponent(error.message)}`);
    }

    if (!data.session?.user) {
      return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
    }

    const session = data.session;
    const user = session.user;

    const metadataRole = roleParam || user.user_metadata?.role || 'user';
    const allowedRoles = ['user', 'agency'];
    const intendedRole = allowedRoles.includes(metadataRole) ? metadataRole : 'user';
    
    const fullName = user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'Usuario';

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    let dbUserId = existingUser?.id;
    let finalRole: 'user' | 'agency' | 'admin';

    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabaseAdmin.from('users').insert({
        auth_id: user.id,
        full_name: fullName,
        role: intendedRole as 'user' | 'agency',
      }).select().single();
      
      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.redirect(`${origin}/auth/login?error=user_creation_failed`);
      }
      
      dbUserId = newUser?.id;
      finalRole = intendedRole as 'user' | 'agency';
    } else {
      finalRole = existingUser.role as 'user' | 'agency' | 'admin';
    }

    if (finalRole === 'admin') {
      return NextResponse.redirect(`${origin}/admin`);
    }

    if (finalRole === 'user') {
      const { data: clientProfile } = await supabaseAdmin
        .from('client_profiles')
        .select('*')
        .eq('user_id', dbUserId)
        .single();

      if (!clientProfile) {
        return NextResponse.redirect(`${origin}/auth/registro/cliente/perfil`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }

    if (finalRole === 'agency') {
      const { data: agency } = await supabaseAdmin
        .from('agencies')
        .select('*')
        .eq('owner_id', dbUserId)
        .single();

      if (!agency) {
        return NextResponse.redirect(`${origin}/dashboard/crear-agencia`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
    
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`);
  }
}
