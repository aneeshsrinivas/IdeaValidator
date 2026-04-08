import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || "");

// Auto-provision the table on every cold start
sql`
  CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    problem TEXT,
    customer TEXT,
    market TEXT,
    competitor JSONB,
    tech_stack JSONB,
    risk_level TEXT,
    profitability_score INTEGER,
    justification TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`.catch((err) => console.error("Error auto-provisioning database inside db.ts:", err));

export { sql };
