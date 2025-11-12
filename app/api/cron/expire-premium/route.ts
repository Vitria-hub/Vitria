import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();
    
    const { data, error } = await db
      .from('agencies')
      .update({
        is_premium: false,
        updated_at: now,
      })
      .eq('is_premium', true)
      .lt('premium_until', now)
      .select('id, name, premium_until');

    if (error) {
      console.error('Error cleaning expired premium:', error);
      return NextResponse.json(
        { error: 'Error al limpiar premium expirado', details: error.message },
        { status: 500 }
      );
    }

    const expiredCount = data?.length || 0;
    
    console.log(`Cleaned ${expiredCount} expired premium agencies at ${now}`);

    return NextResponse.json({
      success: true,
      timestamp: now,
      expiredCount,
      expiredAgencies: data || [],
    });
  } catch (error) {
    console.error('Unexpected error in expire-premium cron:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
