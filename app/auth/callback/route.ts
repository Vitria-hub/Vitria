import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
  
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

  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
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

    console.log('OAuth exchange successful, redirecting to session verification');
    const verificationUrl = new URL('/auth/verificar-sesion', origin);
    if (pendingRole) {
      verificationUrl.searchParams.set('role', pendingRole);
    }
    response = NextResponse.redirect(verificationUrl.toString());
    
    response.cookies.set('pending_oauth_role', '', { maxAge: 0, path: '/' });
    
    return response;
    
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`);
  }
}
