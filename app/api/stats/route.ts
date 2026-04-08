import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export async function GET() {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM ideas`;
    const count = result[0].count;
    return NextResponse.json({ totalIdeas: parseInt(count || '0', 10) }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json({ totalIdeas: 0 }, { status: 500 });
  }
}
