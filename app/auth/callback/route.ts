import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;
  
  const cookieStore = await cookies();
  const pendingRole = cookieStore.get('pending_oauth_role')?.value;
  
  console.log('OAuth callback - pending role from cookie:', pendingRole);

  if (!code) {
    console.log('No code found, checking for token in fragment (implicit flow)');
    const redirectUrl = new URL('/auth/verificar-sesion', origin);
    if (pendingRole) {
      redirectUrl.searchParams.set('role', pendingRole);
    }
    return NextResponse.redirect(redirectUrl.toString());
  }

  try {
    console.log('Attempting to exchange code for session with code:', code.substring(0, 10) + '...');
    
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('OAuth exchange error:', error);
      console.error('Error details:', JSON.stringify(error));
      return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed&message=${encodeURIComponent(error.message)}`);
    }

    if (!data.session?.user) {
      return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
    }

    console.log('OAuth exchange successful, redirecting to session verification');
    
    const verificationUrl = new URL('/auth/verificar-sesion', origin);
    if (pendingRole) {
      verificationUrl.searchParams.set('role', pendingRole);
    }
    
    cookieStore.set('pending_oauth_role', '', { maxAge: 0, path: '/' });
    
    return NextResponse.redirect(verificationUrl.toString());
    
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`);
  }
}
