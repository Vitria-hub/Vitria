import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error_code = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;
  
  const cookieStore = await cookies();
  const pendingRole = cookieStore.get('pending_oauth_role')?.value;
  
  console.log('OAuth callback - host:', host);
  console.log('OAuth callback - protocol:', protocol);
  console.log('OAuth callback - pending role from cookie:', pendingRole);
  console.log('OAuth callback - has code:', !!code);

  if (error_code) {
    console.error('OAuth error from provider:', error_code, error_description);
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error_code)}&message=${encodeURIComponent(error_description || 'OAuth error')}`);
  }

  if (!code) {
    console.log('No code found, checking for token in fragment (implicit flow)');
    const redirectUrl = new URL('/auth/verificar-sesion', origin);
    if (pendingRole) {
      redirectUrl.searchParams.set('role', pendingRole);
    }
    return NextResponse.redirect(redirectUrl.toString());
  }

  try {
    console.log('Attempting to exchange code for session');
    
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('OAuth exchange error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed&message=${encodeURIComponent(error.message)}`);
    }

    if (!data.session?.user) {
      console.error('No session returned after exchange');
      return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
    }

    console.log('OAuth exchange successful for user:', data.session.user.email);
    
    const verificationUrl = new URL('/auth/verificar-sesion', origin);
    if (pendingRole) {
      verificationUrl.searchParams.set('role', pendingRole);
    }
    
    cookieStore.set('pending_oauth_role', '', { maxAge: 0, path: '/', sameSite: 'lax', secure: protocol === 'https' });
    
    console.log('Redirecting to verification URL:', verificationUrl.toString());
    return NextResponse.redirect(verificationUrl.toString());
    
  } catch (err: any) {
    console.error('Callback error:', err);
    console.error('Error stack:', err.stack);
    return NextResponse.redirect(`${origin}/auth/login?error=callback_failed&message=${encodeURIComponent(err.message || 'Unknown error')}`);
  }
}
