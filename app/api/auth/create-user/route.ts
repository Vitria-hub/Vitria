import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auth_id, full_name, role } = body;

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

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', auth_id)
      .single();

    if (existingUser) {
      console.log('User already exists - preserving existing role:', existingUser.role);
      return NextResponse.json(
        { message: 'User already exists', user: existingUser },
        { status: 200 }
      );
    }
    
    console.log('Creating new user with role:', role);

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

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(auth_id);
    
    if (authUser?.user?.email) {
      try {
        await sendWelcomeEmail(
          authUser.user.email,
          full_name,
          role as 'user' | 'agency'
        );
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
