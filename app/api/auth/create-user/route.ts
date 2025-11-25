import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail } from '@/lib/email';

async function getSessionUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auth_id, full_name, role, send_welcome_email = false } = body;

    if (!auth_id || !full_name || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['user', 'agency'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role - only user and agency allowed' },
        { status: 400 }
      );
    }

    const sessionUserId = await getSessionUserId();

    if (sessionUserId !== auth_id) {
      console.error('Session mismatch:', { sessionUserId, auth_id });
      return NextResponse.json(
        { message: 'Unauthorized - session mismatch' },
        { status: 401 }
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', auth_id)
      .single();

    if (existingUser) {
      console.log('User already exists - preserving existing role:', existingUser.role);
      
      const userCreatedAt = new Date(existingUser.created_at);
      const hoursSinceCreation = (Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60);
      
      let updatedUser = existingUser;
      
      if (hoursSinceCreation < 24) {
        console.log('User created recently - updating full_name if provided');
        
        if (full_name && full_name.trim() && full_name !== 'Usuario') {
          const { data: updated, error: updateError } = await supabaseAdmin
            .from('users')
            .update({ full_name })
            .eq('auth_id', auth_id)
            .select()
            .single();
          
          if (!updateError && updated) {
            updatedUser = updated;
            console.log('Updated full_name for existing user:', full_name);
          }
        }
      }
      
      if (send_welcome_email && !existingUser.welcome_email_sent) {
        console.log('Attempting to send welcome email');
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(auth_id);
        
        if (authUser?.user?.email) {
          try {
            await sendWelcomeEmail(
              authUser.user.email,
              updatedUser.full_name
            );
            await supabaseAdmin
              .from('users')
              .update({ welcome_email_sent: true })
              .eq('auth_id', auth_id);
            console.log('Welcome email sent successfully to existing user:', authUser.user.email);
          } catch (emailError) {
            console.error('Error sending welcome email to existing user:', emailError);
          }
        }
      }
      
      return NextResponse.json(
        { message: 'User already exists', user: updatedUser },
        { status: 200 }
      );
    }
    
    console.log('Creating new user with role:', role);

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(auth_id);
    
    if (authError || !authUser?.user) {
      console.error('Invalid auth_id - user does not exist in Supabase Auth:', auth_id);
      return NextResponse.json(
        { message: 'Invalid auth_id - user not found in authentication system' },
        { status: 400 }
      );
    }

    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id,
        full_name,
        role,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      
      if (error.code === '23505') {
        const { data: existingUserAfterError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('auth_id', auth_id)
          .single();
        
        if (existingUserAfterError) {
          return NextResponse.json(
            { message: 'User already exists', user: existingUserAfterError },
            { status: 200 }
          );
        }
      }
      
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    if (send_welcome_email && authUser?.user?.email) {
      try {
        await sendWelcomeEmail(
          authUser.user.email,
          full_name
        );
        await supabaseAdmin
          .from('users')
          .update({ welcome_email_sent: true })
          .eq('auth_id', auth_id);
        console.log('Welcome email sent successfully to:', authUser.user.email);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }
    }

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
