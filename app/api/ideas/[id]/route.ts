import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await sql`SELECT * FROM ideas WHERE id = ${id}`;

    if (result.length === 0) {
      return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
    }

    const row = result[0];
    const formattedResult = {
      id: row.id,
      title: row.title,
      description: row.description,
      riskLevel: row.risk_level,
      profitabilityScore: row.profitability_score,
      problemSummary: row.problem,
      customerPersona: row.customer,
      marketOverview: row.market,
      competitors: typeof row.competitor === 'string' ? JSON.parse(row.competitor) : row.competitor,
      techStack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : row.tech_stack,
      justification: row.justification,
      createdAt: row.created_at
    };

    return NextResponse.json(formattedResult, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/ideas/[id] error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await sql`DELETE FROM ideas WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/ideas/[id] error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
