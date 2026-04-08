import { NextRequest, NextResponse } from 'next/server';
import { analyzeIdea } from '../../../lib/ai';
import { sql } from '../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
    }

    const aiData = await analyzeIdea(title, description);

    const result = await sql`
      INSERT INTO ideas (title, description, problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification)
      VALUES (${title}, ${description}, ${aiData.problem}, ${aiData.customer}, ${aiData.market}, ${JSON.stringify(aiData.competitor)}, ${JSON.stringify(aiData.tech_stack)}, ${aiData.risk_level}, ${aiData.profitability_score}, ${aiData.justification})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('POST /api/ideas error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT id, title, description, risk_level, profitability_score, created_at
      FROM ideas
      ORDER BY created_at DESC
    `;

    const formattedList = result.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      riskLevel: row.risk_level,
      profitabilityScore: row.profitability_score,
      createdAt: row.created_at
    }));

    return NextResponse.json(formattedList || [], { status: 200 });
  } catch (error: any) {
    console.error('GET /api/ideas error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
